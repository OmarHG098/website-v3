import * as TablerIcons from "@tabler/icons-react";
import type { ComponentType } from "react";

export interface NumberedStepsV2Step {
  icon: string;
  text?: string;
  title?: string;
  bullets?: string[];
  bullet_icon?: string;
  bullet_icon_color?: string;
  bullet_char?: string;
}

export interface NumberedStepsV2Data {
  title: string;
  description?: string;
  description_link?: {
    text: string;
    url: string;
  };
  steps: NumberedStepsV2Step[];
  background?: string;
  bullet_icon?: string;
  bullet_icon_color?: string;
  bullet_char?: string;
}

interface NumberedStepsV2Props {
  data: NumberedStepsV2Data;
}

const getIcon = (iconName: string, className?: string) => {
  const icons = TablerIcons as unknown as Record<string, ComponentType<{ size?: number; className?: string }>>;
  const IconComponent = icons[`Icon${iconName}`];
  return IconComponent ? <IconComponent size={20} className={className || "text-primary"} /> : null;
};

const getBulletIcon = (iconName: string, colorClass: string) => {
  const icons = TablerIcons as unknown as Record<string, ComponentType<{ className?: string }>>;
  const IconComponent = icons[`Icon${iconName}`];
  return IconComponent ? <IconComponent className={`w-4 h-4 ${colorClass} flex-shrink-0 mt-0.5`} /> : null;
};

export default function NumberedStepsV2({ data }: NumberedStepsV2Props) {
  return (
    <section 
      className={`py-16 md:py-20 ${data.background || "bg-muted/30"}`}
      data-testid="section-numbered-steps-v2"
    >
      <div className="max-w-4xl mx-auto px-4">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-center"
          data-testid="text-numbered-steps-v2-title"
        >
          {data.title}
        </h2>
        
        {data.description && (
          <div className="text-center mb-12">
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {data.description}
            </p>
            {data.description_link && (
              <a 
                href={data.description_link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline text-lg mt-2 inline-block"
                data-testid="link-numbered-steps-v2-description"
              >
                {data.description_link.text}
              </a>
            )}
          </div>
        )}

        <div className="relative">
          {(data.steps || []).map((step, index) => {
            const isLast = index === (data.steps || []).length - 1;
            const stepNumber = String(index + 1).padStart(2, '0');
            
            return (
              <div 
                key={index} 
                className="flex gap-4 md:gap-8 relative"
                data-testid={`numbered-step-v2-${index + 1}`}
              >
                <div className="flex flex-col items-center">
                  <div className="text-sm md:text-base font-medium text-muted-foreground w-12 md:w-16 text-right pr-2 md:pr-4 pt-1">
                    Step {stepNumber}
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-primary border-2 border-primary flex-shrink-0 mt-2" />
                  {!isLast && (
                    <div className="w-0.5 bg-primary/30 flex-1 min-h-[60px]" />
                  )}
                </div>
                
                <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-8 md:pb-10'}`}>
                  <div className="flex items-start gap-3">
                    {step.icon && (
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {getIcon(step.icon)}
                      </div>
                    )}
                    <div className="flex-1">
                      {step.title && (
                        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                          {step.title}
                        </h3>
                      )}
                      
                      {step.text && (
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                          {step.text}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {step.bullets && step.bullets.length > 0 && (() => {
                    const bulletChar = step.bullet_char || data.bullet_char;
                    const bulletIcon = step.bullet_icon || data.bullet_icon || "Check";
                    const bulletIconColor = step.bullet_icon_color || data.bullet_icon_color || "text-primary";
                    
                    return (
                      <ul className="space-y-2 mt-3">
                        {step.bullets.map((bullet, bulletIndex) => (
                          <li 
                            key={bulletIndex}
                            className="flex gap-2 items-start text-base text-muted-foreground"
                          >
                            <span className={`${bulletIconColor} flex-shrink-0 mt-0.5`}>
                              {bulletChar 
                                ? bulletChar 
                                : getBulletIcon(bulletIcon, bulletIconColor)
                              }
                            </span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
