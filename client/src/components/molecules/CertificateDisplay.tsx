import { 
  IconUserHeart, IconFileDescription, IconMessageDots, IconInfinity,
  IconTarget, IconBriefcase, IconMicrophone, IconHeartHandshake,
  IconTrendingUp, IconCoin, IconRocket, IconCrown,
  IconBuildingSkyscraper, IconStar, IconUsers, IconWorld
} from "@tabler/icons-react";
import { CertificateCard } from "../CertificateCard";

export interface CertificateDisplayBenefit {
  text: string;
}

export interface CertificateDisplayProps {
  programName: string;
  description?: string;
  benefits?: CertificateDisplayBenefit[];
  certificate_position?: "left" | "right";
  iconSetIndex?: number;
}

export function CertificateDisplay({ 
  programName,
  description,
  benefits = [],
  certificate_position = "left",
  iconSetIndex = 0
}: CertificateDisplayProps) {
  const isCertificateLeft = certificate_position === "left";

  const certificateColumn = (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <CertificateCard programName={programName} />
      </div>
    </div>
  );

  const textColumn = (
    <div>
      {description && (
        <p 
          className="text-body mb-8 leading-relaxed text-foreground"
          data-testid="text-certificate-description"
        >
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
      )}
    </div>
  );

  return (
    <div 
      className="grid lg:grid-cols-2 gap-12 items-center"
      data-testid="container-certificate-display"
    >
      {isCertificateLeft ? (
        <>
          {certificateColumn}
          {textColumn}
        </>
      ) : (
        <>
          {textColumn}
          {certificateColumn}
        </>
      )}
    </div>
  );
}
