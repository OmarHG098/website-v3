import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { ProjectsSection as ProjectsSectionType } from "@shared/schema";

import starWarsImg from "@assets/star-wars_1764729369149.webp";
import authSystemImg from "@assets/authentication-python_1764729364254.webp";
import finalProjectImg from "@assets/fullstack-user-stories_1764729359334.webp";

interface ProjectsSectionProps {
  data: ProjectsSectionType;
}

const projectImages: Record<string, string> = {
  "star-wars": starWarsImg,
  "authentication": authSystemImg,
  "final-project": finalProjectImg,
};

export function ProjectsSection({ data }: ProjectsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section 
      className="py-16 bg-background"
      data-testid="section-projects"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 
              className="text-3xl md:text-4xl font-bold text-foreground"
              data-testid="text-projects-title"
            >
              {data.title}
            </h2>
            {data.subtitle && (
              <p 
                className="text-lg text-muted-foreground mt-2"
                data-testid="text-projects-subtitle"
              >
                {data.subtitle}
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="rounded-full"
              data-testid="button-projects-prev"
            >
              <IconChevronLeft size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="rounded-full"
              data-testid="button-projects-next"
            >
              <IconChevronRight size={20} />
            </Button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {data.items.map((project, index) => {
            const imageKey = project.image.toLowerCase().replace(/\s+/g, "-");
            const imageSrc = projectImages[imageKey] || projectImages["final-project"];
            
            return (
              <Card 
                key={index}
                className="flex-shrink-0 w-[500px] overflow-hidden border"
                data-testid={`card-project-${index}`}
              >
                <CardContent className="p-0 flex">
                  <div className="w-48 h-36 flex-shrink-0 overflow-hidden">
                    <img 
                      src={imageSrc}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-center">
                    <h3 className="font-semibold text-foreground mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
