import { useState, useCallback } from "react";
import type { ProjectShowcaseSection } from "@shared/schema";
import { IconBrandGithub, IconBrandLinkedin, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

interface ProjectShowcaseProps {
  data: ProjectShowcaseSection;
}

export function ProjectShowcase({ data }: ProjectShowcaseProps) {
  const {
    project_title,
    description,
    creators,
    media,
    image,
    video_id,
    background,
    reverse = false,
  } = data;

  const [currentIndex, setCurrentIndex] = useState(0);

  const mediaItems = media || [];
  const hasCarousel = mediaItems.length > 1;

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : mediaItems.length - 1));
  }, [mediaItems.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < mediaItems.length - 1 ? prev + 1 : 0));
  }, [mediaItems.length]);

  const bgClass = background || "bg-background";

  const renderMedia = () => {
    if (mediaItems.length > 0) {
      const currentMedia = mediaItems[currentIndex];
      if (currentMedia.type === "video") {
        return (
          <div className="rounded-lg overflow-hidden h-full">
            <LiteYouTubeEmbed
              id={currentMedia.src}
              title={project_title}
              poster="maxresdefault"
            />
          </div>
        );
      } else {
        return (
          <img
            src={currentMedia.src}
            alt={currentMedia.alt || project_title}
            className="w-full h-full rounded-lg object-cover"
            loading="lazy"
            data-testid="img-project-showcase"
          />
        );
      }
    }

    if (video_id) {
      return (
        <div className="rounded-lg overflow-hidden h-full">
          <LiteYouTubeEmbed
            id={video_id}
            title={project_title}
            poster="maxresdefault"
          />
        </div>
      );
    }

    if (image) {
      return (
        <img
          src={image}
          alt={project_title}
          className="w-full h-full rounded-lg object-cover"
          loading="lazy"
          data-testid="img-project-showcase"
        />
      );
    }

    return null;
  };

  return (
    <section className={`py-12 md:py-16 ${bgClass}`} data-testid="section-project-showcase">
      <div className="max-w-6xl mx-auto px-4">
        <div className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-12 items-start`}>
          <div className="w-full md:w-1/2">
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden">
                {renderMedia()}
              </div>

              {hasCarousel && (
                <div className="flex justify-between items-center mt-4" data-testid="carousel-pagination">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPrevious}
                    className="rounded-full border"
                    data-testid="button-carousel-prev"
                  >
                    <IconChevronLeft size={24} />
                  </Button>

                  <div className="flex items-center gap-2">
                    {mediaItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          currentIndex === index 
                            ? "bg-primary" 
                            : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        }`}
                        data-testid={`button-pagination-dot-${index}`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNext}
                    className="rounded-full border"
                    data-testid="button-carousel-next"
                  >
                    <IconChevronRight size={24} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-project-title">
              Project: {project_title}
            </h3>

            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {">"} MADE BY
              </p>
              <div className="space-y-2">
                {creators.map((creator, index) => (
                  <div key={index} className="flex items-center gap-3" data-testid={`creator-${index}`}>
                    <span className="text-foreground">{creator.name}</span>
                    <div className="flex items-center gap-2">
                      {creator.github_url && (
                        <a
                          href={creator.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={`${creator.name}'s GitHub`}
                          data-testid={`link-github-${index}`}
                        >
                          <IconBrandGithub size={20} />
                        </a>
                      )}
                      {creator.linkedin_url && (
                        <a
                          href={creator.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={`${creator.name}'s LinkedIn`}
                          data-testid={`link-linkedin-${index}`}
                        >
                          <IconBrandLinkedin size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {">"} DESCRIPTION
              </p>
              <p className="text-muted-foreground leading-relaxed" data-testid="text-project-description">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
