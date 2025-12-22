import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import * as TablerIcons from "@tabler/icons-react";

export interface SyllabusModuleCardProps {
  duration: string;
  title: string;
  objectives: string[];
  projects?: string;
  isActive?: boolean;
  orientation?: "vertical" | "horizontal";
  icon?: string;
  className?: string;
  testId?: string;
}

export function SyllabusModuleCard({
  duration,
  title,
  objectives,
  projects,
  isActive = true,
  orientation = "vertical",
  icon = "IconFlag",
  className,
  testId,
}: SyllabusModuleCardProps) {
  const isVertical = orientation === "vertical";
  const IconComponent = (TablerIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[icon] || TablerIcons.IconFlag;

  return (
    <Card 
      className={cn(
        "p-4 lg:p-6 rounded-card h-full",
        isActive 
          ? "bg-card shadow-card opacity-100" 
          : "bg-card shadow-none opacity-50",
        isVertical ? "min-h-[380px] min-w-[280px]lg:min-w-[320px] flex-shrink-0" : "min-w-[400px] lg:min-w-[600px] flex-shrink-0",
        className
      )}
      data-testid={testId}
    >
      {isVertical ? (
        <>
          <div className="mb-5">
            <p className="text-sm text-muted-foreground mb-2 font-medium">
              {duration}
            </p>
            <div className="flex items-center gap-2 ">
              <div className="flex items-center bg-accent px-2 py-1 gap-1 rounded">
                <IconComponent className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <h3 className="inline-block font-bold font-heading text-foreground">
                  {title}
                </h3>
              </div>
            </div>
          </div>

          <ul className="space-y-2.5 mb-5 text-sm text-foreground">
            {objectives.map((objective, objIndex) => (
              <li key={objIndex} className="flex items-start gap-2">
                <TablerIcons.IconCheck className="text-primary mt-0.5 w-4 h-4 flex-shrink-0" />
                <span className="leading-relaxed">{objective}</span>
              </li>
            ))}
          </ul>

          {projects && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-bold text-primary mb-1.5">
                Projects:
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {projects}
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-5">
            <p className="text-sm text-muted-foreground mb-2 font-medium">
              {duration}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-accent px-2 py-1 gap-1 rounded">
                <IconComponent className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <h3 className="inline-block font-bold font-heading text-foreground">
                  {title}
                </h3>
              </div>
            </div>
          </div>

          <div className="flex gap-8 mb-5">
            <ul className="space-y-1 text-sm text-foreground w-max">
              {objectives.slice(0, 4).map((objective, objIndex) => (
                <li key={objIndex} className="flex items-start gap-2">
                  <TablerIcons.IconCheck className="text-primary mt-0.5 w-4 h-4 flex-shrink-0" />
                  <span className="leading-relaxed">{objective}</span>
                </li>
              ))}
            </ul>
            {objectives.length > 4 && (
              <ul className="space-y-1 text-sm text-foreground w-max">
                {objectives.slice(4).map((objective, objIndex) => (
                  <li key={objIndex + 4} className="flex items-start gap-2">
                    <TablerIcons.IconCheck className="text-primary mt-0.5 w-4 h-4 flex-shrink-0" />
                    <span className="leading-relaxed">{objective}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {projects && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-bold text-primary mb-1.5">
                Projects:
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {projects}
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
