import Header from "@/components/Header";
import SolidCard from "@/components/SolidCard";
import PeopleGroup from "@/components/custom-icons/PeopleGroup";
import Handshake from "@/components/custom-icons/Handshake";
import Rocket from "@/components/custom-icons/Rocket";
import HandsGroup from "@/components/custom-icons/HandsGroup";
import { Hero } from "@/components/hero/Hero";
import type { HeroTwoColumn } from "@shared/schema";

interface IconProps {
  width?: string;
  height?: string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

interface AdvanceFeature {
  icon: React.ComponentType<IconProps>;
  title: string;
  description: string;
  iconColor: string;
}

const heroData: HeroTwoColumn = {
  type: "hero",
  variant: "twoColumn",
  welcome_text: "Welcome to",
  brand_mark: {
    prefix: "Geek",
    highlight: "PAL",
    suffix: ":",
    color: "destructive",
  },
  title: "Lifetime Mentorship",
  subtitle: "& AI-Powered Coding Support",
  description: "Get unlimited 1:1 coding mentorship and AI-powered guidance from Rigobot 24/7. Never code alone, get instant feedback, and join a global developer community — all designed to help you learn faster, stay motivated, and thrive in tech for life.",
  video_id: "D5nUZNL52-Q",
  video_title: "GeekPAL Support",
  video_ratio: "9:12",
};

const advanceFasterData: {
  title: string;
  subtitle: string;
  features: AdvanceFeature[];
} = {
  title: "Advance Faster, Never Lose Momentum",
  subtitle: "The #1 reason people quit when learning to code? Getting stuck. At 4Geeks, we've built a personalized support system where you'll always have someone to help you with your challenges— so you never lose momentum and keep advancing fast.",
  features: [
    {
      icon: PeopleGroup,
      title: "7:1 Student–Teacher Ratio",
      description: "Individual attention in every class.",
      iconColor: "hsl(var(--primary))",
    },
    {
      icon: Handshake,
      title: "Unlimited 1:1 Mentorship",
      description: "From day one — and for a lifetime.",
      iconColor: "hsl(var(--chart-4))",
    },
    {
      icon: Rocket,
      title: "24/7 AI Coding Assistant (Rigobot)",
      description: "Instant feedback while you code.",
      iconColor: "hsl(var(--chart-5))",
    },
    {
      icon: HandsGroup,
      title: "Real Community Support",
      description: "Mentors, alumni & peers always ready to help.",
      iconColor: "hsl(var(--destructive))",
    },
  ],
};

function AdvanceFasterSection({ data }: { data: typeof advanceFasterData }) {
  return (
    <section 
      className="py-8 bg-amber-50"
      data-testid="section-advance-faster"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4"
            data-testid="text-advance-faster-title"
          >
            {data.title}
          </h2>
          <p className="text-lg max-w-3xl mx-auto">
            {data.subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-4  gap-4 md:gap-6 max-w-6xl mx-auto">
          {data.features.map((feature, index) => (
            <SolidCard 
              key={index}
              className="p-0  mb-0 md:mb-5"
              data-testid={`card-feature-${index + 1}`}
            >
              <div className="flex flex-col items-start gap-3 md:gap-4">
                <feature.icon 
                  width="58px" 
                  height="58px" 
                  color={feature.iconColor}
                />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-md">
                    {feature.description}
                  </p>
                </div>
              </div>
            </SolidCard>
          ))}
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
        <Hero data={heroData} />
        <AdvanceFasterSection data={advanceFasterData} />
      </main>
    </div>
  );
}
