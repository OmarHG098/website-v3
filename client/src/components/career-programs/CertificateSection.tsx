import { Card, CardContent } from "@/components/ui/card";
import { IconCheck, IconCertificate } from "@tabler/icons-react";
import type { CertificateSection as CertificateSectionType } from "@shared/schema";

interface CertificateSectionProps {
  data: CertificateSectionType;
}

export function CertificateSection({ data }: CertificateSectionProps) {
  return (
    <section 
      className="py-16 bg-muted/30"
      data-testid="section-certificate"
    >
      <div className="container mx-auto px-4">
        {data.stats && data.stats.length > 0 && (
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto"
            data-testid="certificate-stats"
          >
            {data.stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center"
                data-testid={`stat-${index}`}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              data-testid="text-certificate-title"
            >
              {data.title}
            </h2>
            
            <p 
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
              data-testid="text-certificate-description"
            >
              {data.description}
            </p>
            
            <ul className="space-y-4">
              {data.benefits.map((benefit, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3"
                  data-testid={`item-benefit-${index}`}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                    <IconCheck size={14} className="text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-foreground">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {data.card && (
            <div className="flex justify-center">
              <Card 
                className="w-full max-w-sm border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5"
                data-testid="card-certificate-preview"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconCertificate size={40} className="text-primary" />
                  </div>
                  <div className="border-b border-primary/20 pb-4 mb-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                      Certificate of Completion
                    </p>
                    <h3 
                      className="text-xl font-bold text-foreground"
                      data-testid="text-certificate-card-title"
                    >
                      {data.card.title}
                    </h3>
                  </div>
                  <p 
                    className="text-muted-foreground"
                    data-testid="text-certificate-card-subtitle"
                  >
                    {data.card.subtitle}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
