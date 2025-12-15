import { Card, CardContent } from "@/components/ui/card";
import { IconCheck } from "@tabler/icons-react";
import type { CertificateSection as CertificateSectionType } from "@shared/schema";
import { CertificateCard } from "./CertificateCard";

interface CertificateSectionProps {
  data: CertificateSectionType;
}

export function CertificateSection({ data }: CertificateSectionProps) {
  return (
    <section 
      className="py-16 bg-muted/30"
      data-testid="section-certificate"
    >
      <div className="max-w-6xl mx-auto px-4">
        {data.stats && data.stats.length > 0 && (
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
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

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {data.card && (
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <CertificateCard 
                  programName={data.card.program_name || data.card.title}
                  certificateLabel={data.card.certificate_label}
                />
              </div>
            </div>
          )}
          
          <div>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              data-testid="text-certificate-title"
            >
              {data.title}
            </h2>
            
            <p 
              className="text-lg mb-8 leading-relaxed text-foreground"
              data-testid="text-certificate-description"
            >
              {data.description}
            </p>
            
            <ul className="space-y-4">
              {(data.benefits || []).map((benefit, index) => (
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
        </div>
      </div>
    </section>
  );
}
