import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";

// ============================================
// DATA
// ============================================

const heroData = {
  welcomeText: "Welcome to",
  brandGeek: "Geek",
  brandForce: "FORCE",
  title: "Career Development",
  subtitle: "for the AI Era",
  description: "Get unlimited 1:1 career support designed for your unique profile and goals—for life. From resume and portfolio building to interviews and AI-driven hiring platforms, we'll give you the personalized mentorship you need to land your first job and keep thriving in today's tech.",
  videoId: "-2ZvlgDnltc",
  videoTitle: "GeekForce Career Support",
  ctaButtons: [
    { text: "Get Started", href: "#apply", variant: "default" as const },
    { text: "Learn More", href: "#learn-more", variant: "outline" as const },
  ],
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
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                {data.welcomeText}
              </p>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                <span className="text-primary">{data.brandGeek}</span>
                <span className="text-foreground">{data.brandForce}</span>:
              </p>
              <h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-foreground"
                data-testid="text-hero-title"
              >
                {data.title}
              </h1>
              <p 
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-6"
                data-testid="text-hero-subtitle"
              >
                {data.subtitle}
              </p>
              
              <p className="text-xl text-foreground mb-8 max-w-xl">
                {data.description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                {data.ctaButtons.map((btn, index) => (
                  <Button
                    key={index}
                    size="lg"
                    variant={btn.variant}
                    asChild
                    data-testid={`button-hero-cta-${index}`}
                  >
                    <a href={btn.href}>{btn.text}</a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 flex justify-center">
            <VideoPlayer 
              videoId={data.videoId} 
              title={data.videoTitle}
              className="w-full max-w-md aspect-[9/16]"
            />
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
      </main>
    </div>
  );
}
