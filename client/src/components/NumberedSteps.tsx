import * as TablerIcons from "@tabler/icons-react";
import type { ComponentType } from "react";

export interface NumberedStepsStep {
  icon: string;
  text?: string;
  title?: string;
  bullets?: string[];
  bullet_icon?: string;
  bullet_icon_color?: string;
  bullet_char?: string;
}

export interface NumberedStepsData {
  title: string;
  description?: string;
  description_link?: {
    text: string;
    url: string;
  };
  steps: NumberedStepsStep[];
  background?: string;
  bullet_icon?: string;
  bullet_icon_color?: string;
  bullet_char?: string;
}

interface NumberedStepsProps {
  data: NumberedStepsData;
}

const getIcon = (iconName: string, className?: string) => {
  const icons = TablerIcons as unknown as Record<string, ComponentType<{ size?: number; className?: string }>>;
  const IconComponent = icons[`Icon${iconName}`];
  return IconComponent ? <IconComponent size={24} className={className || "text-primary"} /> : null;
};

const getBulletIcon = (iconName: string, colorClass: string) => {
  const icons = TablerIcons as unknown as Record<string, ComponentType<{ className?: string }>>;
  const IconComponent = icons[`Icon${iconName}`];
  return IconComponent ? <IconComponent className={`w-4 h-4 ${colorClass} flex-shrink-0 mt-0.5`} /> : null;
};

export default function NumberedSteps({ data }: NumberedStepsProps) {
  return (
    <section 
      className={`pt-4 pb-10 ${data.background || "bg-muted/30"}`}
      data-testid="section-numbered-steps"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-center"
          data-testid="text-numbered-steps-title"
        >
          {data.title}
        </h2>
        
        {data.description && (
          <div className="text-center mb-10">
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {data.description}
            </p>
            {data.description_link && (
              <a 
                href={data.description_link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline text-lg mt-2 inline-block"
                data-testid="link-numbered-steps-description"
              >
                {data.description_link.text}
              </a>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-0.5 bg-primary/30 z-0" />
          
          {(data.steps || []).map((step, index) => {
            const isLast = index === (data.steps || []).length - 1;
            
            return (
              <div 
                key={index} 
                className="flex flex-col items-center relative"
                data-testid={`numbered-step-${index + 1}`}
              >
                <div className="flex items-center justify-center w-full mb-3 relative">
                  <div className="w-20 h-20 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center flex-shrink-0 relative z-10">
                    <span className="text-3xl font-bold text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  {!isLast && (
                    <div className="md:hidden absolute left-1/2 top-20 w-0.5 h-6 bg-primary/30 -translate-x-1/2" />
                  )}
                </div>
                
                <div className="flex flex-col items-center text-center mb-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mb-1">
                    {getIcon(step.icon)}
                  </div>
                  {step.title && (
                    <h3 className="text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                  )}
                  {step.text && !step.title && (
                    <p className="text-base text-foreground">
                      {step.text}
                    </p>
                  )}
                </div>
                
                {step.bullets && step.bullets.length > 0 && (() => {
                  const bulletChar = step.bullet_char || data.bullet_char;
                  const bulletIcon = step.bullet_icon || data.bullet_icon || "Check";
                  const bulletIconColor = step.bullet_icon_color || data.bullet_icon_color || "text-primary";
                  
                  return (
                    <ul className="space-y-2 text-left">
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
