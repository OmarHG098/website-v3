import type { ProjectShowcaseSection } from "@shared/schema";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";
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
    image,
    video_id,
    background,
    reverse = false,
  } = data;

  const bgClass = background || "bg-background";

  return (
    <section className={`py-12 md:py-16 ${bgClass}`} data-testid="section-project-showcase">
      <div className="max-w-6xl mx-auto px-4">
        <div className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-12 items-start`}>
          <div className="w-full md:w-1/2">
            {video_id ? (
              <div className="rounded-lg overflow-hidden">
                <LiteYouTubeEmbed
                  id={video_id}
                  title={project_title}
                  poster="maxresdefault"
                />
              </div>
            ) : image ? (
              <img
                src={image}
                alt={project_title}
                className="w-full rounded-lg object-cover"
                loading="lazy"
                data-testid="img-project-showcase"
              />
            ) : null}

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
