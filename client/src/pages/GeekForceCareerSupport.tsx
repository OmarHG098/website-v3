import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import SolidCard from "@/components/SolidCard";
import { Card } from "@/components/ui/card";
import { IconCheck, IconFlag, IconChevronLeft, IconChevronRight, IconSchool } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Marquee from "react-fast-marquee";
import { TwoColumn } from "@/components/TwoColumn";
import StairsWithFlag from "@/components/custom-icons/StairsWithFlag";
import Contract from "@/components/custom-icons/Contract";
import Briefcase from "@/components/custom-icons/Briefcase";
import Graduation from "@/components/custom-icons/Graduation";
import GrowthChart from "@/components/custom-icons/GrowthChart";
import careerSupportImage from "@assets/Group-6663_1764711021914.png";
import communityImage from "@assets/community_1764717588840.png";

import imgLoretta from "@assets/ttaLoretta_1764725322100.jpeg";
import imgAkers from "@assets/Akers_1764725327796.jpeg";
import imgMaiLinh from "@assets/MaiLinh_1764725334980.png";
import imgCoimbra from "@assets/coimbra_1764725341501.png";
import imgJean from "@assets/JeanSt.Cloud_1764725356935.jpeg";
import imgAlexandra from "@assets/AlexandraEspinoza_1764725386161.jpeg";
import imgGabriel from "@assets/GabrielSalazar_1764725392872.jpeg";
import imgLaura from "@assets/Laura_1764725397398.jpeg";
import imgLeandro from "@assets/Leandro_1764725403142.jpeg";
import imgMelanie from "@assets/MelamnieGalaretto_1764725408397.jpeg";
import imgNatia from "@assets/NatiaLombardo_1764725413363.jpeg";
import imgLuis from "@assets/LuisLarraburo_1764725418057.jpeg";

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
import vectorStroke from "@assets/vector-stroke-light_1764729540525.png";

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

interface Testimonial {
  name: string;
  img: string;
  status: string;
  country: {
    iso: string;
    name: string;
  };
  contributor: string;
  description: string;
  achievement?: string;
}

const testimonialsData: {
  title: string;
  description: string;
  testimonials: Testimonial[];
} = {
  title: "Real Careers Start Here — Just Ask Our Students",
  description: "Our grads are in high demand, with over 84% hired within six months of finishing the program. Student reviews and career results speak for themselves: You'll leave with the technical skills, confidence, and career strategy to break into one of tech's most rewarding fields—and keep growing.",
  testimonials: [
    {
      name: "Loretta Thompson",
      img: imgLoretta,
      status: "Graduated",
      country: { iso: "us", name: "United States of America" },
      contributor: "United Way Miami",
      description: "Loretta joined in 2022 and graduated in 2023. She already found a job within the next few months and has fulfilled the whole circle of skills+job that we all want to complete!",
      achievement: "She got a 45% increase in her salary"
    },
    {
      name: "Rich Akers",
      img: imgAkers,
      status: "Graduated",
      country: { iso: "us", name: "United States of America" },
      contributor: "Clark University",
      description: "Richard is a great developer that just transitioned from a different background and is now working as a web dev in the tech field.",
      achievement: "He got a 30% increase in his salary"
    },
    {
      name: "MaiLinh Tran",
      img: imgMaiLinh,
      status: "Graduated",
      country: { iso: "us", name: "United States of America" },
      contributor: "Clark University",
      description: "An entrepreneur with a passion for technology is now focusing on the dev side of their endeavour.",
      achievement: "She has launched her startup, is capable of hiring new tech talent and coordinates a dev team!"
    },
    {
      name: "Jorge Martín Coimbra",
      img: imgCoimbra,
      status: "Graduated",
      country: { iso: "uy", name: "Uruguay" },
      contributor: "UTEC-BID",
      description: "Martín joined the first program that we launched together with UTEC and IDB. He got a better paying job, a career that he is passionate about and a new professional life.",
      achievement: "He got a 100% increase in his salary"
    },
    {
      name: "Jean St. Cloud",
      img: imgJean,
      status: "Graduated",
      country: { iso: "us", name: "United States of America" },
      contributor: "Clark",
      description: "Jean is transitioning from other industries (Music) and is finding his way into Tech. He got it with the support of Clark University and is already performing as a developer and a Mentor.",
      achievement: "He got a 100% increase in his salary"
    },
    {
      name: "Alexandra Espinoza",
      img: imgAlexandra,
      status: "Graduated",
      country: { iso: "cr", name: "Costa Rica" },
      contributor: "CINDE-BID",
      description: "Alexandra came from a total different background is been a huge revelation for her and everyone around her. She is now a successful and talented software developer in Costa Rica.",
      achievement: "She got a 100% increase in her salary"
    },
    {
      name: "Gabriel Salazar",
      img: imgGabriel,
      status: "Graduated",
      country: { iso: "cr", name: "Costa Rica" },
      contributor: "CINDE-BID",
      description: "Gabriel was already a support specialist at Microsoft and after completing the program he was able to achieve a new position within Microsoft where he is now working as a Software Engineer.",
      achievement: "He got a 50% increase in his salary"
    },
    {
      name: "Laura Magallanes",
      img: imgLaura,
      status: "Graduated",
      country: { iso: "uy", name: "Uruguay" },
      contributor: "UTEC-BID",
      description: "Laura is just extraordinary. From a little town in Uruguay with no experience in Coding, she is now a woman head of household, an Instructor and a Program Coordinator.",
      achievement: "She got a 120% increase in her salary"
    },
    {
      name: "Leandro Matonte",
      img: imgLeandro,
      status: "Graduated",
      country: { iso: "uy", name: "Uruguay" },
      contributor: "UTEC-BID",
      description: "Leandro got into the program with the expectation to achieve a better understanding and some coding skills that will help with his decision of being a computer scientist graduate. Now he is a software developer at a tech firm in Uruguay.",
      achievement: "He got a 60% increase in his salary"
    },
    {
      name: "Melanie Galaretto",
      img: imgMelanie,
      status: "Graduated",
      country: { iso: "uy", name: "Uruguay" },
      contributor: "UTEC-BID",
      description: "Melanie is a young professional who is dreaming of achieving a life that now she owns. She is a resourceful and committed software developer working for a software firm in her home country.",
      achievement: "She got a +100% increase in her salary"
    },
    {
      name: "Natia Lombardo",
      img: imgNatia,
      status: "Graduated",
      country: { iso: "uy", name: "Uruguay" },
      contributor: "UTEC-BID",
      description: "Natia is a philosopher and a software developer. Currently working as a QA Engineer of a huge and successful International firm."
    },
    {
      name: "Luis Larraburo",
      img: imgLuis,
      status: "Graduated",
      country: { iso: "cr", name: "Costa Rica" },
      contributor: "CINDE-BID",
      description: "Luis came to the program without any previous experience, He is now a software developer working on a tech firm in Costa Rica.",
      achievement: "He got a 50% increase in his salary"
    }
  ]
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
      className="py-16 md:py-20 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden"
      data-testid="section-hero"
    >
      <div className="hidden md:block lg:hidden absolute right-0 top-1/4 -translate-y-1/2">
        <div className="w-40 h-40 rounded-full bg-[#FFF1D1] translate-x-1/3" />
      </div>
      <div className="hidden lg:block absolute right-0 top-1/4 -translate-y-1/2">
        <div className="w-80 h-80 rounded-full bg-[#FFF1D1] translate-x-1/4" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3 flex flex-col items-center justify-start">
            <div className="text-center md:text-left relative">
              <img 
                src={vectorStroke} 
                alt="" 
                className="absolute right-0 md:right-[-100px] top-0 w-[120px] md:w-[180px] h-[120px] md:h-[180px] opacity-20"
                style={{ filter: 'grayscale(100%) brightness(0.5)' }}
              />
              <p className="text-4xl lg:text-5xl font-medium text-foreground">
                {data.welcomeText}
              </p>
              <p className="text-5xl lg:text-6xl tracking-tight mb-2 font-[1000]">
                <span className="text-foreground">Geek</span>
                <span style={{ color: 'hsl(var(--chart-5))' }}>FORCE</span>:
              </p>
              <h1 
                className="text-4xl lg:text-5xl font-medium mb-2 text-foreground"
                data-testid="text-hero-title"
              >
                {data.title}
              </h1>
              <p 
                className="text-3xl lg:text-4xl font-medium mb-6"
                data-testid="text-hero-subtitle"
              >
                {data.subtitle}
              </p>
              
              <div className="relative">
                <img 
                  src={vectorStroke} 
                  alt="" 
                  className="absolute -left-[100px] md:-left-[140px] -bottom-8 w-[85px] md:w-[126px] h-[85px] md:h-[126px] opacity-20 rotate-180"
                  style={{ filter: 'grayscale(100%) brightness(0.5)' }}
                />
                <p className="text-xl text-foreground mb-8 max-w-xl font-semibold">
                  {data.description}
                </p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 w-full md:w-auto flex justify-center md:justify-start">
            <VideoPlayer 
              videoId={data.videoId} 
              title={data.videoTitle}
              className="w-[280px] md:w-full md:max-w-[400px]"
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
    <TwoColumn 
      data={{
        type: "two_column",
        background: "bg-primary/10",
        proportions: [6, 6],
        padding_left: "52",
        padding_right: "52",
        reverse_on_mobile: true,
        alignment: "center",
        right: {
          image: careerSupportImage,
          image_alt: "Career support team members collaborating",
          image_width: "500px"
        },
        left: {
          heading: data.title,
          description: data.description,
          justify: "center",
          text_align: "left",
          font_size: "base",
          bullet_icon: "Check",
          bullets: data.features.map(feature => ({
            text: feature,
          })),
        },
      }}
    />
  );
}

function CareerProcessSection({ data }: { data: typeof careerProcessData }) {
  return (
    <section 
      className="py-16 md:py-20 bg-background"
      data-testid="section-career-process"
    >
      <div className="max-w-6xl mx-auto px-4">
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
        
        <div className="grid md:grid-cols-3 gap-6">
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

// Hyperpersonalized Career Support Section - Uses TwoColumn component
function HyperpersonalizedSection({ data }: { data: typeof hyperpersonalizedData }) {
  return (
    <TwoColumn
      data={{
        type: "two_column",
        proportions: [4, 8],
        padding_left: "52",
        padding_right: "52",
        background: "bg-muted/30",
        alignment: "center",
        gap: "12",
        reverse_on_mobile: true,
        left: {
          image: communityImage,
          image_alt: "4Geeks Academy community members collaborating on a project",
          justify: "center",
        },
        right: {
          heading: data.title,
          description: data.subtitle,
          bullets: data.features.map(feature => ({ text: feature })),
          font_size: "sm",
        },
      }}
    />
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
      className="py-8 bg-sky-200"
      data-testid="section-stats"
    >
      <div className="max-w-6xl mx-auto px-4">
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
    </section>
  );
}

function WhosHiringSection({ data }: { data: typeof whosHiringData }) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const LOGOS_PER_PAGE = isMobile ? 4 : 8;
  const totalPages = Math.ceil(data.logos.length / LOGOS_PER_PAGE);

  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [currentPage, totalPages]);

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
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-3"
            data-testid="text-whos-hiring-title"
          >
            {data.title}
          </h2>
          <p className="text-lg md:text-xl mb-4">
            {data.subtitle}
          </p>
          <p className="text-base md:text-lg max-w-3xl mx-auto">
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
                    className="p-3 lg:p-6 flex items-center justify-center h-20 sm:h-40"
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
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card 
      className="w-[300px] h-[490px] -mx-7 md:mx-2 flex-shrink-0 overflow-visible flex flex-col scale-[0.75] md:scale-100 origin-center"
      data-testid={`card-testimonial-${testimonial.name.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="h-[170px] w-full overflow-hidden flex-shrink-0">
        <img 
          src={testimonial.img} 
          alt={testimonial.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-1 gap-2">
          <h4 className="font-bold text-foreground text-lg leading-tight">{testimonial.name}</h4>
          {testimonial.status === "Graduated" && (
            <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
              <IconSchool className="w-5 h-5" />
              <span className="text-base">Graduated</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 mb-1">
          <span 
            className={`flag flag-xs flag-country-${testimonial.country.iso.toLowerCase()}`}
            style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }}
          />
          <span className="text-base text-foreground">{testimonial.country.name}</span>
        </div>
        
        <p className="text-base text-muted-foreground mb-2">
          Contributor: {testimonial.contributor}
        </p>
        
        <div className="border-t border-border mb-2" />
        
        <p className="text-base text-foreground flex-1 overflow-hidden line-clamp-5 mb-2">
          {testimonial.description}
        </p>
        
        {testimonial.achievement ? (
          <div className="bg-amber-100 dark:bg-amber-900/30 rounded-md p-2 flex items-start gap-1.5 mt-auto flex-shrink-0">
            <IconFlag className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
              {testimonial.achievement}
            </p>
          </div>
        ) : (
          <div className="h-10 mt-auto flex-shrink-0" />
        )}
      </div>
    </Card>
  );
}

function TestimonialsSection({ data }: { data: typeof testimonialsData }) {
  return (
    <section 
      className="py-12 md:py-16 bg-sidebar"
      data-testid="section-testimonials"
    >
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <h2 
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-foreground mb-4"
          data-testid="text-testimonials-title"
        >
          {data.title}
        </h2>
        <p 
          className="text-center text-foreground max-w-3xl mx-auto text-base md:text-lg"
          data-testid="text-testimonials-description"
        >
          {data.description}
        </p>
      </div>
      
      <Marquee 
        gradient={false} 
        speed={40} 
        pauseOnHover={true}
        data-testid="marquee-testimonials"
      >
        {data.testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </Marquee>
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
        <TestimonialsSection data={testimonialsData} />
      </main>
    </div>
  );
}
