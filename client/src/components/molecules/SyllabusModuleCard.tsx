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
  className,
  testId,
}: SyllabusModuleCardProps) {
  const isVertical = orientation === "vertical";

  return (
    <Card 
      className={cn(
        "p-6 rounded-card h-full",
        isActive 
          ? "bg-card shadow-card opacity-100" 
          : "bg-card shadow-none opacity-50",
        isVertical ? "min-h-[380px] w-80" : "flex gap-6",
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
            <h3 
              className="inline-block px-2 py-1 font-bold font-heading text-foreground mb-2"
              style={{ backgroundColor: 'hsl(var(--accent))' }}
            >
              {title}
            </h3>
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
          <div className="flex-shrink-0 w-62">
            <p className="text-sm text-muted-foreground mb-2 font-medium">
              {duration}
            </p>
            <h3 
              className="inline-block px-2 py-1 font-bold font-heading text-foreground"
              style={{ backgroundColor: 'hsl(var(--accent))' }}
            >
              {title}
            </h3>
          </div>

          <div className="flex-1">
            <ul className="space-y-2 text-sm text-foreground">
              {objectives.map((objective, objIndex) => (
                <li key={objIndex} className="flex items-start gap-2">
                  <TablerIcons.IconCheck className="text-primary mt-0.5 w-4 h-4 flex-shrink-0" />
                  <span className="leading-relaxed">{objective}</span>
                </li>
              ))}
            </ul>

            {projects && (
              <div className="pt-4 mt-4 border-t border-border">
                <p className="text-sm font-bold text-primary mb-1.5">
                  Projects:
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {projects}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
