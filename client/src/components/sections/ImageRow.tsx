import { useState, useEffect, useRef } from "react";
import { useEditModeOptional } from "@/contexts/EditModeContext";
import type { ImageRowSection } from "../../../../marketing-content/component-registry/image_row/v1.0/schema";

interface ImageRowProps {
  data: ImageRowSection;
}

const GAP_CLASSES = {
  sm: "gap-1 md:gap-2",
  md: "gap-2 md:gap-4",
  lg: "gap-4 md:gap-6",
};

const BACKGROUND_CLASSES: Record<string, string> = {
  primary: "bg-primary text-primary-foreground",
  accent: "bg-accent text-accent-foreground",
  muted: "bg-muted text-muted-foreground",
  card: "bg-card text-card-foreground",
  background: "bg-background text-foreground",
};

export default function ImageRow({ data }: ImageRowProps) {
  const {
    images,
    highlight,
    height = "31rem",
    mobile_height = "24rem",
    gap = "md",
    rounded = true,
    background,
  } = data;

  const editModeContext = useEditModeOptional();
  const isEditMode = editModeContext?.isEditMode ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isEditMode]);

  const gapClass = GAP_CLASSES[gap] || GAP_CLASSES.md;
  const roundedClass = rounded ? "rounded-lg" : "";
  const highlightWidth = highlight?.width || 2;
  const highlightBg = highlight?.background 
    ? BACKGROUND_CLASSES[highlight.background] || BACKGROUND_CLASSES.primary
    : BACKGROUND_CLASSES.primary;

  const sectionBgClass = background 
    ? BACKGROUND_CLASSES[background] || ""
    : "";

  const getAnimationStyle = (index: number) => {
    if (isEditMode) return {};
    return {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.5s ease-out ${index * 0.12}s, transform 0.5s ease-out ${index * 0.12}s`,
    };
  };

  const highlightIndex = images.length;

  return (
    <section ref={sectionRef} className={sectionBgClass} data-testid="section-image-row">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 max-w-7xl mx-auto">
          {highlight && (
            <div 
              className={`${highlightBg} px-6 py-8 md:px-8 md:py-12 rounded-card flex flex-col justify-center md:hidden`}
              style={getAnimationStyle(0)}
              data-testid="image-row-highlight-mobile"
            >
              <p className="text-body mb-4 font-light">
                {highlight.heading}
              </p>
              <p className="text-h2 leading-tight">
                {highlight.text}
              </p>
            </div>
          )}

          <div 
            className={`flex flex-row items-stretch ${gapClass}`}
            style={{ 
              "--image-row-height-mobile": mobile_height,
              "--image-row-height-desktop": height,
            } as React.CSSProperties}
            data-testid="image-row-container"
          >
            <div 
              className="contents"
              style={{ display: "contents" }}
            >
              {images.map((image, index) => {
                const imageHeight = image.height || undefined;
                return (
                  <div
                    key={image.src || `image-${index}`}
                    className="flex-1 min-w-0"
                    style={{
                      height: imageHeight || `var(--image-row-height-mobile)`,
                      ...getAnimationStyle(index),
                    }}
                    data-testid={`image-row-item-${index}`}
                  >
                    <style>{`
                      @media (min-width: 768px) {
                        [data-testid="image-row-item-${index}"] {
                          height: ${imageHeight || `var(--image-row-height-desktop)`} !important;
                        }
                      }
                    `}</style>
                    <img
                      src={image.src}
                      alt={image.alt}
                      className={`w-full h-full ${roundedClass}`}
                      style={{
                        objectFit: image.object_fit || "cover",
                        objectPosition: image.object_position || "center center",
                      }}
                      loading="lazy"
                      data-testid={`img-image-row-${index}`}
                    />
                  </div>
                );
              })}

              {highlight && (
                <div 
                  className={`hidden md:flex ${highlightBg} px-6 py-8 md:px-8 md:py-12 rounded-card flex-col justify-center h-[var(--image-row-height-desktop)]`}
                  style={{ flex: highlightWidth, ...getAnimationStyle(highlightIndex) }}
                  data-testid="image-row-highlight-desktop"
                >
                  <p className="text-body mb-4 font-light">
                    {highlight.heading}
                  </p>
                  <p className="text-h2 leading-tight">
                    {highlight.text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
