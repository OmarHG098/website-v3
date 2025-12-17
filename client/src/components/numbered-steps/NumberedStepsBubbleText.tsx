import { useState } from "react";
import { StepNumber } from "../NumberedSteps";
import type { NumberedStepsBubbleTextSection } from "@shared/schema";

interface NumberedStepsBubbleTextProps {
  data: NumberedStepsBubbleTextSection;
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
              className="flex flex-col items-center"
              data-testid={`numbered-step-mobile-${index + 1}`}
            >
              <button
                onClick={() => handleStepInteraction(index)}
                aria-label={step.title || `Step ${index + 1}`}
                aria-expanded={activeStep === index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  activeStep === index
                    ? "scale-105"
                    : "hover:scale-102"
                }`}
                data-testid={`button-numbered-step-${index + 1}`}
              >
                <StepNumber index={index} variant="spotlight" size="sm" />
                {step.title && (
                  <h3 className="text-base font-semibold text-foreground leading-tight">
                    {step.title}
                  </h3>
                )}
              </button>
              {activeStep === index && step.bullets && (
                <div className="mt-4 p-4 w-full animate-in fade-in slide-in-from-top-2 duration-300">
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
            {/* Step 2 - Top Center (row 1, col 2) - Title above, step number below */}
            {steps[1] && (
              <div
                className="col-start-2 row-start-1 flex flex-col items-center justify-center pb-6"
                data-testid="numbered-step-2"
              >
                <button
                  onClick={() => handleStepInteraction(1)}
                  onMouseEnter={() => setActiveStep(1)}
                  aria-label={steps[1].title || "Step 2"}
                  aria-expanded={activeStep === 1}
                  className={`relative flex flex-col items-center gap-2 p-3 rounded-lg transition-all cursor-pointer ${
                    activeStep === 1 ? "scale-105" : "hover:scale-102"
                  }`}
                  data-testid="button-numbered-step-2"
                >
                  {/* Gradient fade for line - vertical fade from bottom */}
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-24 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />
                  {steps[1].title && (
                    <h3 className="relative text-lg font-semibold text-foreground leading-tight text-center max-w-[160px]">
                      {steps[1].title}
                    </h3>
                  )}
                  <div className="relative bg-background">
                    <StepNumber index={1} variant="spotlight" size="md" />
                  </div>
                </button>
              </div>
            )}

            {/* Step 1 - Bottom Left (row 2, col 1) - Title at left, step number at right */}
            {steps[0] && (
              <div
                className="col-start-1 row-start-2 flex items-center justify-end h-full mr-8"
                data-testid="numbered-step-1"
              >
                <button
                  onClick={() => handleStepInteraction(0)}
                  onMouseEnter={() => setActiveStep(0)}
                  aria-label={steps[0].title || "Step 1"}
                  aria-expanded={activeStep === 0}
                  className={`relative flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                    activeStep === 0 ? "scale-105" : "hover:scale-102"
                  }`}
                  data-testid="button-numbered-step-1"
                >
                  {/* Gradient fade for line - vertical fade */}
                  <div className="absolute -right-12 -top-16 w-24 h-48 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none" />
                  {steps[0].title && (
                    <h3 className="relative text-lg font-semibold text-foreground leading-tight max-w-[140px] text-right">
                      {steps[0].title}
                    </h3>
                  )}
                  <div className="relative bg-background">
                    <StepNumber index={0} variant="spotlight" size="md" />
                  </div>
                </button>
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

            {/* Step 3 - Bottom Right (row 2, col 3) - Step number and title at right */}
            {steps[2] && (
              <div
                className="col-start-3 row-start-2 flex items-center justify-start h-full ml-4"
                data-testid="numbered-step-3"
              >
                <button
                  onClick={() => handleStepInteraction(2)}
                  onMouseEnter={() => setActiveStep(2)}
                  aria-label={steps[2].title || "Step 3"}
                  aria-expanded={activeStep === 2}
                  className={`relative flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                    activeStep === 2 ? "scale-105" : "hover:scale-102"
                  }`}
                  data-testid="button-numbered-step-3"
                >
                  {/* Gradient fade for line - vertical fade */}
                  <div className="absolute -left-12 -top-16 w-24 h-48 bg-gradient-to-b from-background via-background/60 to-transparent pointer-events-none" />
                  <div className="relative bg-background">
                    <StepNumber index={2} variant="spotlight" size="md" />
                  </div>
                  {steps[2].title && (
                    <h3 className="relative text-lg font-semibold text-foreground leading-tight max-w-[140px] text-left">
                      {steps[2].title}
                    </h3>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default NumberedStepsBubbleText;
