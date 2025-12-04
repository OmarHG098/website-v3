import Header from "@/components/Header";
import type { FAQSection as FAQSectionType, HeroSection as HeroSectionType, TwoColumnSection as TwoColumnSectionType } from "@shared/schema";
import { FAQSection } from "@/components/career-programs/FAQSection";
import { HeroSection } from "@/components/career-programs/HeroSection";
import { TwoColumn } from "@/components/TwoColumn";
import Briefcase from "@/components/custom-icons/Briefcase";
import Graduation from "@/components/custom-icons/Graduation";
import GrowthChart from "@/components/custom-icons/GrowthChart";
import CodeWindow from "@/components/custom-icons/CodeWindow";
import Monitor from "@/components/custom-icons/Monitor";
import Security from "@/components/custom-icons/Security";
import * as TablerIcons from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ComponentType } from "react";
import eligibleImage from "@assets/reservation-es_1764814854635.webp";
import confidenceImage from "@assets/hombre-joven-con-laptop_1764691956393.webp";

// ============================================
// DATA
// ============================================

const heroData: HeroSectionType = {
  type: "hero",
  title: "Get into tech with our Job Guarantee",
  subtitle: "Your success is our mission — Get hired within 9 months of graduation, or we will refund your tuition. Conditions apply.",
  cta_buttons: [
    { text: "Apply now", url: "#apply", variant: "primary", icon: "Rocket" },
    { text: "Download Details", url: "#syllabus", variant: "outline", icon: "Download" },
  ],
};

const statsData = {
  title: "Does the Job Guarantee deliver results you can count on?",
  description: "Yes, and we've got the numbers to back it up. These stats reflect our full graduate community and demonstrate the proven impact of our programs across the board. We don't just teach you how to code, we help you build a career you're proud of.",
  stats: [
    { value: "84%", label: "Job placement rate", icon: "briefcase" as const },
    { value: "3-6", valueSuffix: "months", label: "Average time to get hired", icon: "graduation" as const },
    { value: "55%", label: "Salary increase after graduation", icon: "growth" as const },
  ],
};

const eligibleData: TwoColumnSectionType = {
  type: "two_column",
  proportions: [9, 3],
  padding_left: "52",
  padding_right: "52",
  background: "bg-primary/5",
  left: {
    heading: "Who's Eligible?",
    sub_heading: "You'll qualify for the Job Guarantee if you:",
    bullets: [
      { text: "Have U.S. work authorization" },
      { text: "Pass our logic test" },
      { text: "Complete all coursework and projects" },
      { text: "Follow our career team's guidance" },
    ],
    description: "*Conditions apply depending on your country or U.S. state",
    button: {
      text: "Apply",
      url: "#apply",
      variant: "primary",
    },
    font_size: "lg"
  },
  right: {
    image: eligibleImage,
    image_alt: "Woman working on laptop",
    image_width: "420px"
  },
};

const programsData = {
  title: "Our Job Guarantee is Available for Our Top Tech Programs",
  subtitle: "Choose your career path. Master the skills and get hired.",
  programs: [
    {
      id: "fullstack",
      category: "Full Stack",
      title: "Full Stack Development with AI",
      description: "Become an AI-fluent software engineer using Python, React and in-demand Vibe Coding tools like Cursor. Master cutting-edge skills and launch a future-proof career.",
      icon: "codewindow" as const,
    },
    {
      id: "datascience",
      category: "With Python",
      title: "Data Science and Machine Learning with AI",
      description: "Learn Python to collect and manage data. Create models and solve problems using Machine Learning, Deep Learning, and AI.",
      icon: "monitor" as const,
    },
    {
      id: "cybersecurity",
      category: "For Windows & Linux",
      title: "Cybersecurity",
      description: "Become an AI-proficient cybersecurity specialist, equipped to identify, manage, and mitigate system vulnerabilities in compliance with ISO and other standards.",
      icon: "security" as const,
    },
  ],
};

const confidenceData: TwoColumnSectionType = {
  type: "two_column",
  proportions: [5, 7],
  background: "bg-primary/5",
  alignment: "center",
  gap: "12",
  reverse_on_mobile: true,
  left: {
    image: confidenceImage,
    image_alt: "Happy graduate with laptop showing the 4Geeks Academy logo",
    image_width: "320px",
    justify: "center",
  },
  right: {
    heading: "Why We Have the Confidence to Offer a Job Guarantee",
    description: "Our goal is more than teaching skills - we're here to launch successful tech careers. With an industry-aligned curriculum, hands-on teaching methodology and personalized career support, we have a proven track record of preparing students for the tech job market.",
    font_size: "base",
    bullets: [
      { text: "Our program's effectiveness is backed by strong placement rates" },
      { text: "The tech industry continues to grow with high demand for talent" },
      { text: "We believe in our teaching approach and your commitment to succeed" },
    ],
    bullet_icon: "Check",
    button: {
      text: "Apply",
      url: "#apply",
      variant: "primary",
    },
  },
};

const refundData = {
  title: "How the Refund Works",
  description: "We've made it simple: if you complete all the required steps, and you don't land a qualifying job within 9 months after graduation, we'll refund 100% of your tuition.",
  steps: [
    { text: "You were not hired into a qualifying role within 9 months of graduation.", icon: "BriefcaseOff" },
    { text: "Our team verifies that you met all Job Guarantee requirements.", icon: "ClipboardCheck" },
    { text: "Receive the full refund within 30 days.", icon: "CashBanknote" },
  ],
  conditionsLink: "https://storage.googleapis.com/4geeks-academy-website/PDF%20and%20Docs/job-guarantee-en.pdf",
};

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

// ============================================
// SECTION COMPONENTS
// ============================================

function StatsSection({ data }: { data: typeof statsData }) {
  const iconMap = {
    briefcase: <Briefcase width="64" height="58" color="#0097CD" />,
    graduation: <Graduation width="64" height="54" />,
    growth: <GrowthChart width="64" height="67" />,
  };

  return (
    <section 
      className="pb-16"
      data-testid="section-stats"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
              data-testid="text-stats-title"
            >
              {data.title}
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              {data.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.stats.map((stat, index) => (
              <Card key={index} data-testid={`stat-item-${index}`} className="p-5 flex items-center gap-5">
                <div className="flex-shrink-0">
                  {iconMap[stat.icon]}
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-semibold text-foreground">
                    {stat.value}
                    {stat.valueSuffix && (
                      <span className="text-xl md:text-2xl ml-1">
                        {stat.valueSuffix}
                      </span>
                    )}
                  </div>
                  <div className="text-base text-muted-foreground mt-1">{stat.label}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function ProgramsSection({ data }: { data: typeof programsData }) {
  const iconMap = {
    codewindow: <CodeWindow width="64" height="64" />,
    monitor: <Monitor width="72" height="72" />,
    security: <Security width="72" height="72" />,
  };

  return (
    <section 
      className="pb-8 pt-10"
      data-testid="section-programs"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-center"
            data-testid="text-programs-title"
          >
            {data.title}
          </h2>
          <p className="text-lg text-center mb-12">
            {data.subtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.programs.map((program) => (
              <Card key={program.id} className="p-6 hover-elevate" data-testid={`card-program-${program.id}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      {program.category}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mt-1">
                      {program.title}
                    </h3>
                  </div>
                  {iconMap[program.icon]}
                </div>
                <p className="text-muted-foreground mb-4">
                  {program.description}
                </p>
                <a 
                  href="#"
                  className="text-primary hover:underline font-medium"
                  data-testid={`button-read-more-${program.id}`}
                >
                  Read More
                </a>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RefundSection({ data }: { data: typeof refundData }) {
  const getIcon = (iconName: string) => {
    const icons = TablerIcons as unknown as Record<string, ComponentType<{ size?: number; className?: string }>>;
    const IconComponent = icons[`Icon${iconName}`];
    return IconComponent ? <IconComponent size={24} className="text-primary" /> : null;
  };

  return (
    <section 
      className="pt-12 pb-10 bg-muted/30"
      data-testid="section-refund"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              data-testid="text-refund-title"
            >
              {data.title}
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-muted-foreground">
              {data.description}
            </p>
            <a 
              href={data.conditionsLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline text-lg mt-2 inline-block"
              data-testid="link-conditions-apply"
            >
              Conditions Apply.
            </a>
          </div>

          {/* Steps Grid - 3 columns on desktop, 1 on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {data.steps.map((step, index) => (
              <div 
                key={index} 
                className="flex flex-col"
                data-testid={`refund-step-${index + 1}`}
              >
                <span className="text-6xl md:text-7xl text-primary font-bold mb-4">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {getIcon(step.icon)}
                  </div>
                  <p className="text-base text-foreground">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function JobGuarantee() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection data={heroData} />
        <StatsSection data={statsData} />
        <TwoColumn data={eligibleData} />
        <RefundSection data={refundData} />
        <ProgramsSection data={programsData} />
        <TwoColumn data={confidenceData} />
        <FAQSection data={faqData} />
      </main>
    </div>
  );
}
