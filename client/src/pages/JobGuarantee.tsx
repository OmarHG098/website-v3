import Header from "@/components/Header";
import { HeroSection } from "@/components/career-programs/HeroSection";
import type { HeroSection as HeroSectionType } from "@shared/schema";
import FeatureCard from "@/components/job-guarantee/FeatureCard";
import Briefcase from "@/components/CustomIcons/Briefcase";
import Graduation from "@/components/CustomIcons/Graduation";
import GrowthChart from "@/components/CustomIcons/GrowthChart";

export default function JobGuarantee() {
  const heroData: HeroSectionType = {
    type: "hero",
    title: "Get into tech with our Job Guarantee",
    subtitle: "Your success is our mission. Get hired within 9 months of graduation, or we will refund your tuition. Conditions apply.",
    cta_buttons: [
      {
        text: "Apply now",
        url: "#apply",
        variant: "primary",
      },
      {
        text: "Request a syllabus",
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

        {/* Stats Section */}
        <section 
          className="py-16 md:py-24 bg-muted"
          data-testid="section-stats"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-left mb-12">
                <h2 
                  className="text-3xl font-bold mb-4 text-foreground text-center"
                  data-testid="text-stats-title"
                >
                  Does the Job Guarantee Deliver Results You Can Count On?
                </h2>
                <p className="text-lg text-primary font-semibold mb-2">
                  Yes, and we've got the numbers to back it up.
                </p>
                <p className="text-muted-foreground">
                  These stats reflect our full graduate community and demonstrate the proven impact of our programs across the board.
                  We don't just teach you how to code, we help you build a career you're proud of.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
              <FeatureCard>
                <div data-testid="stat-card-0">
                  <div className="mb-4">
                    <Briefcase width="70" height="63" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-1">
                    84%
                  </div>
                  <div className="text-muted-foreground">Job placement rate</div>
                </div>
              </FeatureCard>
              
              <FeatureCard>
                <div data-testid="stat-card-1">
                  <div className="mb-4">
                    <Graduation width="70" height="60" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-1">
                    3-6<span className="text-2xl md:text-3xl ml-1">months</span>
                  </div>
                  <div className="text-muted-foreground">Average time to get hired</div>
                </div>
              </FeatureCard>
              
              <FeatureCard>
                <div data-testid="stat-card-2">
                  <div className="mb-4">
                    <GrowthChart width="70" height="73" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-1">
                    55%
                  </div>
                  <div className="text-muted-foreground">Salary increase after graduation</div>
                </div>
              </FeatureCard>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
