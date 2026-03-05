import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { ReviewSection } from "@/components/ReviewSection";
import { Community } from "@/components/Community";
import { Footer } from "@/components/Footer";
import { useRetentionTracking } from "@/hooks/use-retention-tracking";

export default function Home() {
  useRetentionTracking("/");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ReviewSection />
        <Community />
      </main>
      <Footer />
    </div>
  );
}
