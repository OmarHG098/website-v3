import { Card, CardContent } from "@/components/ui/card";
import type { CredibilitySection as CredibilitySectionType } from "@shared/schema";
import forbesLogo from "@assets/forbes-logo-award_1764705431773.webp";
import newsweekLogo from "@assets/newsweek_1764705449168.webp";
import courseReportLogo from "@assets/Course-Report-Badge-2025_1764705464228.webp";

interface CredibilitySectionProps {
  data: CredibilitySectionType;
}

export function CredibilitySection({ data }: CredibilitySectionProps) {
  const logoMap: Record<string, string> = {
    "Forbes": forbesLogo,
    "Newsweek": newsweekLogo,
    "Course Report": courseReportLogo,
  };

  return (
    <section 
      className="py-16 bg-muted/30"
      data-testid="section-credibility"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-10 text-center text-foreground"
          data-testid="text-credibility-title"
        >
          {data.title}
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {data.stats.map((stat, index) => (
            <Card 
              key={index} 
              className="text-center p-6"
              data-testid={`card-stat-${index}`}
            >
              <CardContent className="pt-4">
                <p 
                  className="text-3xl md:text-4xl font-bold text-primary mb-2"
                  data-testid={`text-stat-value-${index}`}
                >
                  {stat.value}
                </p>
                <p 
                  className="text-muted-foreground"
                  data-testid={`text-stat-label-${index}`}
                >
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {data.featured_in && (
          <div className="text-center">
            <p 
              className="text-sm text-muted-foreground mb-6 uppercase tracking-wide"
              data-testid="text-featured-label"
            >
              {data.featured_in.label}
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              {data.featured_in.logos.map((logoName, index) => {
                const logoSrc = logoMap[logoName as keyof typeof logoMap];
                return (
                  <div
                    key={index}
                    className="transition-transform duration-300 hover:scale-110"
                    data-testid={`logo-featured-${index}`}
                  >
                    {logoSrc ? (
                      <img 
                        src={logoSrc} 
                        alt={logoName} 
                        className="h-12 max-w-[120px] object-contain"
                      />
                    ) : (
                      <span className="text-xl font-bold text-foreground opacity-60">
                        {logoName}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
