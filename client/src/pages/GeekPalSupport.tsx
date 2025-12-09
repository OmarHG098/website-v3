import Header from "@/components/Header";
import { Hero } from "@/components/hero/Hero";
import FeaturesGrid from "@/components/FeaturesGrid";
import type { HeroTwoColumn, FeaturesGridHighlightSection } from "@shared/schema";

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

const advanceFasterData: FeaturesGridHighlightSection = {
  type: "features_grid",
  title: "Advance Faster, Never Lose Momentum",
  subtitle: "The #1 reason people quit when learning to code? Getting stuck. At 4Geeks, we've built a personalized support system where you'll always have someone to help you with your challenges— so you never lose momentum and keep advancing fast.",
  columns: 4,
  background: "bg-amber-50",
  items: [
    {
      icon: "PeopleGroup",
      icon_color: "#0097CD",
      title: "7:1 Student–Teacher Ratio",
      description: "Individual attention in every class.",
    },
    {
      icon: "Handshake",
      icon_color: "#0097CD",
      title: "Unlimited 1:1 Mentorship",
      description: "From day one — and for a lifetime.",
    },
    {
      icon: "Rocket",
      icon_color: "#0097CD",
      title: "24/7 AI Coding Assistant (Rigobot)",
      description: "Instant feedback while you code.",
    },
    {
      icon: "HandsGroup",
      icon_color: "#0097CD",
      title: "Real Community Support",
      description: "Mentors, alumni & peers always ready to help.",
    },
  ],
};

export default function GeekPalSupport() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero data={heroData} />
        <FeaturesGrid data={advanceFasterData} />
      </main>
    </div>
  );
}
