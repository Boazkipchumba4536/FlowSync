"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { APP_NODES, APP_CONNECTIONS } from "@/lib/constants";

const nodeMap = Object.fromEntries(APP_NODES.map((n) => [n.id, n]));

export default function NodeGraph() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isHighlighted = (nodeId: string) => {
    if (!hoveredId) return true;
    if (nodeId === hoveredId) return true;
    return APP_CONNECTIONS.some(
      ([a, b]) =>
        (a === hoveredId && b === nodeId) || (b === hoveredId && a === nodeId)
    );
  };

  const isConnectionHighlighted = (a: string, b: string) => {
    if (!hoveredId) return true;
    return a === hoveredId || b === hoveredId;
  };

  return (
    <div className="relative w-full max-w-2xl">
      <svg
        viewBox="0 0 660 280"
        className="h-auto w-full"
        aria-label="App connection graph"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#FF5A1F" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF5A1F" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {APP_CONNECTIONS.map(([from, to], i) => {
          const a = nodeMap[from];
          const b = nodeMap[to];
          if (!a || !b) return null;
          const highlighted = isConnectionHighlighted(from, to);
          return (
            <g key={`${from}-${to}-${i}`}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2"
              />
              <motion.line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="url(#lineGrad)"
                strokeWidth="2"
                strokeDasharray="8 8"
                animate={{ strokeDashoffset: [0, -16] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                opacity={highlighted ? 1 : 0.15}
                filter={highlighted ? "url(#glow)" : undefined}
              />
            </g>
          );
        })}

        {APP_NODES.map((node, nodeIndex) => {
          const highlighted = isHighlighted(node.id);
          const isCenter = node.id === "center";
          const radius = isCenter ? 36 : 28;

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="cursor-pointer"
              style={{ opacity: highlighted ? 1 : 0.35 }}
            >
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={radius + 8}
                fill={node.color}
                opacity={0.15}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: nodeIndex * 0.3,
                }}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={radius}
                fill="#0A0A0F"
                stroke={isCenter ? "#FF5A1F" : node.color}
                strokeWidth={isCenter ? 2.5 : 1.5}
                filter={highlighted ? "url(#glow)" : undefined}
              />
              <text
                x={node.x}
                y={node.y + (isCenter ? 5 : 4)}
                textAnchor="middle"
                fill={node.id === "notion" ? "#888" : node.color}
                fontSize={isCenter ? 11 : 9}
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
              >
                {isCenter ? "⚡" : node.label.slice(0, 2).toUpperCase()}
              </text>
              <text
                x={node.x}
                y={node.y + radius + 16}
                textAnchor="middle"
                fill="rgba(255,255,255,0.7)"
                fontSize="10"
                fontFamily="system-ui, sans-serif"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
