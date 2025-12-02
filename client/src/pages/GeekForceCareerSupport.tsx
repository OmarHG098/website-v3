import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import SolidCard from "@/components/SolidCard";
import { IconCheck } from "@tabler/icons-react";
import StairsWithFlag from "@/components/custom-icons/StairsWithFlag";
import Contract from "@/components/custom-icons/Contract";
import Briefcase from "@/components/custom-icons/Briefcase";
import careerSupportImage from "@assets/Group-6663_1764711021914.png";

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
          
          <div className="md:col-span-2 flex w-full md:w-auto">
            <VideoPlayer 
              videoId={data.videoId} 
              title={data.videoTitle}
              className="w-full md:max-w-[400px]"
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
      </main>
    </div>
  );
}
