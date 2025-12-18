import { useState } from "react";
import { IconCheck } from "@tabler/icons-react";
import type { CertificateSection as CertificateSectionType } from "@shared/schema";
import { CertificateCard } from "./CertificateCard";
import { cn } from "@/lib/utils";

interface CertificateSectionProps {
  data: CertificateSectionType;
}

export function CertificateSection({ data }: CertificateSectionProps) {
  const [selectedStatIndex, setSelectedStatIndex] = useState(0);

  const selectedStat = data.stats?.[selectedStatIndex];
  const displayDescription = selectedStat?.description || data.description;
  const displayBenefits = selectedStat?.benefits || data.benefits || [];

  return (
    <section 
      className="py-section bg-muted/30"
      data-testid="section-certificate"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 
          className="text-h2 mb-10 text-foreground text-center"
          data-testid="text-certificate-title"
        >
          {data.title}
        </h2>

        {data.stats && data.stats.length > 0 && (
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            data-testid="certificate-stats"
          >
            {data.stats.map((stat, index) => (
              <button 
                key={index}
                type="button"
                onClick={() => setSelectedStatIndex(index)}
                className={cn(
                  "text-center p-4 rounded-card transition-all duration-brand ease-brand cursor-pointer",
                  selectedStatIndex === index
                    ? "scale-[1.02] border-2 border-primary bg-background shadow-card"
                    : "border border-transparent hover:bg-muted/50"
                )}
                data-testid={`button-stat-${index}`}
              >
                <div className="text-h2 font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {data.card && (
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <CertificateCard 
                  programName={data.card.program_name || data.card.title}
                />
              </div>
            </div>
          )}
          
          <div>
            <p 
              className="text-body mb-8 leading-relaxed text-foreground"
              data-testid="text-certificate-description"
            >
              {displayDescription}
            </p>
            
            <ul className="space-y-3">
              {displayBenefits.map((benefit, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3"
                  data-testid={`item-benefit-${index}`}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                    <IconCheck size={14} className="text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-foreground font-semibold text-body">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
