import { memo } from "react";
import type { JobConfidenceSplitSection, JobConfidenceBenefit, ToolIcon } from "@shared/schema";
import { UniversalImage } from "@/components/UniversalImage";
import { 
  IconCheck, 
  IconBrandOpenai,
  IconBrandFigma,
  IconBrandGithub,
  IconBrandVscode,
  IconCode,
  IconRobot,
  IconSparkles,
  type Icon as TablerIconType
} from "@tabler/icons-react";

interface JobConfidenceSplitProps {
  data: JobConfidenceSplitSection;
}

const sizeClasses: Record<string, string> = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
};

const iconSizeMap: Record<string, number> = {
  sm: 20,
  md: 28,
  lg: 40,
};

const toolIconMap: Record<string, TablerIconType> = {
  BrandOpenai: IconBrandOpenai,
  BrandFigma: IconBrandFigma,
  BrandGithub: IconBrandGithub,
  BrandVscode: IconBrandVscode,
  Code: IconCode,
  Robot: IconRobot,
  Sparkles: IconSparkles,
};

function getToolIcon(iconName?: string): TablerIconType | null {
  if (!iconName) return null;
  return toolIconMap[iconName] || null;
}

function ToolIconBadge({ 
  tool, 
  index 
}: { 
  tool: ToolIcon; 
  index: number;
}) {
  const size = tool.size || "md";
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizeMap[size];
  const IconComponent = getToolIcon(tool.icon);

  const positionStyle: React.CSSProperties = {};
  if (tool.position) {
    if (tool.position.top) positionStyle.top = tool.position.top;
    if (tool.position.bottom) positionStyle.bottom = tool.position.bottom;
    if (tool.position.left) positionStyle.left = tool.position.left;
    if (tool.position.right) positionStyle.right = tool.position.right;
  }

  const hasContent = tool.image_id || IconComponent;

  if (!hasContent) {
    return null;
  }

  return (
    <div
      className={`absolute ${sizeClass} rounded-xl bg-card shadow-lg flex items-center justify-center`}
      style={positionStyle}
      data-testid={`tool-icon-${index}`}
    >
      {tool.image_id ? (
        <UniversalImage
          id={tool.image_id}
          className="w-3/4 h-3/4 object-contain"
          alt=""
        />
      ) : IconComponent ? (
        <IconComponent size={iconSize} className="text-foreground" />
      ) : null}
    </div>
  );
}

function BenefitRow({ 
  benefit, 
  index 
}: { 
  benefit: JobConfidenceBenefit; 
  index: number;
}) {
  return (
    <div 
      className="flex items-start gap-3 py-3"
      data-testid={`benefit-item-${index}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <IconCheck 
          className="text-primary" 
          size={20} 
          stroke={2.5}
        />
      </div>
      <p className="text-foreground font-medium leading-relaxed text-base">
        {benefit.text}
      </p>
    </div>
  );
}

export const JobConfidenceSplit = memo(function JobConfidenceSplit({ 
  data 
}: JobConfidenceSplitProps) {
  const { primary, secondary, background } = data;

  const backgroundClass = background === "muted" 
    ? "bg-muted" 
    : background === "card" 
      ? "bg-card" 
      : "bg-background";

  return (
    <section 
      className={`py-16 md:py-20 ${backgroundClass}`}
      data-testid="section-job-confidence-split"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Responsive grid: stacked mobile, 50/50 tablet, 3/4+1/4 desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[3fr_1fr] gap-4 md:gap-6">
          {/* Primary Card - Dark background */}
          <div 
            className="relative bg-primary text-primary-foreground rounded-[0.8rem] p-8 md:p-10 lg:p-12 overflow-hidden min-h-[320px] md:min-h-[360px]"
            data-testid="card-primary"
          >
            {/* Content */}
            <div className="relative z-10 max-w-md">
              {primary.badge && (
                <span 
                  className="inline-block text-sm font-medium text-primary-foreground/80 mb-3"
                  data-testid="text-primary-badge"
                >
                  {primary.badge}
                </span>
              )}
              <h2 
                className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4"
                data-testid="text-primary-heading"
              >
                {primary.heading}
              </h2>
              {primary.description && (
                <p 
                  className="text-primary-foreground/85 leading-relaxed text-base md:text-lg"
                  data-testid="text-primary-description"
                >
                  {primary.description}
                </p>
              )}
            </div>

            {/* Floating Tool Icons */}
            {primary.tool_icons && primary.tool_icons.length > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                {primary.tool_icons.map((tool: ToolIcon, index: number) => (
                  <ToolIconBadge key={index} tool={tool} index={index} />
                ))}
              </div>
            )}

            {/* Subtle decorative dots pattern */}
            <div className="absolute bottom-4 left-8 opacity-20">
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Card - Accent background with benefits */}
          <div 
            className="bg-accent text-accent-foreground rounded-[0.8rem] p-6 md:p-8 flex flex-col justify-center"
            data-testid="card-secondary"
          >
            <div className="space-y-1">
              {secondary.benefits.map((benefit: JobConfidenceBenefit, index: number) => (
                <BenefitRow key={index} benefit={benefit} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default JobConfidenceSplit;
