import { useState } from "react";
import { 
  IconUserHeart, IconFileDescription, IconMessageDots, IconInfinity,
  IconTarget, IconBriefcase, IconMicrophone, IconHeartHandshake,
  IconTrendingUp, IconCoin, IconRocket, IconCrown,
  IconBuildingSkyscraper, IconStar, IconUsers, IconWorld,
  IconChevronDown
} from "@tabler/icons-react";
import { Certificate } from "./Certificate";
import { Button } from "@/components/ui/button";

export interface CertificateDisplayBenefit {
  text: string;
}

export interface CertificateDisplayProps {
  programName: string;
  description?: string;
  benefits?: CertificateDisplayBenefit[];
  certificate_position?: "left" | "right";
  iconSetIndex?: number;
  useSolidCard?: boolean;
}

export function CertificateDisplay({ 
  programName,
  description,
  benefits = [],
  certificate_position = "left",
  iconSetIndex = 0,
  useSolidCard = false
}: CertificateDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCertificateLeft = certificate_position === "left";
  const visibleBenefitsCount = 2;

  const renderTextContent = () => (
    <>
      {description && (
        <p className="text-body mb-8 leading-relaxed text-foreground" data-testid="text-certificate-description">
          {description}
        </p>
      )}
      {benefits.length > 0 && (
        <div className="flex flex-col justify-center gap-3">
          {benefits.map((benefit, index) => {
            const iconSets = [
              [IconUserHeart, IconFileDescription, IconMicrophone, IconHeartHandshake],
              [IconTarget, IconCoin, IconInfinity, IconUsers],
              [IconTrendingUp, IconRocket, IconCrown, IconBriefcase],
              [IconBuildingSkyscraper, IconStar, IconMessageDots, IconWorld]
            ];
            const currentSet = iconSets[iconSetIndex % iconSets.length];
            const IconComponent = currentSet[index % currentSet.length];
            const isHiddenOnMobile = index >= visibleBenefitsCount && !isExpanded;
            return (
              <div key={index} className={`flex items-center gap-3 ${isHiddenOnMobile ? 'hidden md:flex' : ''}`} data-testid={`item-benefit-${index}`}>
                <div className="flex items-center gap-2">
                  <span className="text-primary flex-shrink-0"><IconComponent size={20} /></span>
                  <span className="w-px bg-border self-stretch flex-shrink-0"></span>
                  <span className="text-muted-foreground">{benefit.text}</span>
                </div>
              </div>
            );
          })}
          {benefits.length > visibleBenefitsCount && (
            <Button variant="ghost" size="sm" className="md:hidden self-start text-primary" onClick={() => setIsExpanded(!isExpanded)} data-testid="button-see-more-benefits">
              {isExpanded ? 'See less' : 'See more'}
              <IconChevronDown size={16} className={`ml-1 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          )}
        </div>
      )}
    </>
  );

  return (
    <div 
      className="relative"
      data-testid="container-certificate-display"
    >
      {/* Background aligned with text column height */}
      <div className="absolute inset-x-0 top-0 bottom-0 bg-primary/5 rounded-3xl pointer-events-none lg:hidden" />
      
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {isCertificateLeft ? (
          <>
            <div className="relative flex justify-center">
              <div className="w-full max-w-md">
                <Certificate programName={programName} useSolidCard={useSolidCard} />
              </div>
            </div>
            <div className="relative">
              <div className="hidden lg:block absolute inset-y-0 -left-6 bg-primary/5 rounded-3xl pointer-events-none" style={{ right: 'calc(-50vw + 50%)' }} />
              <div className="relative p-8 lg:p-12">{renderTextContent()}</div>
            </div>
          </>
        ) : (
          <>
            <div className="relative">
              <div className="hidden lg:block absolute inset-y-0 -right-6 bg-primary/5 rounded-3xl pointer-events-none" style={{ left: 'calc(-50vw + 50%)' }} />
              <div className="relative p-8 lg:p-12">{renderTextContent()}</div>
            </div>
            <div className="relative flex justify-center">
              <div className="w-full max-w-md">
                <Certificate programName={programName} useSolidCard={useSolidCard} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
