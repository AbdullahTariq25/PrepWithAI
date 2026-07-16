import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import ProductWorkflowShowcase from "@/components/landing/ProductWorkflowShowcase";
import CareerIntelligenceShowcase from "@/components/landing/CareerIntelligenceShowcase";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import InterviewTracks from "@/components/landing/InterviewTracks";
import PracticeLoop from "@/components/landing/PracticeLoop";
import LiveDemo from "@/components/landing/LiveDemo";
import ComparisonTable from "@/components/landing/ComparisonTable";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#08080c]">
      <Navbar />
      <Hero />
      <SocialProof />
      <ProductWorkflowShowcase />
      <CareerIntelligenceShowcase />
      <div id="features" className="scroll-mt-28">
        <Features />
      </div>
      <div id="how-it-works" className="scroll-mt-28">
        <HowItWorks />
      </div>
      <InterviewTracks />
      <PracticeLoop />
      <LiveDemo />
      <ComparisonTable />
      <div id="pricing" className="scroll-mt-28">
        <Pricing />
      </div>
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
