import * as TablerIcons from "@tabler/icons-react";
import type { ComponentType } from "react";

export interface NumberedStepsStep {
  icon: string;
  text: string;
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
}

interface NumberedStepsProps {
  data: NumberedStepsData;
}

const getIcon = (iconName: string) => {
  const icons = TablerIcons as unknown as Record<string, ComponentType<{ size?: number; className?: string }>>;
  const IconComponent = icons[`Icon${iconName}`];
  return IconComponent ? <IconComponent size={24} className="text-primary" /> : null;
};

export default function NumberedSteps({ data }: NumberedStepsProps) {
  return (
    <section 
      className={`pt-4 pb-10 ${data.background || "bg-muted/30"}`}
      data-testid="section-numbered-steps"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-8 text-foreground text-center"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.steps.map((step, index) => (
            <div 
              key={index} 
              className="flex flex-col"
              data-testid={`numbered-step-${index + 1}`}
            >
              <span className="text-5xl md:text-6xl text-primary font-bold mb-4">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {getIcon(step.icon)}
                </div>
                <p className="text-base text-foreground">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
