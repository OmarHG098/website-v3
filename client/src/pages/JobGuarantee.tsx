import Header from "@/components/Header";
import type { FAQSection as FAQSectionType, TwoColumnSection as TwoColumnSectionType, FeaturesGridHighlightSection, FeaturesGridDetailedSection, HeroTwoColumnSimpleCard } from "@shared/schema";
import { FAQSection } from "@/components/career-programs/FAQSection";
import { TwoColumn } from "@/components/TwoColumn";
import NumberedSteps, { type NumberedStepsData } from "@/components/NumberedSteps";
import { FeaturesGrid } from "@/components/features-grid/FeaturesGrid";
import { Hero } from "@/components/hero/Hero";
import eligibleImage from "@assets/reservation-es_1764814854635.webp";
import confidenceImage from "@assets/hombre-joven-con-laptop_1764691956393.webp";
import heroImage from "@assets/generated_images/Students_collaborating_workspace_d1560810.webp";

// ============================================
// DATA
// ============================================

const heroData: HeroTwoColumnSimpleCard = {
  type: "hero",
  version: "1.0",
  variant: "twoColumnSimpleCard",
  title: "Get into tech with our Job Guarantee",
  subtitle: "Your success is our mission. Get hired within 9 months of graduation, or we will refund your tuition. Conditions apply.",
  image: {
    src: heroImage,
    alt: "Students collaborating in a tech workspace",
  },
  cta_buttons: [
    { text: "Apply now", url: "#apply", variant: "primary", icon: "Rocket" },
    { text: "Download Details", url: "#syllabus", variant: "outline", icon: "Download" },
  ],
};

const statsData: FeaturesGridHighlightSection = {
  type: "features_grid",
  title: "Does the Job Guarantee deliver results you can count on?",
  subtitle: "Yes, and we've got the numbers to back it up. These stats reflect our full graduate community and demonstrate the proven impact of our programs across the board. We don't just teach you how to code, we help you build a career you're proud of.",
  columns: 3,
  items: [
    { icon: "Briefcase", icon_color: "#0097CD", value: "84%", title: "Job placement rate" },
    { icon: "Graduation", icon_color: "#0097CD", value: "3-6 months", title: "Average time to get hired" },
    { icon: "GrowthChart", icon_color: "#0097CD", value: "55%", title: "Salary increase after graduation" },
  ],
};

const eligibleData: TwoColumnSectionType = {
  type: "two_column",
  proportions: [8, 4],
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
    image_max_width: "420px"
  },
};

const programsData: FeaturesGridDetailedSection = {
  type: "features_grid",
  variant: "detailed",
  title: "Our Job Guarantee is Available for Our Top Tech Programs",
  subtitle: "Choose your career path. Master the skills and get hired.",
  columns: 3,
  collapsible_mobile: true,
  items: [
    {
      id: "fullstack",
      category: "Full Stack",
      title: "Full Stack Development with AI",
      description: "Become an AI-fluent software engineer using Python, React and in-demand Vibe Coding tools like Cursor. Master cutting-edge skills and launch a future-proof career.",
      icon: "CodeWindow",
      link_url: "#",
      link_text: "Read More",
    },
    {
      id: "datascience",
      category: "With Python",
      title: "Data Science and Machine Learning with AI",
      description: "Learn Python to collect and manage data. Create models and solve problems using Machine Learning, Deep Learning, and AI.",
      icon: "Monitor",
      link_url: "#",
      link_text: "Read More",
    },
    {
      id: "cybersecurity",
      category: "For Windows & Linux",
      title: "Cybersecurity",
      description: "Become an AI-proficient cybersecurity specialist, equipped to identify, manage, and mitigate system vulnerabilities in compliance with ISO and other standards.",
      icon: "Security",
      link_url: "#",
      link_text: "Read More",
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
    justify: "start",
  },
  right: {
    heading: "Why We Have the Confidence to Offer a Job Guarantee",
    description: "Our goal is more than teaching skills - we're here to launch successful tech careers. With an industry-aligned curriculum, hands-on teaching methodology and personalized career support, we have a proven track record of preparing students for the tech job market.",
    font_size: "base",
    bullets_visible: 2,
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

const refundData: NumberedStepsData = {
  title: "How the Refund Works",
  description: "We've made it simple: if you complete all the required steps, and you don't land a qualifying job within 9 months after graduation, we'll refund 100% of your tuition.",
  description_link: {
    text: "Conditions Apply.",
    url: "https://storage.googleapis.com/4geeks-academy-website/PDF%20and%20Docs/job-guarantee-en.pdf",
  },
  steps: [
    { text: "You were not hired into a qualifying role within 9 months of graduation.", icon: "BriefcaseOff" },
    { text: "Our team verifies that you met all Job Guarantee requirements.", icon: "ClipboardCheck" },
    { text: "Receive the full refund within 30 days.", icon: "CashBanknote" },
  ],
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
// MAIN PAGE COMPONENT
// ============================================

export default function JobGuarantee() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero data={heroData} />
        <FeaturesGrid data={statsData} />
        <TwoColumn data={eligibleData} />
        <FeaturesGrid data={programsData} />
        <NumberedSteps data={refundData} />
        <TwoColumn data={confidenceData} />
        <FAQSection data={faqData} />
      </main>
    </div>
  );
}
