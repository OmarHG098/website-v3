import { Button } from "@/components/ui/button";
import * as TablerIcons from "@tabler/icons-react";
import type { TwoColumnSection as TwoColumnSectionType, TwoColumnColumn } from "@shared/schema";
import type { ComponentType, CSSProperties } from "react";
import VideoPlayer from "./VideoPlayer";

export type { TwoColumnSectionType };

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
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    5: "md:col-span-5",
    6: "md:col-span-6",
    7: "md:col-span-7",
    8: "md:col-span-8",
    9: "md:col-span-9",
    10: "md:col-span-10",
    11: "md:col-span-11",
    12: "md:col-span-12",
  };
  return colMap[proportion] || "md:col-span-6";
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
    case "start": return "justify-center md:justify-start";
    case "end": return "justify-center md:justify-end";
    case "center":
    default: return "justify-center";
  }
};

const gapMap: Record<string, string> = {
  "0": "gap-0", "1": "gap-1", "2": "gap-2", "3": "gap-3", "4": "gap-4",
  "5": "gap-5", "6": "gap-6", "7": "gap-7", "8": "gap-8", "9": "gap-9",
  "10": "gap-10", "11": "gap-11", "12": "gap-12", "14": "gap-14", "16": "gap-16",
  "20": "gap-20", "24": "gap-24", "28": "gap-28", "32": "gap-32", "36": "gap-36",
  "40": "gap-40", "44": "gap-44", "48": "gap-48", "52": "gap-52", "56": "gap-56",
  "60": "gap-60", "64": "gap-64", "72": "gap-72", "80": "gap-80", "96": "gap-96",
};

const getGapClass = (gap?: string): string => {
  return gap ? (gapMap[gap] || "gap-4") : "gap-4";
};

const getTextAlignClass = (textAlign?: "left" | "center" | "right"): string => {
  switch (textAlign) {
    case "center": return "text-center";
    case "right": return "text-right";
    case "left":
    default: return "text-left";
  }
};

const getTextFontSize = (size?: string): string => {
  const sizeMap: Record<string, string> = {
    "xs": "text-xs",
    "sm": "text-sm",
    "base": "text-base",
    "lg": "text-lg",
    "xl": "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
  };
  return size ? (sizeMap[size] || "text-xl") : "text-xl";
};

const paddingLeftMap: Record<string, string> = {
  "0": "md:pl-0", "1": "md:pl-1", "2": "md:pl-2", "3": "md:pl-3", "4": "md:pl-4",
  "5": "md:pl-5", "6": "md:pl-6", "7": "md:pl-7", "8": "md:pl-8", "9": "md:pl-9",
  "10": "md:pl-10", "11": "md:pl-11", "12": "md:pl-12", "14": "md:pl-14", "16": "md:pl-16",
  "20": "md:pl-20", "24": "md:pl-24", "28": "md:pl-28", "32": "md:pl-32", "36": "md:pl-36",
  "40": "md:pl-40", "44": "md:pl-44", "48": "md:pl-48", "52": "md:pl-52", "56": "md:pl-56",
  "60": "md:pl-60", "64": "md:pl-64", "72": "md:pl-72", "80": "md:pl-80", "96": "md:pl-96",
};

const paddingRightMap: Record<string, string> = {
  "0": "md:pr-0", "1": "md:pr-1", "2": "md:pr-2", "3": "md:pr-3", "4": "md:pr-4",
  "5": "md:pr-5", "6": "md:pr-6", "7": "md:pr-7", "8": "md:pr-8", "9": "md:pr-9",
  "10": "md:pr-10", "11": "md:pr-11", "12": "md:pr-12", "14": "md:pr-14", "16": "md:pr-16",
  "20": "md:pr-20", "24": "md:pr-24", "28": "md:pr-28", "32": "md:pr-32", "36": "md:pr-36",
  "40": "md:pr-40", "44": "md:pr-44", "48": "md:pr-48", "52": "md:pr-52", "56": "md:pr-56",
  "60": "md:pr-60", "64": "md:pr-64", "72": "md:pr-72", "80": "md:pr-80", "96": "md:pr-96",
};

const getPaddingClass = (padding?: string, side: "left" | "right" = "left"): string => {
  const paddingMap = side === "left" ? paddingLeftMap : paddingRightMap;
  return padding ? (paddingMap[padding] || "") : "";
};

function ColumnContent({ column, defaultBulletIcon }: { column: TwoColumnColumn; defaultBulletIcon?: string }) {
  const bulletIcon = column.bullet_icon || defaultBulletIcon || "Check";
  const bulletIconColor = column.bullet_icon_color || "text-primary";
  const gapClass = getGapClass(column.gap);
  const textAlignClass = getTextAlignClass(column.text_align);
  const textFontSize = getTextFontSize(column.font_size);

  const hasTextContent = column.heading || column.sub_heading || column.description || column.html_content || column.bullets || column.button;

  return (
    <div className={`flex flex-col ${gapClass}`}>
      {hasTextContent && (
        <div className={`flex flex-col ${gapClass} w-full ${textAlignClass}`}>
          {column.heading && (
            <h2 
              className="text-3xl md:text-4xl font-bold text-foreground"
              data-testid="text-two-column-heading"
            >
              {column.heading}
            </h2>
          )}
          
          {column.sub_heading && (
            <p 
              className={textFontSize}
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
            <ul className={`space-y-4 flex flex-col ${column.text_align === "center" ? "items-center" : column.text_align === "right" ? "items-end" : "items-start"}`} data-testid="list-two-column-bullets">
              {column.bullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className={`${bulletIconColor} mt-1 flex-shrink-0`}>
                    {column.bullet_char 
                      ? column.bullet_char 
                      : getIcon(bullet.icon || bulletIcon, "w-5 h-5")
                    }
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
        </div>
      )}
      
      {column.image && (
        <div className={`flex w-full ${getResponsiveJustifyClass(column.justify)}`}>
          <img 
            src={column.image} 
            alt={column.image_alt || "Section image"}
            className="rounded-md w-full max-w-xs lg:max-w-none"
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
          className={`w-full ${getJustifyClass(column.justify)}`}
          style={{ 
            width: column.video_width || "100%"
          }}
        >
          <VideoPlayer
            videoId={column.video}
            title="Video"
            ratio={column.video_height ? undefined : "16:9"}
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
  const columnGapClass = getGapClass(data.gap || "8");
  const paddingLeftClass = getPaddingClass(data.padding_left, "left");
  const paddingRightClass = getPaddingClass(data.padding_right, "right");
  
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
      <div className={`max-w-6xl mx-auto px-4 ${paddingLeftClass} ${paddingRightClass}`}>
        <div className={`grid grid-cols-1 md:grid-cols-12 ${columnGapClass} ${alignmentClass}`}>
          {data.left && (
            <div className={`col-span-1 ${leftColClass} ${data.reverse_on_mobile ? "order-2 md:order-1" : ""}`}>
              <ColumnContent column={data.left} />
            </div>
          )}
          
          {data.right && (
            <div className={`col-span-1 ${rightColClass} ${data.reverse_on_mobile ? "order-1 md:order-2" : ""}`}>
              <ColumnContent column={data.right} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
