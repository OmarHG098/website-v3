import { Button } from "@/components/ui/button";
import * as TablerIcons from "@tabler/icons-react";
import type { TwoColumnSection as TwoColumnSectionType, TwoColumnColumn } from "@shared/schema";
import type { ComponentType, CSSProperties } from "react";

interface TwoColumnProps {
  data: TwoColumnSectionType;
}

const getIcon = (iconName: string, className?: string) => {
  const icons = TablerIcons as unknown as Record<string, ComponentType<{ className?: string; size?: number }>>;
  const IconComponent = icons[`Icon${iconName}`];
  return IconComponent ? <IconComponent className={className} size={20} /> : null;
};

const getGridColClass = (proportion: number): string => {
  const colMap: Record<number, string> = {
    1: "lg:col-span-1",
    2: "lg:col-span-2",
    3: "lg:col-span-3",
    4: "lg:col-span-4",
    5: "lg:col-span-5",
    6: "lg:col-span-6",
    7: "lg:col-span-7",
    8: "lg:col-span-8",
    9: "lg:col-span-9",
    10: "lg:col-span-10",
    11: "lg:col-span-11",
    12: "lg:col-span-12",
  };
  return colMap[proportion] || "lg:col-span-6";
};

const getAlignmentClass = (alignment?: "start" | "center" | "end"): string => {
  switch (alignment) {
    case "start": return "items-start";
    case "end": return "items-end";
    case "center":
    default: return "items-center";
  }
};

const getJustifyClass = (justify?: "start" | "center" | "end"): string => {
  switch (justify) {
    case "start": return "justify-start";
    case "end": return "justify-end";
    case "center":
    default: return "justify-center";
  }
};

const getResponsiveJustifyClass = (justify?: "start" | "center" | "end"): string => {
  switch (justify) {
    case "start": return "justify-center lg:justify-start";
    case "end": return "justify-center lg:justify-end";
    case "center":
    default: return "justify-center";
  }
};

const getGapClass = (gap?: string): string => {
  const gapMap: Record<string, string> = {
    "1": "gap-1",
    "2": "gap-2",
    "3": "gap-3",
    "4": "gap-4",
    "5": "gap-5",
    "6": "gap-6",
    "8": "gap-8",
    "10": "gap-10",
    "12": "gap-12",
  };
  return gap ? (gapMap[gap] || "gap-4") : "gap-4";
};

const getItemsAlignClass = (justify?: "start" | "center" | "end"): string => {
  switch (justify) {
    case "center": return "lg:items-center lg:text-center";
    case "end": return "lg:items-end lg:text-right";
    case "start": 
    default: return "lg:items-start lg:text-left";
  }
};

const getTextFontSize = (size?: string): string => {
  const sizeMap: Record<string, string> = {
    "sm": "text-lg",
    "md": "text-xl",
    "lg": "text-2xl",
    "xl": "text-3xl",
  };
  return size ? (sizeMap[size] || "text-xl") : "text-xl";
};

function ColumnContent({ column, defaultBulletIcon }: { column: TwoColumnColumn; defaultBulletIcon?: string }) {
  const bulletIcon = column.bullet_icon || defaultBulletIcon || "Check";
  const gapClass = getGapClass(column.gap);
  const itemsAlignClass = getItemsAlignClass(column.justify);
  const textFontSize = getTextFontSize(column.font_size);

  return (
    <div className={`flex flex-col ${gapClass} ${itemsAlignClass}`}>
      {column.heading && (
        <h2 
          className="text-3xl md:text-4xl font-bold text-foreground text-center self-center lg:self-auto"
          data-testid="text-two-column-heading"
        >
          {column.heading}
        </h2>
      )}
      
      {column.sub_heading && (
        <p 
          className={`${textFontSize}`}
          data-testid="text-two-column-subheading"
        >
          {column.sub_heading}
        </p>
      )}
      
      {column.description && (
        <p 
          className={`${textFontSize} text-muted-foreground leading-relaxed`}
          data-testid="text-two-column-description"
        >
          {column.description}
        </p>
      )}

      {column.html_content && (
        <div 
          className="text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: column.html_content }}
          data-testid="html-two-column-content"
        />
      )}
      
      {column.bullets && column.bullets.length > 0 && (
        <ul className="space-y-4" data-testid="list-two-column-bullets">
          {column.bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-primary mt-1 flex-shrink-0">
                {getIcon(bullet.icon || bulletIcon, "w-5 h-5")}
              </span>
              <div className="flex flex-col">
                {bullet.heading && (
                  <span className={`font-semibold text-foreground ${textFontSize}`}>{bullet.heading}</span>
                )}
                <span className={`text-foreground ${textFontSize}`}>{bullet.text}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {column.button && (
        <div className="mt-2">
          <Button
            variant={column.button.variant === "primary" ? "default" : column.button.variant}
            size="lg"
            asChild
            data-testid="button-two-column-cta"
          >
            <a href={column.button.url} className="flex items-center gap-2">
              {column.button.icon && getIcon(column.button.icon)}
              {column.button.text}
            </a>
          </Button>
        </div>
      )}
      
      {column.image && (
        <div className={`flex ${getResponsiveJustifyClass(column.justify)}`}>
          <img 
            src={column.image} 
            alt={column.image_alt || "Section image"}
            className="rounded-md w-full max-w-md lg:max-w-none"
            style={{
              height: column.image_height || "auto",
              width: column.image_width || undefined,
            }}
            loading="lazy"
            data-testid="img-two-column"
          />
        </div>
      )}
      
      {column.video && (
        <div 
          className={`flex ${getJustifyClass(column.justify)}`}
          style={{ 
            height: column.video_height || "360px",
            width: column.video_width || "100%"
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${column.video}`}
            title="Video"
            className="w-full h-full rounded-md"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            data-testid="video-two-column"
          />
        </div>
      )}
    </div>
  );
}

export function TwoColumn({ data }: TwoColumnProps) {
  const [leftProportion, rightProportion] = data.proportions || [6, 6];
  const alignmentClass = getAlignmentClass(data.alignment);
  const leftColClass = getGridColClass(leftProportion);
  const rightColClass = getGridColClass(rightProportion);
  
  const containerStyle: CSSProperties = data.container_style 
    ? (data.container_style as unknown as CSSProperties)
    : {};

  const backgroundClass = data.background || "bg-background";

  return (
    <section 
      className={`py-14 ${backgroundClass}`}
      data-testid="section-two-column"
      style={containerStyle}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 ${alignmentClass}`}>
            {data.left && (
              <div className={`col-span-1 ${leftColClass} ${data.reverse_on_mobile ? "order-2 lg:order-1" : ""}`}>
                <ColumnContent column={data.left} />
              </div>
            )}
            
            {data.right && (
              <div className={`col-span-1 ${rightColClass} ${data.reverse_on_mobile ? "order-1 lg:order-2" : ""}`}>
                <ColumnContent column={data.right} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
