import { useState } from "react";
import * as TablerIcons from "@tabler/icons-react";
import { getCustomIcon } from "../custom-icons";
import { StepNumber } from "../NumberedSteps";
import type { NumberedStepsBubbleTextSection } from "@shared/schema";

const { IconCheck } = TablerIcons;

interface NumberedStepsBubbleTextProps {
  data: NumberedStepsBubbleTextSection;
}

function getIcon(iconName?: string) {
  if (!iconName) return <IconCheck className="w-8 h-8 text-primary" />;
  
  const CustomIcon = getCustomIcon(iconName);
  if (CustomIcon) {
    return <CustomIcon width="48px" height="48px" />;
  }
  
  const fullIconName = `Icon${iconName}`;
  const Icon = (TablerIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[fullIconName];
  if (Icon) {
    return <Icon className="w-8 h-8 text-primary" />;
  }
  return <IconCheck className="w-8 h-8 text-primary" />;
}

export function NumberedStepsBubbleText({ data }: NumberedStepsBubbleTextProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const steps = data.steps || [];

  const handleStepInteraction = (index: number) => {
    setActiveStep(index);
  };

  const getActiveContent = () => {
    if (!steps[activeStep]) return null;
    const step = steps[activeStep];
    return {
      title: step.title,
      text: step.text,
      bullets: step.bullets || [],
    };
  };

  const activeContent = getActiveContent();

  const getStepOpacity = (_stepIndex: number) => {
    return "opacity-100";
  };

  return (
    <section
      className={`py-16 ${data.background || "bg-muted/30"}`}
      data-testid="section-numbered-steps-bubble-text"
    >
      <div className="max-w-6xl mx-auto px-4">
        {data.title && (
          <h2
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-center"
            data-testid="text-numbered-steps-title"
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
              className={`flex flex-col items-center transition-opacity duration-300 ${getStepOpacity(index)}`}
              data-testid={`numbered-step-mobile-${index + 1}`}
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
                data-testid={`button-numbered-step-${index + 1}`}
              >
                {getIcon(step.icon)}
              </button>
              <div className="mt-4 flex items-center gap-3">
                <StepNumber index={index} variant="spotlight" size="sm" />
                {step.title && (
                  <h3 className="text-base font-semibold text-foreground leading-tight">
                    {step.title}
                  </h3>
                )}
              </div>
              {activeStep === index && step.bullets && (
                <div className="mt-4 p-4 border border-primary/30 rounded-lg w-full animate-in fade-in slide-in-from-top-2 duration-300">
                  <ul className="space-y-2">
                    {step.bullets.map((bullet, bulletIndex) => (
                      <li
                        key={bulletIndex}
                        className="flex gap-2 items-start text-sm text-muted-foreground"
                      >
                        <span className="text-foreground flex-shrink-0 mt-0.5">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop: CSS Grid Triangle layout with connectors */}
        <div className="hidden md:block relative">
          {/* SVG Curved Connector Lines - Dotted */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
          >
            {/* Step 1 (bottom-left) to Step 2 (top-center) */}
            <path
              d="M 18 68 C 22 28, 44 19, 50 22"
              stroke="hsl(var(--primary) / 0.4)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 8"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
            {/* Step 2 (top-center) to Step 3 (bottom-right) */}
            <path
              d="M 50 22 C 56 19, 75 28, 80 68"
              stroke="hsl(var(--primary) / 0.4)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 8"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="relative grid grid-cols-[1fr_minmax(450px,2fr)_1fr] grid-rows-[auto_1fr] gap-4">
            {/* Step 2 - Top Center (row 1, col 2) - Title ABOVE circle */}
            {steps[1] && (
              <div
                className={`col-start-2 row-start-1 flex flex-col items-center justify-center pb-6 transition-opacity duration-300 ${getStepOpacity(1)}`}
                data-testid="numbered-step-2"
              >
                <div className="mb-4 flex items-center gap-3">
                  <StepNumber index={1} variant="spotlight" size="md" />
                  {steps[1].title && (
                    <h3 className="text-lg font-semibold text-foreground leading-tight max-w-[120px]">
                      {steps[1].title}
                    </h3>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-background" />
                  <button
                    onClick={() => handleStepInteraction(1)}
                    onMouseEnter={() => setActiveStep(1)}
                    aria-label={steps[1].title || "Step 2"}
                    aria-expanded={activeStep === 1}
                    className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all cursor-pointer ${
                      activeStep === 1
                        ? "border-primary bg-primary/20 scale-110 shadow-lg"
                        : "border-primary/50 bg-primary/10 hover:border-primary hover:scale-105"
                    }`}
                    data-testid="button-numbered-step-2"
                  >
                    {getIcon(steps[1].icon)}
                  </button>
                </div>
              </div>
            )}

            {/* Step 1 - Bottom Left (row 2, col 1) - Title to LEFT of circle */}
            {steps[0] && (
              <div
                className={`col-start-1 row-start-2 flex items-center justify-start gap-4 h-full transition-opacity duration-300 ${getStepOpacity(0)}`}
                data-testid="numbered-step-1"
              >
                <div className="flex items-center gap-3">
                  <StepNumber index={0} variant="spotlight" size="md" />
                  {steps[0].title && (
                    <h3 className="text-lg font-semibold text-foreground leading-tight max-w-[120px]">
                      {steps[0].title}
                    </h3>
                  )}
                </div>
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-background" />
                  <button
                    onClick={() => handleStepInteraction(0)}
                    onMouseEnter={() => setActiveStep(0)}
                    aria-label={steps[0].title || "Step 1"}
                    aria-expanded={activeStep === 0}
                    className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all cursor-pointer ${
                      activeStep === 0
                        ? "border-primary bg-primary/20 scale-110 shadow-lg"
                        : "border-primary/50 bg-primary/10 hover:border-primary hover:scale-105"
                    }`}
                    data-testid="button-numbered-step-1"
                  >
                    {getIcon(steps[0].icon)}
                  </button>
                </div>
              </div>
            )}

            {/* Center Content - row 2, col 2 - No background, just arrow indicator */}
            <div
              className="col-start-2 row-start-2 flex items-center justify-center"
            >
              <div
                className="relative p-10 w-full max-w-[420px] min-h-[200px] lg:min-h-[280px] flex flex-col items-center justify-center text-center"
                data-testid="bubble-content"
              >
                {/* Arrow indicator pointing to active step */}
                <div
                  className={`absolute w-0 h-0 transition-all duration-300
                    ${activeStep === 0 ? "left-0 top-1/2 -translate-y-1/2 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[16px] border-r-primary/60" : ""}
                    ${activeStep === 1 ? "top-0 left-1/2 -translate-x-1/2 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[16px] border-b-primary/60" : ""}
                    ${activeStep === 2 ? "right-0 top-1/2 -translate-y-1/2 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[16px] border-l-primary/60" : ""}
                  `}
                />
                {activeContent && (
                  <div key={activeStep} className="animate-in fade-in duration-300">
                    {activeContent.title && (
                      <h4 className="text-xl font-semibold text-foreground mb-4 flex items-center justify-center gap-2">
                        <span className="text-primary font-bold text-2xl">
                          {String(activeStep + 1).padStart(2, "0")}
                        </span>
                        {activeContent.title}
                      </h4>
                    )}
                    {activeContent.text && (
                      <p className="text-muted-foreground mb-4 text-base">{activeContent.text}</p>
                    )}
                    {activeContent.bullets.length > 0 && (
                      <ul className="space-y-3 text-left">
                        {activeContent.bullets.map((bullet, bulletIndex) => (
                          <li
                            key={bulletIndex}
                            className="flex gap-2 items-start text-base text-muted-foreground"
                          >
                            <span className="text-foreground flex-shrink-0 mt-1">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Step 3 - Bottom Right (row 2, col 3) - Title to RIGHT of circle */}
            {steps[2] && (
              <div
                className={`col-start-3 row-start-2 flex items-center justify-start gap-4 h-full transition-opacity duration-300 ${getStepOpacity(2)}`}
                data-testid="numbered-step-3"
              >
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-background" />
                  <button
                    onClick={() => handleStepInteraction(2)}
                    onMouseEnter={() => setActiveStep(2)}
                    aria-label={steps[2].title || "Step 3"}
                    aria-expanded={activeStep === 2}
                    className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all cursor-pointer ${
                      activeStep === 2
                        ? "border-primary bg-primary/20 scale-110 shadow-lg"
                        : "border-primary/50 bg-primary/10 hover:border-primary hover:scale-105"
                    }`}
                    data-testid="button-numbered-step-3"
                  >
                    {getIcon(steps[2].icon)}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <StepNumber index={2} variant="spotlight" size="md" />
                  {steps[2].title && (
                    <h3 className="text-lg font-semibold text-foreground leading-tight max-w-[120px]">
                      {steps[2].title}
                    </h3>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default NumberedStepsBubbleText;
