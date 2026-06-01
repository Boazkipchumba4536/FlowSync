import { prisma } from "@/lib/prisma";
import { addAuditLog } from "@/lib/server/audit";
import type { ExecutionResultDTO, UserPlan } from "@/lib/types";

export type ExecutionResult = ExecutionResultDTO;

function randomDuration() {
  return `${(Math.random() * 3 + 0.5).toFixed(1)}s`;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function executeWorkflow(
  userId: string,
  workflowId: string
): Promise<ExecutionResult> {
  const [workflow, user] = await Promise.all([
    prisma.workflow.findFirst({
      where: { id: workflowId, userId },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    }),
  ]);

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  const plan = (user?.plan ?? "free") as UserPlan;
  const maxRetries = plan === "free" ? 0 : plan === "pro" ? 1 : plan === "team" ? 2 : 3;

  const actions: string[] = JSON.parse(workflow.actions);
  const steps: ExecutionResult["steps"] = [];

  steps.push({
    step: `Trigger: ${workflow.trigger}`,
    status: "success",
    output: "Event received",
    attempts: 1,
  });

  for (const action of actions) {
    let attempt = 0;
    let actionSucceeded = false;

    // Zapier-like resilience: retry failed steps before failing the whole run.
    while (attempt <= maxRetries) {
      attempt += 1;
      const success = Math.random() > 0.05;
      if (success) {
        actionSucceeded = true;
        break;
      }

      if (attempt <= maxRetries) {
        // Exponential backoff with capped delay.
        const backoffMs = Math.min(1200, 150 * Math.pow(2, attempt - 1));
        await sleep(backoffMs);
      }
    }

    steps.push({
      step: action,
      status: actionSucceeded ? "success" : "error",
      attempts: attempt,
      output: actionSucceeded
        ? attempt > 1
          ? `Succeeded after ${attempt} attempts (retries used)`
          : "Completed on first attempt"
        : `Failed after ${attempt} attempts`,
    });

    if (!actionSucceeded) {
      const duration = randomDuration();
      await prisma.runLog.create({
        data: {
          userId,
          workflowId,
          workflowName: workflow.name,
          status: "error",
          duration,
          steps: JSON.stringify(steps),
          error: `Failed at step: ${action} (after ${attempt} attempts)`,
        },
      });
      await addAuditLog(
        "workflow_run",
        `Workflow "${workflow.name}" failed at "${action}" after ${attempt} attempts`,
        userId
      );
      return {
        success: false,
        duration,
        steps,
        error: `Failed at step: ${action} (after ${attempt} attempts)`,
      };
    }
  }

  const duration = randomDuration();
  const now = new Date();

  await prisma.$transaction([
    prisma.workflow.update({
      where: { id: workflowId },
      data: { runs: { increment: 1 }, lastRun: now },
    }),
    prisma.runLog.create({
      data: {
        userId,
        workflowId,
        workflowName: workflow.name,
        status: "success",
        duration,
        steps: JSON.stringify(steps),
      },
    }),
  ]);

  await addAuditLog("workflow_run", `Workflow "${workflow.name}" executed successfully`, userId);

  return { success: true, duration, steps };
}

export async function simulateTriggerPoll(userId: string) {
  const active = await prisma.workflow.findMany({
    where: { userId, status: "on" },
    take: 5,
  });

  if (active.length === 0) return [];

  const results = [];
  for (const wf of active) {
    if (Math.random() > 0.7) {
      const result = await executeWorkflow(userId, wf.id);
      results.push({ workflowId: wf.id, name: wf.name, ...result });
    }
  }
  return results;
}
