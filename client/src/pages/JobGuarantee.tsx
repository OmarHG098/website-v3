import Header from "@/components/Header";
import { HeroSection } from "@/components/career-programs/HeroSection";
import type { HeroSection as HeroSectionType } from "@shared/schema";
import FeatureCard from "@/components/job-guarantee/FeatureCard";
import Briefcase from "@/components/CustomIcons/Briefcase";
import Graduation from "@/components/CustomIcons/Graduation";
import GrowthChart from "@/components/CustomIcons/GrowthChart";
import { IconCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import eligibleImage from "@assets/job-guarantee-1_1764687119325.png";

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
          className="py-16 md:py-24 bg-sky-200"
          data-testid="section-stats"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-left mb-12">
                <h2 
                  className="text-3xl font-bold mb-4 text-foreground text-center"
                  data-testid="text-stats-title"
                >
                  Does the Job Guarantee Deliver Results You Can Count On?
                </h2>
                <p className="text-xl font-semibold mb-2">
                  Yes, and we've got the numbers to back it up.
                </p>
                <p className="text-muted-foreground text-xl">
                  These stats reflect our full graduate community and demonstrate the proven impact of our programs across the board.
                  We don't just teach you how to code, we help you build a career you're proud of.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
                    3-6<span className="text-2xl md:text-3xl ml-1 md:block md:ml-0">months</span>
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

        {/* Who's Eligible Section */}
        <section 
          className="py-16 md:py-24 bg-background"
          data-testid="section-eligible"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 
                    className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
                    data-testid="text-eligible-title"
                  >
                    Who's Eligible?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    You'll qualify for the Job Guarantee if you:
                  </p>
                  <ul className="space-y-4 mb-6">
                    <li className="flex items-start gap-3">
                      <IconCheck className="text-primary mt-1 flex-shrink-0" size={20} />
                      <span className="text-foreground">Have U.S. work authorization</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IconCheck className="text-primary mt-1 flex-shrink-0" size={20} />
                      <span className="text-foreground">Pass our logic test</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IconCheck className="text-primary mt-1 flex-shrink-0" size={20} />
                      <span className="text-foreground">Complete all coursework and projects</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IconCheck className="text-primary mt-1 flex-shrink-0" size={20} />
                      <span className="text-foreground">Follow our career team's guidance</span>
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mb-8">
                    *Conditions apply depending on your country or U.S. state
                  </p>
                  <Button size="lg" data-testid="button-apply-eligible" className="text-md px-6">
                    Apply
                  </Button>
                </div>
                <div className="flex justify-center">
                  <img 
                    src={eligibleImage} 
                    alt="Woman working on laptop" 
                    className="max-w-full h-auto rounded-md"
                    data-testid="img-eligible"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
