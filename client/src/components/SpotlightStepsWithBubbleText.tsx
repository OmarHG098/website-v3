import { useState } from "react";
import * as TablerIcons from "@tabler/icons-react";
import { getCustomIcon } from "./custom-icons";

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
  
  // Check custom icons first
  const CustomIcon = getCustomIcon(iconName);
  if (CustomIcon) {
    return <CustomIcon width="48px" height="48px" />;
  }
  
  // Fallback to Tabler icons
  const fullIconName = `Icon${iconName}`;
  const Icon = (TablerIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[fullIconName];
  if (Icon) {
    return <Icon className="w-8 h-8 text-primary" />;
  }
  return <IconCheck className="w-8 h-8 text-primary" />;
}

export default function SpotlightStepsWithBubbleText({ data }: SpotlightStepsWithBubbleTextProps) {
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

  const getBubblePointerClass = () => {
    switch (activeStep) {
      case 0: return "before:left-0 before:-translate-x-1/2 before:top-1/2 before:-translate-y-1/2 before:rotate-45";
      case 1: return "before:top-0 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45";
      case 2: return "before:right-0 before:translate-x-1/2 before:top-1/2 before:-translate-y-1/2 before:rotate-45";
      default: return "";
    }
  };

  const getStepOpacity = (_stepIndex: number) => {
    return "opacity-100";
  };

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
              className={`flex flex-col items-center transition-opacity duration-300 ${getStepOpacity(index)}`}
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
              <div className="mt-4 flex items-center gap-3">
                <div className="flex flex-col items-start">
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">Step</span>
                  <span className="text-2xl font-bold text-primary leading-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                {step.title && (
                  <h3 className="text-base font-semibold text-foreground leading-tight">
                    {step.title}
                  </h3>
                )}
              </div>
              {activeStep === index && step.bullets && (
                <div className="mt-4 p-4 bg-card border rounded-lg w-full animate-in fade-in slide-in-from-top-2 duration-300">
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

        {/* Desktop: CSS Grid Triangle layout with background and connectors */}
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
              d="M 18 68 C 25 40, 40 22, 50 22"
              stroke="hsl(var(--primary) / 0.4)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 8"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
            {/* Step 2 (top-center) to Step 3 (bottom-right) */}
            <path
              d="M 50 22 C 60 22, 75 40, 82 68"
              stroke="hsl(var(--primary) / 0.4)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 8"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="relative grid grid-cols-[1fr_minmax(400px,2fr)_1fr] grid-rows-[auto_1fr] gap-4">
            {/* Step 2 - Top Center (row 1, col 2) - Title ABOVE circle */}
            {steps[1] && (
              <div
                className={`col-start-2 row-start-1 flex flex-col items-center justify-end transition-opacity duration-300 ${getStepOpacity(1)}`}
                data-testid="spotlight-step-2"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">Step</span>
                    <span className="text-3xl font-bold text-primary leading-none">02</span>
                  </div>
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
                    className={`relative w-24 h-24 p-5 rounded-full border-4 flex items-center justify-center transition-all cursor-pointer ${
                      activeStep === 1
                        ? "border-primary bg-primary/20 scale-110 shadow-lg"
                        : "border-primary/50 bg-primary/10 hover:border-primary hover:scale-105"
                    }`}
                    data-testid="button-spotlight-step-2"
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
                data-testid="spotlight-step-1"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">Step</span>
                    <span className="text-3xl font-bold text-primary leading-none">01</span>
                  </div>
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
                    data-testid="button-spotlight-step-1"
                  >
                    {getIcon(steps[0].icon)}
                  </button>
                </div>
              </div>
            )}

            {/* Center Bubble - row 2, col 2 */}
            <div
              className="col-start-2 row-start-2 flex items-center justify-center"
            >
              <div
                className={`relative bg-card border-2 border-primary/30 rounded-[6rem] p-10 shadow-lg w-[420px] min-h-[280px] flex flex-col
                  before:content-[''] before:absolute before:w-5 before:h-5 before:bg-card before:border-2 before:border-primary/30 before:rotate-45
                  after:content-[''] after:absolute after:w-4 after:h-4 after:bg-card after:rotate-45
                  ${activeStep === 0 ? "before:left-0 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:border-r-0 before:border-t-0 after:left-0 after:top-1/2 after:-translate-x-1/3 after:-translate-y-1/2" : ""}
                  ${activeStep === 1 ? "before:top-0 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:border-b-0 before:border-r-0 after:top-0 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/3" : ""}
                  ${activeStep === 2 ? "before:right-0 before:top-1/2 before:translate-x-1/2 before:-translate-y-1/2 before:border-l-0 before:border-b-0 after:right-0 after:top-1/2 after:translate-x-1/3 after:-translate-y-1/2" : ""}
                `}
                data-testid="bubble-content"
              >
                {activeContent && (
                  <div key={activeStep} className="animate-in fade-in duration-300">
                    {activeContent.title && (
                      <h4 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
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
                      <ul className="space-y-3">
                        {activeContent.bullets.map((bullet, bulletIndex) => (
                          <li
                            key={bulletIndex}
                            className="flex gap-2 items-start text-base text-muted-foreground"
                          >
                            <span className="text-primary flex-shrink-0 mt-1">•</span>
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
                data-testid="spotlight-step-3"
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
                    data-testid="button-spotlight-step-3"
                  >
                    {getIcon(steps[2].icon)}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">Step</span>
                    <span className="text-3xl font-bold text-primary leading-none">03</span>
                  </div>
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
