import { Button } from "@/components/ui/button";
import * as TablerIcons from "@tabler/icons-react";
import type { TwoColumnSection as TwoColumnSectionType, TwoColumnColumn } from "@shared/schema";
import type { ComponentType, CSSProperties } from "react";
import VideoPlayer from "./VideoPlayer";

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

const getPaddingClass = (padding?: string, side: "left" | "right" = "left"): string => {
  const paddingMap: Record<string, string> = {
    "0": side === "left" ? "lg:pl-0" : "lg:pr-0",
    "1": side === "left" ? "lg:pl-1" : "lg:pr-1",
    "2": side === "left" ? "lg:pl-2" : "lg:pr-2",
    "3": side === "left" ? "lg:pl-3" : "lg:pr-3",
    "4": side === "left" ? "lg:pl-4" : "lg:pr-4",
    "5": side === "left" ? "lg:pl-5" : "lg:pr-5",
    "6": side === "left" ? "lg:pl-6" : "lg:pr-6",
    "7": side === "left" ? "lg:pl-7" : "lg:pr-7",
    "8": side === "left" ? "lg:pl-8" : "lg:pr-8",
    "9": side === "left" ? "lg:pl-9" : "lg:pr-9",
    "10": side === "left" ? "lg:pl-10" : "lg:pr-10",
    "11": side === "left" ? "lg:pl-11" : "lg:pr-11",
    "12": side === "left" ? "lg:pl-12" : "lg:pr-12",
    "14": side === "left" ? "lg:pl-14" : "lg:pr-14",
    "16": side === "left" ? "lg:pl-16" : "lg:pr-16",
    "20": side === "left" ? "lg:pl-20" : "lg:pr-20",
    "24": side === "left" ? "lg:pl-24" : "lg:pr-24",
    "28": side === "left" ? "lg:pl-28" : "lg:pr-28",
    "32": side === "left" ? "lg:pl-32" : "lg:pr-32",
    "36": side === "left" ? "lg:pl-36" : "lg:pr-36",
    "40": side === "left" ? "lg:pl-40" : "lg:pr-40",
    "44": side === "left" ? "lg:pl-44" : "lg:pr-44",
    "48": side === "left" ? "lg:pl-48" : "lg:pr-48",
    "52": side === "left" ? "lg:pl-52" : "lg:pr-52",
    "56": side === "left" ? "lg:pl-56" : "lg:pr-56",
    "60": side === "left" ? "lg:pl-60" : "lg:pr-60",
    "64": side === "left" ? "lg:pl-64" : "lg:pr-64",
    "72": side === "left" ? "lg:pl-72" : "lg:pr-72",
    "80": side === "left" ? "lg:pl-80" : "lg:pr-80",
    "96": side === "left" ? "lg:pl-96" : "lg:pr-96",
  };
  const defaultPadding = "0"
  return padding ? (paddingMap[padding] || defaultPadding) : defaultPadding;
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
      className={`py-14 mb-8 ${backgroundClass}`}
      data-testid="section-two-column"
      style={containerStyle}
    >
      <div className={`max-w-6xl mx-auto px-4 ${paddingLeftClass} ${paddingRightClass}`}>
        <div className={`grid grid-cols-1 lg:grid-cols-12 ${columnGapClass} ${alignmentClass}`}>
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
    </section>
  );
}
