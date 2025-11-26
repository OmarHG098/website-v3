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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              data-testid="text-certificate-title"
            >
              {data.title}
            </h2>
            
            <p 
              className="text-lg text-muted-foreground mb-8"
              data-testid="text-certificate-description"
            >
              {data.description}
            </p>
            
            <ul className="space-y-4">
              {data.benefits.map((benefit, index) => (
                <li 
                  key={index} 
                  className="flex items-center gap-3"
                  data-testid={`item-benefit-${index}`}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <IconCheck size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-foreground">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {data.card && (
            <div className="flex justify-center">
              <Card 
                className="w-full max-w-sm bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20"
                data-testid="card-certificate-preview"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <IconCertificate size={32} className="text-primary" />
                  </div>
                  <h3 
                    className="text-xl font-bold text-foreground mb-2"
                    data-testid="text-certificate-card-title"
                  >
                    {data.card.title}
                  </h3>
                  <p 
                    className="text-muted-foreground"
                    data-testid="text-certificate-card-subtitle"
                  >
                    {data.card.subtitle}
                  </p>
                  <div className="mt-6 pt-6 border-t border-primary/20">
                    <p className="text-xs text-muted-foreground">Certificate of Completion</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
