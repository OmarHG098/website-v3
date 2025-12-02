import { useState } from "react";
import type { SyllabusSection as SyllabusSectionType } from "@shared/schema";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SyllabusSectionProps {
  data: SyllabusSectionType;
}

interface ModuleAccordionProps {
  title: string;
  description: string;
  isOpen: boolean;
  onToggle: () => void;
  testId: string;
}

function ModuleAccordion({ title, description, isOpen, onToggle, testId }: ModuleAccordionProps) {
  return (
    <div 
      className="bg-background rounded-md overflow-hidden"
      data-testid={testId}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
        data-testid={`${testId}-toggle`}
      >
        <span className={cn(
          "font-semibold text-left",
          isOpen ? "text-primary" : "text-foreground"
        )}>
          {title}
        </span>
        <span className="text-sm text-primary flex items-center gap-1">
          <span>{isOpen ? "Hide course details" : "Course details"}</span>
          <ChevronDown 
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </span>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <p className="px-6 pb-4 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

export function SyllabusSection({ data }: SyllabusSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      className="py-16 bg-primary/5"
      data-testid="section-syllabus"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
            data-testid="text-syllabus-title"
          >
            {data.title}
          </h2>
          {data.subtitle && (
            <p 
              className="text-lg text-muted-foreground"
              data-testid="text-syllabus-subtitle"
            >
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="space-y-2">
          {data.modules.map((module, index) => (
            <ModuleAccordion
              key={index}
              title={module.title}
              description={module.description}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              testId={`syllabus-module-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
