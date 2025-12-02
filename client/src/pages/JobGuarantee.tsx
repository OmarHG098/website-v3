import Header from "@/components/Header";
import { HeroSection } from "@/components/career-programs/HeroSection";
import type { HeroSection as HeroSectionType } from "@shared/schema";
import GrowthChart from "@/components/job-guarantee/GrowthChart";

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

  const stats = [
    {
      value: "84%",
      label: "Job placement rate",
    },
    {
      value: "3-6",
      unit: "months",
      label: "Average time to get hired",
    },
    {
      value: "55%",
      label: "Salary increase after graduation",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection data={heroData} />

        {/* Stats Section */}
        <section 
          className="py-16 md:py-24 bg-muted/30"
          data-testid="section-stats"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <GrowthChart width="120px" height="125px" />
              </div>
              <h2 
                className="text-2xl md:text-3xl font-bold mb-4 text-foreground"
                data-testid="text-stats-title"
              >
                Does the Job Guarantee Deliver Results You Can Count On?
              </h2>
              <p className="text-lg text-primary font-semibold mb-4">
                Yes — and we've got the numbers to back it up.
              </p>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                These stats reflect our full graduate community and demonstrate the proven impact of our programs across the board.
                We don't just teach you how to code — we help you build a career you're proud of.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center p-6 bg-card rounded-md border border-border"
                  data-testid={`stat-card-${index}`}
                >
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-1">
                    {stat.value}
                    {stat.unit && (
                      <span className="text-2xl md:text-3xl ml-1">{stat.unit}</span>
                    )}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
