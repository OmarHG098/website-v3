import { useState, useRef } from "react";
import type { SyllabusSection as SyllabusSectionType, SyllabusDefault, SyllabusLanding, SyllabusProgramModules } from "@shared/schema";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as TablerIcons from "@tabler/icons-react";
import type { ComponentType } from "react";
import { SiGit, SiPython, SiReact, SiNodedotjs, SiOpenai, SiFlask, SiBootstrap, SiJavascript, SiHtml5, SiCss3, SiGithub } from "react-icons/si";

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
              "h-5 w-5 shrink-0 transition-transform duration-brand ease-brand",
              isOpen && "rotate-180"
            )}
          />
        </span>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-brand ease-brand",
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
        "transition-all duration-brand ease-brand overflow-hidden group",
        "border-l-4 border-l-primary/40",
        "bg-card hover:bg-muted hover:border-l-primary hover:shadow-card"
      )}
      data-testid={testId}
    >
      <div className="flex items-center gap-4 p-5">
        <div className={cn(
          "flex-shrink-0 transition-colors duration-brand ease-brand",
          "text-muted-foreground group-hover:text-primary"
        )}>
          {getIcon(icon || "Sparkles", "w-6 h-6")}
        </div>
        <span className="transition-colors duration-brand ease-brand text-muted-foreground font-medium group-hover:text-foreground text-body">
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
      <section className="py-section bg-primary/5" data-testid="section-syllabus">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground">
          Syllabus section requires at least one module
        </div>
      </section>
    );
  }

  return (
    <section 
      className="py-section bg-primary/5"
      data-testid="section-syllabus"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h2 
            className="text-h2 mb-4 text-foreground"
            data-testid="text-syllabus-title"
          >
            {data.title}
          </h2>
          {data.subtitle && (
            <p 
              className="text-body text-muted-foreground"
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
      <section className="py-section bg-primary/5" data-testid="section-syllabus-landing">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground">
          Syllabus section requires at least one focus area
        </div>
      </section>
    );
  }

  return (
    <section 
      className="py-section bg-primary/5"
      data-testid="section-syllabus-landing"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-10">
          <h2 
            className="text-h2 mb-4 text-foreground"
            data-testid="text-syllabus-title"
          >
            {data.title}
          </h2>
          {data.description && (
            <p 
              className="text-body text-muted-foreground mb-3"
              data-testid="text-syllabus-description"
            >
              {data.description}
            </p>
          )}
          {data.emphasis && (
            <p 
              className="font-semibold text-foreground text-h2"
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

const techIconMap: Record<string, ComponentType<{ className?: string }>> = {
  git: SiGit,
  python: SiPython,
  react: SiReact,
  nodejs: SiNodedotjs,
  openai: SiOpenai,
  flask: SiFlask,
  bootstrap: SiBootstrap,
  javascript: SiJavascript,
  html5: SiHtml5,
  css3: SiCss3,
  github: SiGithub,
};

function getTechIcon(iconName: string, className?: string) {
  const IconComponent = techIconMap[iconName.toLowerCase()];
  if (IconComponent) {
    return <IconComponent className={className || "w-6 h-6"} />;
  }
  return null;
}

function SyllabusProgramModulesVariant({ data }: { data: SyllabusProgramModules }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const moduleCards = data.module_cards || [];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (moduleCards.length === 0) {
    return (
      <section className="py-section bg-background" data-testid="section-syllabus-program">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground">
          Syllabus section requires at least one module
        </div>
      </section>
    );
  }

  return (
    <section 
      className="py-section bg-background"
      data-testid="section-syllabus-program"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80 flex-shrink-0">
            <Card className="p-6 bg-card h-full">
              <div className="mb-6">
                <h2 
                  className="text-h2 text-foreground mb-2"
                  data-testid="text-syllabus-program-title"
                >
                  {data.program_title}
                </h2>
                <span 
                  className="inline-block bg-accent text-accent-foreground px-3 py-1 text-lg font-semibold"
                  data-testid="text-syllabus-program-highlight"
                >
                  {data.program_highlight}
                </span>
              </div>
              
              {data.tech_logos && data.tech_logos.length > 0 && (
                <div className="flex flex-wrap gap-3" data-testid="list-tech-logos">
                  {data.tech_logos.map((logo, index) => (
                    <div 
                      key={index}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-brand"
                      title={logo.name}
                      data-testid={`icon-tech-${index}`}
                    >
                      {getTechIcon(logo.icon, "w-7 h-7")}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="flex-1 min-w-0">
            <div className="relative">
              <div className="absolute -top-4 right-0 flex gap-2 z-10">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scroll('left')}
                  className="rounded-full bg-background shadow-card"
                  data-testid="button-scroll-left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scroll('right')}
                  className="rounded-full bg-background shadow-card"
                  data-testid="button-scroll-right"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2">
                  {moduleCards.map((_, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                      {index < moduleCards.length - 1 && (
                        <div className="w-16 h-0.5 bg-muted" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div 
                ref={scrollContainerRef}
                className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                style={{ scrollbarWidth: 'thin' }}
                data-testid="container-module-cards"
              >
                {moduleCards.map((module, index) => (
                  <Card 
                    key={index}
                    className="flex-shrink-0 w-72 p-5 bg-card"
                    data-testid={`card-module-${index}`}
                  >
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Module {index + 1}
                      </p>
                      <h3 className="inline-block bg-accent text-accent-foreground px-2 py-0.5 font-semibold mb-2">
                        {module.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {module.duration}
                      </p>
                    </div>

                    <ul className="space-y-2 mb-4 text-sm text-foreground">
                      {module.objectives.map((objective, objIndex) => (
                        <li key={objIndex} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>

                    {module.projects && (
                      <div>
                        <p className="text-sm font-semibold text-primary mb-1">
                          Projects:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {module.projects}
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SyllabusSection({ data }: SyllabusSectionProps) {
  // Check for program-modules variant
  if ('variant' in data && data.variant === 'program-modules') {
    return <SyllabusProgramModulesVariant data={data as SyllabusProgramModules} />;
  }
  
  // Check for landing-syllabus variant
  if ('variant' in data && data.variant === 'landing-syllabus') {
    return <SyllabusLandingVariant data={data as SyllabusLanding} />;
  }
  
  // Default accordion variant
  return <SyllabusDefault data={data as SyllabusDefault} />;
}
