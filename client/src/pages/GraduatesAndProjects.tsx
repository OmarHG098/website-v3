import { HeroSingleColumn } from "@/components/hero/HeroSingleColumn";
import type { HeroSingleColumn as HeroSingleColumnType } from "@shared/schema";

const heroData: HeroSingleColumnType = {
  type: "hero",
  variant: "singleColumn",
  badge: "Coding Bootcamp Projects & Alumni",
  title: "See What Our Students Built",
  subtitle: "Explore final projects from 4Geeks Academy graduates: real apps and solutions that showcase the skills, creativity, and career-ready talent of our bootcamp alumni.",
};

export default function GraduatesAndProjects() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSingleColumn data={heroData} />
    </div>
  );
}
