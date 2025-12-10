import { Card } from "@/components/ui/card";
import type { AboutSection as AboutSectionType } from "@shared/schema";

interface AboutProps {
  data: AboutSectionType;
  height?: string;
}

export function About({ data, height = "auto" }: AboutProps) {
  const { title, description, link_text, link_url, image_src, image_alt } = data;

  return (
    <section className="py-12 md:py-16 bg-muted" data-testid="section-about">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8 uppercase tracking-wide" data-testid="text-about-title">
          {title}
        </h2>

        <div 
          className="flex flex-col md:flex-row gap-0 items-stretch"
          style={{ height: height !== "auto" ? height : undefined }}
        >
          <Card className="flex-1 p-8 flex flex-col justify-center rounded-r-none md:rounded-l-lg z-10">
            <p className="text-muted-foreground leading-relaxed text-center mb-6" data-testid="text-about-description">
              {description}
            </p>
            <a
              href={link_url}
              className="text-primary hover:underline font-medium text-center"
              data-testid="link-about-read-more"
            >
              {link_text} {">"}
            </a>
          </Card>

          <div className="flex-1 min-h-[250px] md:min-h-0">
            <img
              src={image_src}
              alt={image_alt}
              className="w-full h-full object-cover rounded-b-lg md:rounded-b-none md:rounded-r-lg"
              loading="lazy"
              data-testid="img-about"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
