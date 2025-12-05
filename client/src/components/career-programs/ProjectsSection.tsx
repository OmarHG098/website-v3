import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight, IconClock } from "@tabler/icons-react";
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

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function ProjectsSection({ data }: ProjectsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = data.items;
  const totalItems = items.length;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentProject = items[currentIndex];
  const imageKey = currentProject.image.toLowerCase().replace(/\s+/g, "-");
  const imageSrc = projectImages[imageKey] || projectImages["final-project"];

  return (
    <section 
      className="py-16 bg-background"
      data-testid="section-projects"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 
            className="text-3xl md:text-4xl font-bold text-foreground"
            data-testid="text-projects-title"
          >
            {data.title}
          </h2>
          {data.subtitle && (
            <p 
              className="text-muted-foreground mt-4 max-w-3xl mx-auto"
              data-testid="text-projects-subtitle"
            >
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="relative">
          <div 
            className="bg-card border rounded-lg p-4 md:p-5 md:min-h-[320px]"
            data-testid={`card-project-${currentIndex}`}
          >
            <div className="flex flex-col md:flex-row gap-5">
              <div className="md:w-2/5 aspect-video md:aspect-auto md:min-h-[240px] overflow-hidden bg-muted rounded-lg">
                <img 
                  src={imageSrc}
                  alt={currentProject.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              <div className="md:w-3/5 flex flex-col">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {currentProject.tags?.map((tag, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary"
                        className="text-xs font-medium"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {(currentProject.duration || currentProject.date) && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
                      {currentProject.duration && (
                        <span className="flex items-center gap-1">
                          <IconClock size={16} />
                          {currentProject.duration}
                        </span>
                      )}
                      {currentProject.date && (
                        <span>{currentProject.date}</span>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                  {currentProject.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed flex-grow">
                  {currentProject.description}
                </p>

                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  {currentProject.difficulty && (
                    <Badge 
                      className={`uppercase text-xs font-bold ${difficultyColors[currentProject.difficulty]}`}
                    >
                      {currentProject.difficulty}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="rounded-full border"
              data-testid="button-projects-prev"
            >
              <IconChevronLeft size={24} />
            </Button>

            <div className="flex items-center gap-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex 
                      ? "bg-primary" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  data-testid={`button-project-dot-${index}`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="rounded-full border"
              data-testid="button-projects-next"
            >
              <IconChevronRight size={24} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
