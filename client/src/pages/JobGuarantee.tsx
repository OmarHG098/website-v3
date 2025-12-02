import Header from "@/components/Header";
import { HeroSection } from "@/components/career-programs/HeroSection";
import type { HeroSection as HeroSectionType } from "@shared/schema";
import FeatureCard from "@/components/job-guarantee/FeatureCard";
import Briefcase from "@/components/CustomIcons/Briefcase";
import Graduation from "@/components/CustomIcons/Graduation";
import GrowthChart from "@/components/CustomIcons/GrowthChart";
import CodeWindow from "@/components/CustomIcons/CodeWindow";
import Monitor from "@/components/CustomIcons/Monitor";
import Security from "@/components/CustomIcons/Security";
import { IconCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
                <p className="text-xl mb-2">
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
                  <div className="mb-6">
                    <Briefcase width="90" height="81" />
                  </div>
                  <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">
                    84%
                  </div>
                  <div className="text-lg text-muted-foreground">Job placement rate</div>
                </div>
              </FeatureCard>
              
              <FeatureCard>
                <div data-testid="stat-card-1">
                  <div className="mb-6">
                    <Graduation width="90" height="77" />
                  </div>
                  <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">
                    3-6<span className="text-3xl md:text-4xl ml-1 md:block md:ml-0">months</span>
                  </div>
                  <div className="text-lg text-muted-foreground">Average time to get hired</div>
                </div>
              </FeatureCard>
              
              <FeatureCard>
                <div data-testid="stat-card-2">
                  <div className="mb-6">
                    <GrowthChart width="90" height="94" />
                  </div>
                  <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">
                    55%
                  </div>
                  <div className="text-lg text-muted-foreground">Salary increase after graduation</div>
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
                  <p className="text-xl text-muted-foreground/60 mb-6">
                    You'll qualify for the Job Guarantee if you:
                  </p>
                  <ul className="space-y-4 mb-6">
                    <li className="flex items-start gap-3">
                      <IconCheck className="text-primary mt-1 flex-shrink-0" size={20} />
                      <span className="text-foreground text-lg">Have U.S. work authorization</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IconCheck className="text-primary mt-1 flex-shrink-0" size={20} />
                      <span className="text-foreground text-lg">Pass our logic test</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IconCheck className="text-primary mt-1 flex-shrink-0" size={20} />
                      <span className="text-foreground text-lg">Complete all coursework and projects</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <IconCheck className="text-primary mt-1 flex-shrink-0" size={20} />
                      <span className="text-foreground text-lg">Follow our career team's guidance</span>
                    </li>
                  </ul>
                  <p className="text-md text-muted-foreground mb-8">
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

        {/* Available Programs Section */}
        <section 
          className="py-16 md:py-24 bg-sky-50"
          data-testid="section-programs"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-center"
                data-testid="text-programs-title"
              >
                Our Job Guarantee is Available for Our Top Tech Programs
              </h2>
              <p className="text-xl text-muted-foreground text-center mb-12">
                Choose your career path. Master the skills and get hired.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Full Stack Card */}
                <Card className="p-6 hover-elevate" data-testid="card-program-fullstack">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Full Stack</span>
                      <h3 className="text-xl font-bold text-foreground mt-1">
                        Full Stack Development with AI
                      </h3>
                    </div>
                    <CodeWindow width="64" height="64" />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Become an AI-fluent software engineer using Python, React and in-demand Vibe Coding tools like Cursor. Master cutting-edge skills and launch a future-proof career.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary" data-testid="button-read-more-fullstack">
                    Read More
                  </Button>
                </Card>

                {/* Data Science Card */}
                <Card className="p-6 hover-elevate" data-testid="card-program-datascience">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">With Python</span>
                      <h3 className="text-xl font-bold text-foreground mt-1">
                        Data Science and Machine Learning with AI
                      </h3>
                    </div>
                    <Monitor width="72" height="72" />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Learn Python to collect and manage data. Create models and solve problems using Machine Learning, Deep Learning, and AI.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary" data-testid="button-read-more-datascience">
                    Read More
                  </Button>
                </Card>

                {/* Cybersecurity Card */}
                <Card className="p-6 hover-elevate" data-testid="card-program-cybersecurity">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">For Windows & Linux</span>
                      <h3 className="text-xl font-bold text-foreground mt-1">
                        Cybersecurity
                      </h3>
                    </div>
                    <Security width="72" height="72" />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Become an AI-proficient cybersecurity specialist, equipped to identify, manage, and mitigate system vulnerabilities in compliance with ISO and other standards.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary" data-testid="button-read-more-cybersecurity">
                    Read More
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
