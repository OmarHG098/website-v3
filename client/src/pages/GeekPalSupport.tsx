import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import vectorStroke from "@assets/vector-stroke-light_1764729540525.png";

const heroData = {
  welcomeText: "Welcome to",
  title: "Lifetime Mentorship",
  subtitle: "& AI-Powered Coding Support",
  description: "Get unlimited 1:1 coding mentorship and AI-powered guidance from Rigobot 24/7. Never code alone, get instant feedback, and join a global developer community — all designed to help you learn faster, stay motivated, and thrive in tech for life.",
  videoId: "D5nUZNL52-Q",
  videoTitle: "GeekPAL Support",
};

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

      <div className="container mx-auto px-4 relative z-10">
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
                <span style={{ color: 'hsl(var(--primary))' }}>PAL</span>:
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

export default function GeekPalSupport() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection data={heroData} />
      </main>
    </div>
  );
}
