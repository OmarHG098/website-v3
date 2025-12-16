import { useState } from "react";
import * as TablerIcons from "@tabler/icons-react";

interface Step {
  icon?: string;
  title?: string;
  text?: string;
  bullets?: string[];
}

interface SpotlightStepsWithBubbleTextData {
  type: "spotlight_with_bubble_text";
  version?: string;
  title?: string;
  description?: string;
  background?: string;
  steps?: Step[];
}

interface SpotlightStepsWithBubbleTextProps {
  data: SpotlightStepsWithBubbleTextData;
}

const { IconCheck } = TablerIcons;

function getIcon(iconName?: string) {
  if (!iconName) return <IconCheck className="w-8 h-8 text-primary" />;
  const fullIconName = `Icon${iconName}`;
  const Icon = (TablerIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[fullIconName];
  if (Icon) {
    return <Icon className="w-8 h-8 text-primary" />;
  }
  return <IconCheck className="w-8 h-8 text-primary" />;
}

export default function SpotlightStepsWithBubbleText({ data }: SpotlightStepsWithBubbleTextProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const steps = data.steps || [];

  const handleStepInteraction = (index: number) => {
    setActiveStep(activeStep === index ? null : index);
  };

  const getActiveContent = () => {
    if (activeStep === null || !steps[activeStep]) return null;
    const step = steps[activeStep];
    return {
      title: step.title,
      text: step.text,
      bullets: step.bullets || [],
    };
  };

  const activeContent = getActiveContent();

  return (
    <section
      className={`py-16 ${data.background || "bg-muted/30"}`}
      data-testid="section-spotlight-steps-with-bubble-text"
    >
      <div className="max-w-6xl mx-auto px-4">
        {data.title && (
          <h2
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-center"
            data-testid="text-spotlight-title"
          >
            {data.title}
          </h2>
        )}

        {data.description && (
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center mb-12">
            {data.description}
          </p>
        )}

        {/* Mobile: Vertical layout */}
        <div className="md:hidden space-y-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
              data-testid={`spotlight-step-mobile-${index + 1}`}
            >
              <button
                onClick={() => handleStepInteraction(index)}
                aria-label={step.title || `Step ${index + 1}`}
                aria-expanded={activeStep === index}
                className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all ${
                  activeStep === index
                    ? "border-primary bg-primary/20 scale-110"
                    : "border-primary/50 bg-primary/10 hover:border-primary hover:scale-105"
                }`}
                data-testid={`button-spotlight-step-${index + 1}`}
              >
                {getIcon(step.icon)}
              </button>
              <div className="mt-3 text-center">
                <span className="text-sm font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {step.title && (
                  <h3 className="text-base font-semibold text-foreground mt-1">
                    {step.title}
                  </h3>
                )}
              </div>
              {activeStep === index && step.bullets && (
                <div className="mt-4 p-4 bg-card border rounded-lg w-full">
                  <ul className="space-y-2">
                    {step.bullets.map((bullet, bulletIndex) => (
                      <li
                        key={bulletIndex}
                        className="flex gap-2 items-start text-sm text-muted-foreground"
                      >
                        <span className="text-primary flex-shrink-0 mt-0.5">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop: CSS Grid Triangle layout */}
        <div className="hidden md:grid grid-cols-3 grid-rows-2 gap-4" style={{ minHeight: "400px" }}>
          {/* Step 2 - Top Center (row 1, col 2) */}
          {steps[1] && (
            <div
              className="col-start-2 row-start-1 flex flex-col items-center justify-end"
              data-testid="spotlight-step-2"
            >
              <button
                onClick={() => handleStepInteraction(1)}
                onMouseEnter={() => setActiveStep(1)}
                aria-label={steps[1].title || "Step 2"}
                aria-expanded={activeStep === 1}
                className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all cursor-pointer ${
                  activeStep === 1
                    ? "border-primary bg-primary/20 scale-110 shadow-lg"
                    : "border-primary/50 bg-primary/10 hover:border-primary hover:scale-105"
                }`}
                data-testid="button-spotlight-step-2"
              >
                {getIcon(steps[1].icon)}
              </button>
              <div className="mt-3 text-center">
                <span className="text-lg font-bold text-primary">02</span>
                {steps[1].title && (
                  <h3 className="text-base font-semibold text-foreground mt-1">
                    {steps[1].title}
                  </h3>
                )}
              </div>
            </div>
          )}

          {/* Step 1 - Bottom Left (row 2, col 1) */}
          {steps[0] && (
            <div
              className="col-start-1 row-start-2 flex flex-col items-center justify-end h-full"
              data-testid="spotlight-step-1"
            >
              <button
                onClick={() => handleStepInteraction(0)}
                onMouseEnter={() => setActiveStep(0)}
                aria-label={steps[0].title || "Step 1"}
                aria-expanded={activeStep === 0}
                className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all cursor-pointer ${
                  activeStep === 0
                    ? "border-primary bg-primary/20 scale-110 shadow-lg"
                    : "border-primary/50 bg-primary/10 hover:border-primary hover:scale-105"
                }`}
                data-testid="button-spotlight-step-1"
              >
                {getIcon(steps[0].icon)}
              </button>
              <div className="mt-3 text-center">
                <span className="text-lg font-bold text-primary">01</span>
                {steps[0].title && (
                  <h3 className="text-base font-semibold text-foreground mt-1">
                    {steps[0].title}
                  </h3>
                )}
              </div>
            </div>
          )}

          {/* Center Bubble - row 2, col 2 */}
          <div
            className="col-start-2 row-start-2 flex items-center justify-center"
          >
            {activeContent ? (
              <div
                className="relative bg-card border-2 border-primary/30 rounded-xl p-6 shadow-lg max-w-sm transition-all duration-300 animate-in fade-in zoom-in-95"
                data-testid="bubble-content"
              >
                {activeContent.title && (
                  <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span className="text-primary font-bold">
                      {String((activeStep ?? 0) + 1).padStart(2, "0")}
                    </span>
                    {activeContent.title}
                  </h4>
                )}
                {activeContent.text && (
                  <p className="text-muted-foreground mb-3">{activeContent.text}</p>
                )}
                {activeContent.bullets.length > 0 && (
                  <ul className="space-y-2">
                    {activeContent.bullets.map((bullet, bulletIndex) => (
                      <li
                        key={bulletIndex}
                        className="flex gap-2 items-start text-sm text-muted-foreground"
                      >
                        <span className="text-primary flex-shrink-0 mt-0.5">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div
                className="bg-muted/50 border-2 border-dashed border-muted-foreground/30 rounded-xl p-6 max-w-sm text-center"
                data-testid="bubble-placeholder"
              >
                <p className="text-muted-foreground">
                  Hover or click on a step to see details
                </p>
              </div>
            )}
          </div>

          {/* Step 3 - Bottom Right (row 2, col 3) */}
          {steps[2] && (
            <div
              className="col-start-3 row-start-2 flex flex-col items-center justify-end h-full"
              data-testid="spotlight-step-3"
            >
              <button
                onClick={() => handleStepInteraction(2)}
                onMouseEnter={() => setActiveStep(2)}
                aria-label={steps[2].title || "Step 3"}
                aria-expanded={activeStep === 2}
                className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all cursor-pointer ${
                  activeStep === 2
                    ? "border-primary bg-primary/20 scale-110 shadow-lg"
                    : "border-primary/50 bg-primary/10 hover:border-primary hover:scale-105"
                }`}
                data-testid="button-spotlight-step-3"
              >
                {getIcon(steps[2].icon)}
              </button>
              <div className="mt-3 text-center">
                <span className="text-lg font-bold text-primary">03</span>
                {steps[2].title && (
                  <h3 className="text-base font-semibold text-foreground mt-1">
                    {steps[2].title}
                  </h3>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
