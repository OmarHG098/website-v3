import { useState } from "react";
import { 
  IconUserHeart, IconFileDescription, IconMessageDots, IconInfinity,
  IconTarget, IconBriefcase, IconMicrophone, IconHeartHandshake,
  IconTrendingUp, IconCoin, IconRocket, IconCrown,
  IconBuildingSkyscraper, IconStar, IconUsers, IconWorld
} from "@tabler/icons-react";
import type { CertificateSection as CertificateSectionType } from "@shared/schema";
import { CertificateCard } from "./CertificateCard";
import { cn } from "@/lib/utils";

interface CertificateSectionProps {
  data: CertificateSectionType;
}

export function CertificateSection({ data }: CertificateSectionProps) {
  const [selectedStatIndex, setSelectedStatIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

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
                onClick={() => {
                  setSelectedStatIndex(index);
                }}
                onMouseEnter={() => {
                  if (!hasInteracted) {
                    setSelectedStatIndex(index);
                    setHasInteracted(true);
                  }
                }}
                className={cn(
                  "text-center p-4 transition-all duration-brand ease-brand cursor-pointer",
                  hasInteracted && selectedStatIndex === index && "scale-[1.1]",
                  hasInteracted && selectedStatIndex !== index && "hover:bg-muted/50 opacity-60"
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
            
            <div className="flex flex-col justify-center gap-3">
              {displayBenefits.map((benefit, index) => {
                const iconSets = [
                  [IconUserHeart, IconFileDescription, IconMicrophone, IconHeartHandshake],
                  [IconTarget, IconCoin, IconInfinity, IconUsers],
                  [IconTrendingUp, IconRocket, IconCrown, IconBriefcase],
                  [IconBuildingSkyscraper, IconStar, IconMessageDots, IconWorld]
                ];
                const currentSet = iconSets[selectedStatIndex % iconSets.length];
                const IconComponent = currentSet[index % currentSet.length];
                return (
                  <div 
                    key={index} 
                    className="flex items-center gap-3"
                    data-testid={`item-benefit-${index}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-primary flex-shrink-0">
                        <IconComponent size={20} />
                      </span>
                      <span className="w-px bg-border self-stretch flex-shrink-0"></span>
                      <span className="text-muted-foreground">{benefit.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
