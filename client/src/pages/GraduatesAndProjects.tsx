import { HeroSingleColumn } from "@/components/hero/HeroSingleColumn";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import type { HeroSingleColumn as HeroSingleColumnType, ProjectShowcaseSection } from "@shared/schema";

const heroData: HeroSingleColumnType = {
  type: "hero",
  variant: "singleColumn",
  badge: "Coding Bootcamp Projects & Alumni",
  title: "See What Our Students Built",
  subtitle: "Explore final projects from 4Geeks Academy graduates: real apps and solutions that showcase the skills, creativity, and career-ready talent of our bootcamp alumni.",
};

const projectData: ProjectShowcaseSection = {
  type: "project_showcase",
  project_title: "WonderTracker",
  description: "A platform capable of keeping your travel information and documents saved in an absolute secure system. It also lets you track places where you have been, and gather information that you thought was important to save for as long as you want - all in just one place.",
  creators: [
    {
      name: "Fernando Funes",
      github_url: "https://github.com/fernandofunes",
    },
    {
      name: "George Mihov",
      github_url: "https://github.com/georgemihov",
      linkedin_url: "https://linkedin.com/in/georgemihov",
    },
  ],
  media: [
    {
      type: "video",
      src: "D5nUZNL52-Q",
    },
    {
      type: "image",
      src: "/attached_assets/Screenshot_2023-05-11_at_5.59_1_1765310496047.png",
      alt: "Project screenshot",
    },
    {
      type: "image",
      src: "/attached_assets/image_1765310359129.png",
      alt: "Project demo",
    },
  ],
};

export default function GraduatesAndProjects() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSingleColumn data={heroData} />
      <ProjectShowcase data={projectData} />
    </div>
  );
}
