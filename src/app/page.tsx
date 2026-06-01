import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";
import BentoGrid from "@/components/BentoGrid";
import StatsSection from "@/components/StatsSection";
import ProductTabs from "@/components/ProductTabs";
import Testimonials from "@/components/Testimonials";
import GovernanceSection from "@/components/GovernanceSection";
import FooterCTA from "@/components/FooterCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <LogoMarquee />
      <BentoGrid />
      <StatsSection />
      <ProductTabs />
      <Testimonials />
      <GovernanceSection />
      <FooterCTA />
      <Footer />
    </main>
  );
}
