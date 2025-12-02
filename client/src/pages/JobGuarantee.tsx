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
import BriefcaseOutline from "@/components/CustomIcons/BriefcaseOutline";
import ChecklistVerify from "@/components/CustomIcons/ChecklistVerify";
import FolderCheck from "@/components/CustomIcons/FolderCheck";
import { IconCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import eligibleImage from "@assets/job-guarantee-1_1764687119325.png";
import confidenceImage from "@assets/hombre-joven-con-laptop_1764691956393.webp";

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

        {/* Why We Have Confidence Section */}
        <section 
          className="py-16 md:py-24 bg-background"
          data-testid="section-confidence"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Image Column */}
                <div className="flex justify-center">
                  <img 
                    src={confidenceImage} 
                    alt="Happy graduate with laptop showing the 4Geeks Academy logo"
                    className="max-w-full h-auto rounded-lg"
                    loading="lazy"
                    data-testid="img-confidence"
                  />
                </div>

                {/* Content Column */}
                <div>
                  <h2 
                    className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
                    data-testid="text-confidence-title"
                  >
                    Why We Have the Confidence to Offer a Job Guarantee
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Our goal is more than teaching skills - we're here to launch successful tech careers. With an industry-aligned curriculum, hands-on teaching methodology and personalized career support, we have a proven track record of preparing students for the tech job market.
                  </p>
                  <ul className="space-y-5 mb-8">
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <IconCheck className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-lg text-foreground">
                        Our program's effectiveness is backed by strong placement rates
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <IconCheck className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-lg text-foreground">
                        The tech industry continues to grow with high demand for talent
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <IconCheck className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-lg text-foreground">
                        We believe in our teaching approach and your commitment to succeed
                      </span>
                    </li>
                  </ul>
                  <Button size="lg" data-testid="button-apply-confidence">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How the Refund Works Section */}
        <section 
          className="py-16 md:py-24 bg-muted/30"
          data-testid="section-refund"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 
                  className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
                  data-testid="text-refund-title"
                >
                  How the Refund Works
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  We've made it simple: if you complete all the required steps, and you don't land a qualifying job within 9 months after graduation, we'll refund 100% of your tuition.
                </p>
              </div>

              {/* Desktop Timeline - Horizontal Wave */}
              <div className="hidden md:block relative">
                {/* SVG container for curved lines */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 530 250"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ zIndex: 1 }}
                >
                  {/* Curved line from Step 1 (right edge) to Step 2 (top-left edge) */}
                  <path
                    d="M 135 35 C 165 30, 220 10, 225 120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="12 8"
                    className="text-foreground/60"
                  />
                  {/* Curved line from Step 3 (left edge) to Step 2 (right edge) - inverse curve */}
                  <path
                    d="M 395 35 C 365 100, 310 130, 305 120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="12 8"
                    className="text-foreground/60"
                  />
                </svg>

                <div className="flex justify-center items-start gap-4 max-w-[530px] mx-auto relative" style={{ zIndex: 2 }}>
                  {/* Step 1 - Top */}
                  <div className="flex flex-col items-center flex-1 max-w-[160px]">
                    <div className="w-[110px] h-[110px] rounded-full bg-[#FFF1D1] border-4 border-[#FFB718] flex items-center justify-center">
                      <BriefcaseOutline width={50} height={50} color="#1a1a1a" />
                    </div>
                    <p className="text-base text-foreground text-center mt-4">
                      1. You were not hired into a qualifying role within 9 months of graduation.
                    </p>
                  </div>

                  {/* Step 2 - Lower (offset down) */}
                  <div className="flex flex-col items-center flex-1 max-w-[160px] mt-[70px]">
                    <div className="w-[110px] h-[110px] rounded-full bg-[#FFF1D1] border-4 border-[#FFB718] flex items-center justify-center">
                      <ChecklistVerify width={50} height={50} color="#1a1a1a" />
                    </div>
                    <p className="text-base text-foreground text-center mt-4">
                      2. Our team verifies that you met all Job Guarantee requirements
                    </p>
                  </div>

                  {/* Step 3 - Top */}
                  <div className="flex flex-col items-center flex-1 max-w-[160px]">
                    <div className="w-[110px] h-[110px] rounded-full bg-[#FFF1D1] border-4 border-[#FFB718] flex items-center justify-center">
                      <FolderCheck width={50} height={50} color="#1a1a1a" />
                    </div>
                    <p className="text-base text-foreground text-center mt-4">
                      3. Receive the full refund within 30 days.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Timeline - Vertical Zigzag */}
              <div className="md:hidden flex flex-col items-center w-[300px] mx-auto">
                {/* Step 1 - Icon Left, Text Right */}
                <div className="w-full relative">
                  {/* Dotted line to step 2 */}
                  <svg 
                    className="absolute left-[90px] top-[80px] w-[150px] h-[69px]"
                    viewBox="0 0 200 100"
                    preserveAspectRatio="none"
                    style={{ zIndex: 1 }}
                  >
                    <path
                      d="M 0 10 Q 50 10, 100 50 Q 150 90, 200 90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray="8 6"
                      className="text-foreground/50"
                    />
                  </svg>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="w-[100px] h-[100px] rounded-full bg-[#FFF1D1] border-4 border-[#FFB718] flex items-center justify-center flex-shrink-0">
                      <BriefcaseOutline width={45} height={45} color="#1a1a1a" />
                    </div>
                    <p className="text-sm text-foreground max-w-[140px]">
                      1. You were not hired into a qualifying role within 9 months of graduation.
                    </p>
                  </div>
                </div>

                {/* Step 2 - Text Left, Icon Right */}
                <div className="w-full relative mt-4">
                  {/* Dotted line to step 3 */}
                  <svg 
                    className="absolute right-[90px] top-[80px] w-[150px] h-[69px]"
                    viewBox="0 0 200 100"
                    preserveAspectRatio="none"
                    style={{ zIndex: 1, transform: 'rotate(-45deg)', transformOrigin: 'right center' }}
                  >
                    <path
                      d="M 0 10 Q 50 10, 100 50 Q 150 90, 200 90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray="8 6"
                      className="text-foreground/50"
                    />
                  </svg>
                  <div className="flex items-center justify-between flex-row-reverse relative z-10">
                    <div className="w-[100px] h-[100px] rounded-full bg-[#FFF1D1] border-4 border-[#FFB718] flex items-center justify-center flex-shrink-0">
                      <ChecklistVerify width={45} height={45} color="#1a1a1a" />
                    </div>
                    <p className="text-sm text-foreground text-right max-w-[140px]">
                      2. Our team verifies that you met all Job Guarantee requirements
                    </p>
                  </div>
                </div>

                {/* Step 3 - Icon Left, Text Right */}
                <div className="w-full relative mt-4">
                  <div className="flex items-center justify-between relative z-10">
                    <div className="w-[100px] h-[100px] rounded-full bg-[#FFF1D1] border-4 border-[#FFB718] flex items-center justify-center flex-shrink-0">
                      <FolderCheck width={45} height={45} color="#1a1a1a" />
                    </div>
                    <p className="text-sm text-foreground max-w-[140px]">
                      3. Receive the full refund within 30 days.
                    </p>
                  </div>
                </div>
              </div>

              {/* Conditions Apply Link */}
              <div className="text-center mt-12">
                <a 
                  href="https://storage.googleapis.com/4geeks-academy-website/PDF%20and%20Docs/job-guarantee-en.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-lg"
                  data-testid="link-conditions-apply"
                >
                  Conditions Apply.
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
