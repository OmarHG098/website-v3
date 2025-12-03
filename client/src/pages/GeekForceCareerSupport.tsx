import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import SolidCard from "@/components/SolidCard";
import { Card } from "@/components/ui/card";
import { IconCheck, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import StairsWithFlag from "@/components/custom-icons/StairsWithFlag";
import Contract from "@/components/custom-icons/Contract";
import Briefcase from "@/components/custom-icons/Briefcase";
import Graduation from "@/components/custom-icons/Graduation";
import GrowthChart from "@/components/custom-icons/GrowthChart";
import careerSupportImage from "@assets/Group-6663_1764711021914.png";
import communityImage from "@assets/community_1764717588840.png";

import logoMicrosoft from "@assets/microsoft_1764719829995.png";
import logoGoogleDev from "@assets/google-developers_1764719904190.png";
import logoBoatsGroup from "@assets/boats_1764719939123.jpg";
import logoMeta from "@assets/meta-logo_1764719959855.png";
import logoEbay from "@assets/ebay_1764719967118.png";
import logoNatGeo from "@assets/natgeo_1764719975443.png";
import logoEvernote from "@assets/evernote_1764719981901.png";
import logoTelefonica from "@assets/telefonica_1764719987250.png";
import logoTwilio from "@assets/twilio_1764719992371.png";
import logoUber from "@assets/uber_1764719999685.png";
import logoNeo9 from "@assets/Neo9_1764720006347.png";
import logoJooble from "@assets/jooble_1764720010702.png";
import logoKpmg from "@assets/kpmg-logo1_1764720019827.png";
import logoUltimate from "@assets/ultimate_1764720025067.png";
import logoTcg from "@assets/tcg_1764720028893.png";
import logoRazz from "@assets/razz_1764720036807.png";
import logoOverseas from "@assets/overseas_1764720045331.png";
import logoDs9 from "@assets/ds9_1764720051158.png";
import logoCoinet from "@assets/coinet_1764720056569.jpg";
import logoStrata from "@assets/strata_1764720063140.png";
import logoMdc from "@assets/mdc_ce_1764720089793.png";
import logoBeaconCouncil from "@assets/beacon_council_1764720100166.jpg";
import logoBlackstone from "@assets/blackstone_1764720124773.png";
import logoCemex from "@assets/cemex_1764720131666.png";

// ============================================
// TYPES
// ============================================

interface IconProps {
  width?: string;
  height?: string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

interface CareerStep {
  icon: React.ComponentType<IconProps>;
  title: string;
  color?: string;
  items: string[];
}

// ============================================
// DATA
// ============================================

const heroData = {
  welcomeText: "Welcome to",
  title: "Career Development",
  subtitle: "for the AI Era",
  description: "Get unlimited 1:1 career support designed for your unique profile and goals—for life. From resume and portfolio building to interviews and AI-driven hiring platforms, we'll give you the personalized mentorship you need to land your first job and keep thriving in today's tech.",
  videoId: "-2ZvlgDnltc",
  videoTitle: "GeekForce Career Support",
};

const unlimitedSupportData = {
  title: "Unlimited Career Support – Always Ahead of Job Market Trends",
  description: "Geekforce is built into every 4Geeks program to make sure you don't just learn tech, but launch a successful career. Through unlimited 1:1 mentorship and group coaching, you'll gain insights, resources, and strategies designed to keep you ahead in the AI-powered job market.",
  features: [
    "Receive tailored guidance aligned with your goals, context, and challenges.",
    "Meet mentors online or in-person whenever you need support—unlimited, for life.",
    "Access proven tools and strategies to make smarter career moves and stay relevant as the tech industry evolves."
  ]
};

const hyperpersonalizedData = {
  title: "Accelerate Your Results with Hyperpersonalized Career Support",
  subtitle: "Combine unlimited 1:1 human mentorship with AI-powered tools to launch your career faster and smarter:",
  features: [
    "Rigobot, our custom AI, gives instant feedback on your resume, portfolio, and projects.",
    "Practice technical interviews and behavioral questions with AI-guided exercises.",
    "Get expert coaching from our mentors who tailor advice to your unique profile and goals."
  ]
};

const statsData = {
  title: "Does Our Career Support Deliver Results You Can Count On?",
  description: "Yes — and we've got the numbers to back it up.",
  stats: [
    { value: "84%", label: "Job Placement Rate", sublabel: "of graduates were hired", icon: "briefcase" as const },
    { value: "3-6", valueSuffix: "months", label: "Average time to get hired", sublabel: "after graduation", icon: "graduation" as const },
    { value: "55%", label: "Salary Increase", sublabel: "higher at new job", icon: "growth" as const },
  ],
};

const whosHiringData = {
  title: "Who's Hiring Our Graduates?",
  subtitle: "Our alumni work at top companies around the world",
  description: "From startups to Fortune 500 companies, 4Geeks graduates are making an impact across industries. Our career support and strong employer network help you land roles at leading tech companies, agencies, and enterprises globally.",
  logos: [
    { src: logoMicrosoft, alt: "Microsoft" },
    { src: logoGoogleDev, alt: "Google Developers" },
    { src: logoBoatsGroup, alt: "Boats Group" },
    { src: logoMeta, alt: "Meta" },
    { src: logoEbay, alt: "eBay" },
    { src: logoNatGeo, alt: "National Geographic" },
    { src: logoEvernote, alt: "Evernote" },
    { src: logoTelefonica, alt: "Telefonica" },
    { src: logoTwilio, alt: "Twilio" },
    { src: logoUber, alt: "Uber" },
    { src: logoNeo9, alt: "Neo9" },
    { src: logoJooble, alt: "Jooble" },
    { src: logoKpmg, alt: "KPMG" },
    { src: logoUltimate, alt: "Ultimate Software" },
    { src: logoTcg, alt: "The Creative Group" },
    { src: logoRazz, alt: "Razz" },
    { src: logoOverseas, alt: "Overseas Leisure Group" },
    { src: logoDs9, alt: "DS9 Design" },
    { src: logoCoinet, alt: "Coinet" },
    { src: logoStrata, alt: "Strata.ai" },
    { src: logoMdc, alt: "Miami Dade College" },
    { src: logoBeaconCouncil, alt: "Miami-Dade Beacon Council" },
    { src: logoBlackstone, alt: "Blackstone" },
    { src: logoCemex, alt: "Cemex" },
  ],
};

const careerProcessData: {
  title: string;
  subtitle: string;
  steps: CareerStep[];
} = {
  title: "Get Hired with Our 3-Step Career Development Process",
  subtitle: "Once you've mastered the technical skills, our structured process helps you build a lasting career in tech — taking you from learning to landing the job.",
  steps: [
    {
      icon: StairsWithFlag,
      title: "1. Profile Optimization",
      items: [
        "Polish LinkedIn, GitHub, and portfolio to attract recruiters and pass AI-based filters.",
        "Build a resume that clears applicant tracking systems (ATS) and highlights your strengths.",
        "Showcase your skills with a recruiter-ready portfolio."
      ]
    },
    {
      icon: Contract,
      title: "2. Interview Preparation",
      items: [
        "Gain confidence with mock technical and behavioral interviews.",
        "Practice coding and problem-solving with auto-graded exercises.",
        "Develop tailored strategies for upcoming interviews."
      ]
    },
    {
      icon: Briefcase,
      title: "3. Strategic Job Search",
      color: "hsl(var(--destructive))",
      items: [
        "Create a personalized job search plan aligned with your goals.",
        "Navigate AI-driven hiring platforms, from resume scanners to automated interviews.",
        "Connect with our extensive network of global hiring partners."
      ]
    }
  ]
};

// ============================================
// SECTION COMPONENTS
// ============================================

function HeroSection({ data }: { data: typeof heroData }) {
  return (
    <section 
      className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background"
      data-testid="section-hero"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3 flex flex-col items-center justify-start">
            <div className="text-center md:text-left">
              <p className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
                {data.welcomeText}
              </p>
              <p className="text-4xl md:text-5xl lg:text-6xl tracking-tight mb-2 font-[1000]">
                <span className="text-foreground">Geek</span>
                <span style={{ color: 'hsl(var(--chart-5))' }}>FORCE</span>:
              </p>
              <h1 
                className="text-3xl md:text-4xl lg:text-5xl font-medium mb-2 text-foreground"
                data-testid="text-hero-title"
              >
                {data.title}
              </h1>
              <p 
                className="text-2xl md:text-3xl lg:text-4xl font-medium mb-6"
                data-testid="text-hero-subtitle"
              >
                {data.subtitle}
              </p>
              
              <p className="text-xl text-foreground mb-8 max-w-xl font-semibold">
                {data.description}
              </p>
            </div>
          </div>
          
          <div className="md:col-span-2 w-full md:w-auto">
            <VideoPlayer 
              videoId={data.videoId} 
              title={data.videoTitle}
              className="w-[370px] md:w-full md:max-w-[400px]"
              ratio="9:12"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function UnlimitedSupportSection({ data }: { data: typeof unlimitedSupportData }) {
  return (
    <section 
      className="py-12 bg-amber-50"
      data-testid="section-unlimited-support"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8 items-center lg:px-12">
          <div className="order-2 md:order-1 md:col-span-2">
            <img 
              src={careerSupportImage} 
              alt="Career support team members collaborating" 
              className="w-full"
              data-testid="img-career-support"
            />
          </div>
          
          <div className="order-1 md:order-2 md:col-span-3">
            <h2 
              className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-4"
              data-testid="text-unlimited-support-title"
            >
              {data.title}
            </h2>
            <p className="text-base mb-6">
              {data.description}
            </p>
            
            <div className="space-y-4">
              {data.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex gap-3 items-start"
                  data-testid={`feature-unlimited-${index}`}
                >
                  <IconCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm text-foreground">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CareerProcessSection({ data }: { data: typeof careerProcessData }) {
  return (
    <section 
      className="py-16 md:py-24 bg-background"
      data-testid="section-career-process"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4"
            data-testid="text-career-process-title"
          >
            {data.title}
          </h2>
          <p className="text-lg max-w-3xl mx-auto">
            {data.subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 p-0 lg:px-24">
          {data.steps.map((step, index) => (
            <SolidCard 
              key={index}
              className="p-3 md:p-5"
              data-testid={`card-step-${index + 1}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <step.icon className="w-12 h-12" width="60px" color={step.color} />
                <h3 className="text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
              </div>
              
              <ul className="space-y-3">
                {step.items.map((item, itemIndex) => (
                  <li 
                    key={itemIndex}
                    className="flex gap-2 items-start text-base"
                  >
                    <IconCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </SolidCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function HyperpersonalizedSection({ data }: { data: typeof hyperpersonalizedData }) {
  return (
    <section 
      className="py-12 bg-muted/30"
      data-testid="section-hyperpersonalized"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-4 xl:gap-20 items-center lg:px-12">
          <div className="order-2 md:order-1 md:col-span-2 flex justify-center">
            <img 
              src={communityImage} 
              alt="4Geeks Academy community members collaborating on a project" 
              className="w-[200px] md:w-full"
              data-testid="img-community"
            />
          </div>
          
          <div className="order-1 md:order-2 md:col-span-3">
            <h2 
              className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-4"
              data-testid="text-hyperpersonalized-title"
            >
              {data.title}
            </h2>
            <p className="text-base mb-6">
              {data.subtitle}
            </p>
            
            <div className="space-y-4">
              {data.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex gap-3 items-start"
                  data-testid={`feature-hyperpersonalized-${index}`}
                >
                  <span className="text-foreground flex-shrink-0">•</span>
                  <p className="text-sm text-foreground">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection({ data }: { data: typeof statsData }) {
  const iconMap = {
    briefcase: <Briefcase width="60" height="54" />,
    graduation: <Graduation width="60" height="51" />,
    growth: <GrowthChart width="60" height="63" />,
  };

  return (
    <section 
      className="py-6 bg-sky-200"
      data-testid="section-stats"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 
              className="text-xl md:text-2xl font-bold mb-2 text-foreground"
              data-testid="text-stats-title"
            >
              {data.title}
            </h2>
            <p className="text-base">
              {data.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            {data.stats.map((stat, index) => (
              <SolidCard key={index} className="p-4 md:p-4">
                <div data-testid={`stat-card-${index}`} className="flex items-center gap-4 md:block">
                  <div className="flex-shrink-0 md:mb-4">
                    {iconMap[stat.icon]}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                    <div className="text-3xl md:text-4xl font-bold text-foreground">
                      {stat.value}
                      {stat.valueSuffix && (
                        <span className="text-lg md:text-xl ml-1">
                          {stat.valueSuffix}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.sublabel}</div>
                  </div>
                </div>
              </SolidCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhosHiringSection({ data }: { data: typeof whosHiringData }) {
  const LOGOS_PER_PAGE = 8;
  const totalPages = Math.ceil(data.logos.length / LOGOS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  }, [totalPages]);

  const goToNext = useCallback(() => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  }, [totalPages]);

  const currentLogos = data.logos.slice(
    currentPage * LOGOS_PER_PAGE,
    currentPage * LOGOS_PER_PAGE + LOGOS_PER_PAGE
  );

  return (
    <section 
      className="py-12 md:py-16 bg-background"
      data-testid="section-whos-hiring"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 
              className="text-2xl md:text-3xl font-bold mb-2 text-foreground"
              data-testid="text-whos-hiring-title"
            >
              {data.title}
            </h2>
            <p className="text-muted-foreground mb-4">
              {data.subtitle}
            </p>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              {data.description}
            </p>
          </div>

          <div className="relative">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                className="flex-shrink-0"
                data-testid="button-carousel-prev"
              >
                <IconChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentLogos.map((logo, index) => (
                  <Card 
                    key={`${currentPage}-${index}`} 
                    className="p-6 flex items-center justify-center h-32"
                    data-testid={`card-logo-${currentPage * LOGOS_PER_PAGE + index}`}
                  >
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="max-h-16 max-w-full object-contain"
                      loading="lazy"
                    />
                  </Card>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="flex-shrink-0"
                data-testid="button-carousel-next"
              >
                <IconChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex justify-center gap-2 mt-6" data-testid="carousel-pagination">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    currentPage === index 
                      ? "bg-primary" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  data-testid={`button-pagination-dot-${index}`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function GeekForceCareerSupport() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection data={heroData} />
        <UnlimitedSupportSection data={unlimitedSupportData} />
        <CareerProcessSection data={careerProcessData} />
        <HyperpersonalizedSection data={hyperpersonalizedData} />
        <StatsSection data={statsData} />
        <WhosHiringSection data={whosHiringData} />
      </main>
    </div>
  );
}
