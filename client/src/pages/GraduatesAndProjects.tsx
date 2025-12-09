import { HeroSingleColumn } from "@/components/hero/HeroSingleColumn";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import type { HeroSingleColumn as HeroSingleColumnType, ProjectsShowcaseSection } from "@shared/schema";

const heroData: HeroSingleColumnType = {
  type: "hero",
  variant: "singleColumn",
  badge: "Coding Bootcamp Projects & Alumni",
  title: "See What Our Students Built",
  subtitle: "Explore final projects from 4Geeks Academy graduates: real apps and solutions that showcase the skills, creativity, and career-ready talent of our bootcamp alumni.",
};

const projectsData: ProjectsShowcaseSection = {
  type: "projects_showcase",
  items: [
    {
      project_title: "Raspberry Sky",
      project_url: "https://sattelite-beta.vercel.app/",
      description: "A platform capable of receiving information (wind, temperature, geolocation, etc) from rockets being launched to outer space. The platform also lets you make arrangements to send your own rocket, track it and receive messages from it.",
      creators: [
        {
          name: "Luis Rivera",
          role: "QA Analyst",
          github_url: "https://github.com/Luis846",
          linkedin_url: "https://linkedin.com/in/luis-rivera-68779714b/",
        },
        {
          name: "Naila Kaliyeva",
          role: "Web Developer",
          github_url: "https://github.com/nailakaliyeva",
          linkedin_url: "https://www.linkedin.com/in/naila-kaliyeva-a8863a181/",
        },
      ],
      media: [
        {
          type: "image",
          src: "/attached_assets/image_1765318479754.png",
          alt: "Raspberry Sky - Satellite access for everyone",
        },
        {
          type: "video",
          src: "OZfv9kYl0_o",
        },
      ],
    },
    {
      project_title: "IMS: Inventory Tracking",
      project_url: "https://ims-frontend.vercel.app/react-hello-webapp/private/dashboard",
      description: "IMS is a Pharmacy Inventory and logistics tracking system built using Python, Javascript, React, and integration with Barcode Readers, SMS, the Twillio API, and GPS Tracking Systems. IMS holds stock quantities of all products stored and sold by the Drug Store and then tracks the vehicles that deliver those sells.",
      creators: [
        {
          name: "Jonathan Perez",
          role: "Business Administration",
          github_url: "https://github.com/Jphendrix51",
        },
        {
          name: "Sebastian Pinto",
          role: "Pharmacy Owner",
          github_url: "https://github.com/sebastianpd1",
        },
        {
          name: "Paola Castro",
          role: "Fuel Industry",
          github_url: "https://github.com/paocastrob",
        },
      ],
      media: [
        {
          type: "image",
          src: "/attached_assets/image_1765318521904.png",
          alt: "IMS Dashboard",
        },
        {
          type: "video",
          src: "TTjSZ2Lud2E",
        },
      ],
    },
    {
      project_title: "The Hour",
      project_url: "#",
      description: "Happy Hour! What are you doing today? The Hour is your perfect night sidekick, find happy hour information about bars, night clubs and what is happening in the city! This application stands out because of its UI/UX component, very easy to use, mobile first and build around React.js, Javascript and Headless Wordpress API for easy management.",
      creators: [
        {
          name: "Darius Bounds",
          role: "Interaction Designer",
          github_url: "https://github.com/dcbounds",
          linkedin_url: "https://www.linkedin.com/in/dariusbounds/",
        },
        {
          name: "Christian Valdes",
          role: "Government Project Manager",
          github_url: "https://github.com/CxJAY26",
        },
      ],
      media: [
        {
          type: "video",
          src: "KTeOIU3eVrc",
        },
      ],
    },
    {
      project_title: "WonderTracker",
      project_url: "https://wandertrackerfront-end-gmihov001.vercel.app/",
      description: "A platform capable of keeping your travel information and documents saved in an absolute secure system. It also lets you track places where you have been, and gather information that you thought was important to save for as long as you want - all in just one place.",
      creators: [
        {
          name: "Fernando Funes",
          role: "Web Developer",
          github_url: "https://github.com/ferfunes",
        },
        {
          name: "George Mihov",
          role: "Web Developer and Mentor",
          github_url: "https://github.com/gmihov001",
          linkedin_url: "https://www.linkedin.com/in/gmihov/",
        },
      ],
      media: [
        {
          type: "image",
          src: "/attached_assets/image_1765318556862.png",
          alt: "WonderTracker - Plan Travel, Save Memories",
        },
        {
          type: "image",
          src: "/attached_assets/fernando-funez_1765315920677.jpg",
          alt: "WonderTracker team member",
        },
      ],
    },
    {
      project_title: "reMindful",
      project_url: "https://re-mindful.vercel.app/",
      description: "Generating awareness about recycling and considering all the steps that need to be covered. They have created an application that integrates both software and hardware that allows to weigh the amount of plastic, glass or garbage there is within a container and how much it will affect both the recycling process as well as the environment.",
      creators: [
        {
          name: "Jordan Aguiriano",
          role: "Web Developer",
          github_url: "https://github.com/JordanAguiriano",
        },
        {
          name: "Gabriela Rodriguez",
          role: "Web Developer",
          github_url: "https://github.com/gabsssrod",
        },
      ],
      media: [
        {
          type: "image",
          src: "/attached_assets/image_1765318600261.png",
          alt: "reMindful - Reduce, Reuse, Recycle",
        },
        {
          type: "video",
          src: "cKcZD0_1IKk",
        },
      ],
    },
  ],
};

export default function GraduatesAndProjects() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSingleColumn data={heroData} />
      <ProjectsShowcase data={projectsData} />
    </div>
  );
}
