import type { PressMentionsSection as PressMentionsSectionType } from "@shared/schema";
import courseReportBadge from "@assets/Course-Report-Badge-2025_1764705003189.webp";
import forbesLogo from "@assets/forbes-logo-award_1764705017245.webp";
import fortuneLogo from "@assets/fortune-logo_1764705029871.webp";
import newsweekLogo from "@assets/newsweek_1764705043451.webp";
import newsweekEsLogo from "@assets/newsweek-es_1764705050897.webp";

interface PressMentionsSectionProps {
  data: PressMentionsSectionType;
}

const logoImages: Record<string, string> = {
  "course-report": courseReportBadge,
  "forbes": forbesLogo,
  "fortune": fortuneLogo,
  "newsweek": newsweekLogo,
  "newsweek-es": newsweekEsLogo,
};

export function PressMentionsSection({ data }: PressMentionsSectionProps) {
  return (
    <section 
      className="py-16 bg-background border-t border-border"
      data-testid="section-press-mentions"
    >
      <div className="max-w-6xl mx-auto px-4">
        {data.title && (
          <h2 
            className="text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-8"
            data-testid="text-press-mentions-title"
          >
            {data.title}
          </h2>
        )}
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {data.logos.map((logo, index) => {
            const imageUrl = logoImages[logo.src] || logo.src;
            return (
              <div 
                key={index} 
                className="flex items-center justify-center h-12"
                data-testid={`logo-press-mention-${index}`}
              >
                <img 
                  src={imageUrl} 
                  alt={logo.name}
                  className="max-h-12 max-w-40 object-contain opacity-60 hover:opacity-100 transition-opacity"
                  data-testid={`img-press-mention-${logo.name}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
