import Header from "@/components/Header";
import type { FAQSection as FAQSectionType } from "@shared/schema";
import FeatureCard from "@/components/job-guarantee/FeatureCard";
import { FAQSection } from "@/components/career-programs/FAQSection";
import Briefcase from "@/components/CustomIcons/Briefcase";
import Graduation from "@/components/CustomIcons/Graduation";
import GrowthChart from "@/components/CustomIcons/GrowthChart";
import CodeWindow from "@/components/CustomIcons/CodeWindow";
import Monitor from "@/components/CustomIcons/Monitor";
import Security from "@/components/CustomIcons/Security";
import BriefcaseOutline from "@/components/CustomIcons/BriefcaseOutline";
import ChecklistVerify from "@/components/CustomIcons/ChecklistVerify";
import FolderCheck from "@/components/CustomIcons/FolderCheck";
import { IconCheck, IconDownload } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import eligibleImage from "@assets/job-guarantee-1_1764687119325.png";
import confidenceImage from "@assets/hombre-joven-con-laptop_1764691956393.webp";

export default function JobGuarantee() {
  const faqData: FAQSectionType = {
    type: "faq",
    title: "Frequently Asked Questions about the Job Guarantee",
    items: [
      {
        question: "How does the 4Geeks Academy Job Guarantee work?",
        answer: "Our Job Guarantee ensures that if you meet all program requirements and still don't get a qualifying tech job within 9 months of graduation, you are eligible for a full refund of your tuition. It's our way of backing the real-world outcomes our bootcamp delivers. Conditions apply.",
      },
      {
        question: "Does the Job Guarantee refund the full tuition if I don't get hired?",
        answer: "Yes. If you qualify for the Job Guarantee and don't receive a qualifying job offer within the job search window, you'll receive a full tuition refund.",
      },
      {
        question: "How long do I have to look for a job before the refund is issued?",
        answer: "You'll have up to 9 months after graduating to secure qualifying employment. If you meet all requirements and are still not hired within that time, you can apply for a full refund.",
      },
      {
        question: "What kinds of jobs count toward the Job Guarantee?",
        answer: "Full-time or contract positions in tech (such as software development, QA, or related roles) qualify. Remote jobs and freelance positions may be eligible depending on terms.",
      },
      {
        question: "Is there a minimum salary for jobs that count?",
        answer: "There is no set salary threshold, but the job must be aligned with the skills taught in the program and be a legitimate entry-level tech role.",
      },
      {
        question: "What do I need to do to qualify for the Job Guarantee?",
        answer: "You must: Complete 100% of coursework and projects, attend sessions consistently, follow the steps our career services team advises, actively apply to jobs and document your search, and hold valid U.S. work authorization.",
      },
      {
        question: "Do I need to have work authorization to qualify?",
        answer: "Yes, you must have valid U.S. work authorization to be eligible for the Job Guarantee.",
      },
      {
        question: "Is attendance important for the Job Guarantee?",
        answer: "Yes, maintaining good attendance throughout the bootcamp is mandatory for eligibility.",
      },
      {
        question: "What coursework or projects must I complete?",
        answer: "You'll need to finish your final project in a satisfactory manner, plus all assigned coding projects, exercises, and coursework provided during the bootcamp.",
      },
      {
        question: "What does it mean to follow the career team's guidance?",
        answer: "It includes completing your resume and portfolio according to our guidelines, participating in mock interviews, and applying to a minimum number of jobs weekly — all with the support of our career services team.",
      },
      {
        question: "Can I finance the additional $2,000 Job Guarantee fee with my tuition?",
        answer: "Yes, in many cases the Job Guarantee fee can be bundled into your overall tuition financing plan.",
      },
      {
        question: "Is the Job Guarantee available for all courses?",
        answer: "No — it is currently only available for select bootcamps, including the Full Stack Development program. Please check your program's eligibility.",
      },
      {
        question: "What's the average time it takes for 4Geeks grads to get hired?",
        answer: "Most 4Geeks Academy graduates find a job within 90 to 180 days of completing the bootcamp, depending on their location, dedication, and prior experience.",
      },
      {
        question: "If I'm offered a contract job, does it count toward the guarantee?",
        answer: "Yes, contract jobs can qualify if they are relevant to the bootcamp training and meet our minimum standards for legitimacy and compensation.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Custom Hero Section with decorative circles */}
        <section 
          className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden"
          data-testid="section-hero"
        >
          {/* Left side decorative circles - simplified for md, full grid for lg+ */}
          {/* MD only: fewer circles in column 1 */}
          <div className="hidden md:flex lg:hidden absolute left-8 top-8 flex-col gap-6">
            <div className="w-4 h-4 rounded-full bg-[#FFB718]" />
            <div className="w-4 h-4 rounded-full bg-[#1a1a1a]" />
            <div className="w-4 h-4 rounded-full bg-[#d1d5db]" />
            <div className="w-4 h-4 rounded-full bg-primary" />
          </div>
          {/* LG+: full 2 column grid */}
          <div className="hidden lg:grid absolute left-16 top-8 grid-cols-2 gap-3">
            {/* Row 1 */}
            <div className="w-4 h-4 rounded-full bg-[#FFB718]" />
            <div />
            {/* Row 2 */}
            <div className="w-4 h-4 rounded-full bg-[#1a1a1a]" />
            <div className="w-4 h-4 rounded-full bg-[#1a1a1a]" />
            {/* Row 3 */}
            <div />
            <div className="w-4 h-4 rounded-full bg-[#d1d5db]" />
            {/* Row 4 */}
            <div className="w-4 h-4 rounded-full bg-[#d1d5db]" />
            <div />
            {/* Row 5 */}
            <div />
            <div className="w-4 h-4 rounded-full bg-[#d1d5db]" />
            {/* Row 6 */}
            <div className="w-4 h-4 rounded-full bg-primary" />
            <div />
            {/* Row 7 */}
            <div />
            <div className="w-4 h-4 rounded-full bg-[#FFB718]" />
            {/* Row 8 */}
            <div className="w-4 h-4 rounded-full bg-[#d1d5db]" />
            <div />
          </div>

          {/* Right side decorative circles */}
          {/* MD only: smaller circle */}
          <div className="hidden md:block lg:hidden absolute right-0 top-1/3 -translate-y-1/2">
            <div className="w-40 h-40 rounded-full bg-[#FFF1D1] translate-x-1/3" />
          </div>
          {/* LG+: large circle with small yellow dot */}
          <div className="hidden lg:block absolute right-0 top-1/3 -translate-y-1/2">
            <div className="w-80 h-80 rounded-full bg-[#FFF1D1] translate-x-1/4" />
          </div>
          <div className="hidden lg:block absolute right-32 bottom-36">
            <div className="w-6 h-6 rounded-full bg-[#FFB718]" />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground"
              data-testid="text-hero-title"
            >
              Get into tech with our Job Guarantee
            </h1>
            
            <p 
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-2"
              data-testid="text-hero-subtitle"
            >
              Your success is our mission — Get hired within 9 months of graduation, or we will refund your tuition.
            </p>
            <a 
              href="https://storage.googleapis.com/4geeks-academy-website/PDF%20and%20Docs/job-guarantee-en.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-lg md:text-xl"
            >
              Conditions apply
            </a>
            <span className="text-lg md:text-xl text-muted-foreground">.</span>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button
                size="lg"
                asChild
                data-testid="button-hero-cta-0"
              >
                <a href="#apply">Apply now</a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                data-testid="button-hero-cta-1"
              >
                <a href="#syllabus" className="flex items-center gap-2">
                  <IconDownload size={20} />
                  Request a syllabus
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section 
          className="py-8 bg-sky-200"
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
                <p className="text-xl">
                  These stats reflect our full graduate community and demonstrate the proven impact of our programs across the board.
                  We don't just teach you how to code, we help you build a career you're proud of.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <FeatureCard>
                <div data-testid="stat-card-0" className="flex items-center gap-6 md:block">
                  <div className="flex-shrink-0 md:mb-6">
                    <Briefcase width="90" height="81" />
                  </div>
                  <div>
                    <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">
                      84%
                    </div>
                    <div className="text-xl text-muted-foreground">Job placement rate</div>
                  </div>
                </div>
              </FeatureCard>
              
              <FeatureCard>
                <div data-testid="stat-card-1" className="flex items-center gap-6 md:block">
                  <div className="flex-shrink-0 md:mb-6">
                    <Graduation width="90" height="77" />
                  </div>
                  <div>
                    <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">
                      3-6<span className="text-2xl md:text-3xl ml-1 md:block md:ml-0 lg:inline lg:ml-1">months</span>
                    </div>
                    <div className="text-xl text-muted-foreground">Average time to get hired</div>
                  </div>
                </div>
              </FeatureCard>
              
              <FeatureCard>
                <div data-testid="stat-card-2" className="flex items-center gap-6 md:block">
                  <div className="flex-shrink-0 md:mb-6">
                    <GrowthChart width="90" height="94" />
                  </div>
                  <div>
                    <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">
                      55%
                    </div>
                    <div className="text-xl text-muted-foreground">Salary increase after graduation</div>
                  </div>
                </div>
              </FeatureCard>
              </div>
            </div>
          </div>
        </section>

        {/* Who's Eligible Section */}
        <section 
          className="py-14 bg-background"
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
                  <p className="text-xl text-muted-foreground mb-6">
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
                    className="max-w-[280px] md:max-w-full h-auto rounded-md"
                    data-testid="img-eligible"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Available Programs Section */}
        <section 
          className="pb-8 pt-10 bg-sky-50"
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
              <p className="text-xl text-center mb-12">
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
          className="pb-8 pt-12 bg-background"
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
                    className="max-w-[280px] md:max-w-full h-auto rounded-lg"
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
          className="pt-18 pb-10 bg-muted/30"
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
                <p className="text-lg max-w-3xl mx-auto">
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
                    d="M 135 55 C 165 50, 220 30, 225 120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="12 8"
                    className="text-foreground"
                  />
                  {/* Curved line from Step 3 (left edge) to Step 2 (right edge) - inverse curve */}
                  <path
                    d="M 395 15 C 350 100, 320 110, 305 95"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="12 8"
                    className="text-foreground"
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

        {/* FAQ Section */}
        <FAQSection data={faqData} />
      </main>
    </div>
  );
}
