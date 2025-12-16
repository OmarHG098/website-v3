import { useState } from "react";
import type { SyllabusSection as SyllabusSectionType, SyllabusDefault, SyllabusLanding } from "@shared/schema";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import * as TablerIcons from "@tabler/icons-react";
import type { ComponentType } from "react";

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

function getIcon(iconName: string, className?: string) {
  const IconComponent = TablerIcons[`Icon${iconName}` as keyof typeof TablerIcons] as ComponentType<{ className?: string }>;
  if (IconComponent) {
    return <IconComponent className={className || "w-5 h-5 text-primary"} />;
  }
  return <TablerIcons.IconBox className={className || "w-5 h-5 text-primary"} />;
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
          <span className="hidden md:inline">{isOpen ? "Hide course details" : "Course details"}</span>
          <ChevronDown 
            className={cn(
              "h-5 w-5 shrink-0 transition-transform duration-200",
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

interface FocusAreaCardProps {
  title: string;
  icon?: string;
  testId: string;
}

function FocusAreaCard({ title, icon, testId }: FocusAreaCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-200 overflow-hidden group",
        "border-l-4 border-l-primary/40",
        "bg-card hover:bg-muted hover:border-l-primary hover:shadow-md"
      )}
      data-testid={testId}
    >
      <div className="flex items-center gap-4 p-5">
        <div className={cn(
          "flex-shrink-0 transition-colors duration-200",
          "text-muted-foreground group-hover:text-primary"
        )}>
          {getIcon(icon || "Sparkles", "w-6 h-6")}
        </div>
        <span className="transition-all duration-200 text-muted-foreground font-medium group-hover:text-foreground group-hover:font-semibold text-[18px]">
          {title}
        </span>
      </div>
    </Card>
  );
}

function SyllabusDefault({ data }: { data: SyllabusDefault }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const modules = data.modules || [];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (modules.length === 0) {
    return (
      <section className="py-20 md:py-24 bg-primary/5" data-testid="section-syllabus">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground">
          Syllabus section requires at least one module
        </div>
      </section>
    );
  }

  return (
    <section 
      className="py-20 md:py-24 bg-primary/5"
      data-testid="section-syllabus"
    >
      <div className="max-w-6xl mx-auto px-4">
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
          {modules.map((module, index) => (
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

function SyllabusLandingVariant({ data }: { data: SyllabusLanding }) {
  const focusAreas = data.focus_areas || [];

  if (focusAreas.length === 0) {
    return (
      <section className="py-20 md:py-24 bg-primary/5" data-testid="section-syllabus-landing">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground">
          Syllabus section requires at least one focus area
        </div>
      </section>
    );
  }

  return (
    <section 
      className="py-20 md:py-24 bg-primary/5"
      data-testid="section-syllabus-landing"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-10">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
            data-testid="text-syllabus-title"
          >
            {data.title}
          </h2>
          {data.description && (
            <p 
              className="text-lg text-muted-foreground mb-3"
              data-testid="text-syllabus-description"
            >
              {data.description}
            </p>
          )}
          {data.emphasis && (
            <p 
              className="text-lg font-semibold text-foreground"
              data-testid="text-syllabus-emphasis"
            >
              {data.emphasis}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {focusAreas.map((area, index) => (
            <FocusAreaCard
              key={index}
              title={area.title}
              icon={area.icon}
              testId={`syllabus-focus-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function SyllabusSection({ data }: SyllabusSectionProps) {
  // Check for landing-syllabus variant
  if ('variant' in data && data.variant === 'landing-syllabus') {
    return <SyllabusLandingVariant data={data as SyllabusLanding} />;
  }
  
  // Default accordion variant
  return <SyllabusDefault data={data as SyllabusDefault} />;
}
