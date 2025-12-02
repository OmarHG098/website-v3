import Header from "@/components/Header";
import { HeroSection } from "@/components/career-programs/HeroSection";
import type { HeroSection as HeroSectionType } from "@shared/schema";

export default function JobGuarantee() {
  const heroData: HeroSectionType = {
    type: "hero",
    title: "Get Into Tech With Our Job Guarantee",
    subtitle: "Your success is our mission — Get hired within 9 months of graduation, or we will refund your tuition. Conditions apply.",
    cta_buttons: [
      {
        text: "APPLY NOW",
        url: "#apply",
        variant: "primary",
      },
      {
        text: "REQUEST A SYLLABUS",
        url: "#syllabus",
        variant: "outline",
        icon: "FileDownload",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection data={heroData} />
      </main>
    </div>
  );
}
