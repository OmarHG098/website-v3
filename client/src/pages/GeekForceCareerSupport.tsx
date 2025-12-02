import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import { IconTarget, IconUsers, IconRocket } from "@tabler/icons-react";
import careerSupportImage from "@assets/Group-6663_1764711021914.png";

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
  subtitle: "Geekforce is built into every 4Geeks program to make sure you don't just learn tech, but launch a successful career. Through unlimited 1:1 mentorship and group coaching, you'll gain insights, resources, and strategies designed to keep you ahead in the AI-powered job market.",
  features: [
    {
      icon: IconTarget,
      text: "Receive tailored guidance aligned with your goals, context, and challenges."
    },
    {
      icon: IconUsers,
      text: "Meet mentors online or in-person whenever you need support—unlimited, for life."
    },
    {
      icon: IconRocket,
      text: "Access proven tools and strategies to make smarter career moves and stay relevant as the tech industry evolves."
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
            <div>
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
          
          <div className="md:col-span-2 flex">
            <VideoPlayer 
              videoId={data.videoId} 
              title={data.videoTitle}
              className="w-full max-w-[400px]"
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
      className="py-16 md:py-24 bg-background"
      data-testid="section-unlimited-support"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <img 
              src={careerSupportImage} 
              alt="Career support team members collaborating" 
              className="w-full max-w-lg mx-auto"
              data-testid="img-career-support"
            />
          </div>
          
          <div className="order-1 md:order-2">
            <h2 
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6"
              data-testid="text-unlimited-support-title"
            >
              {data.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {data.subtitle}
            </p>
            
            <div className="space-y-6">
              {data.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex gap-4 items-start"
                  data-testid={`feature-unlimited-${index}`}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-foreground pt-2">
                    {feature.text}
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
      </main>
    </div>
  );
}
