import { useState, useEffect, useRef, useCallback } from "react";
import { useEditModeOptional } from "@/contexts/EditModeContext";
import type { ImageRowSection, ImageRowSlide } from "../../../../marketing-content/component-registry/image_row/v1.0/schema";

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

interface HighlightSlideshowProps {
  slides: ImageRowSlide[];
  autoplayInterval: number;
  showIndicators: boolean;
  isEditMode: boolean;
  isVisible: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function HighlightSlideshow({ 
  slides, 
  autoplayInterval, 
  showIndicators, 
  isEditMode,
  isVisible,
  className = "",
  style = {},
}: HighlightSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (index === currentSlide) return;
    setCurrentSlide(index);
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    clearTimer();
    
    if (isEditMode || slides.length <= 1 || !isVisible) {
      return;
    }

    timerRef.current = setInterval(nextSlide, autoplayInterval);
    
    return clearTimer;
  }, [isEditMode, slides.length, autoplayInterval, nextSlide, isVisible, clearTimer]);

  const hasMultipleSlides = slides.length > 1;

  const getContainerAnimationStyle = () => {
    if (isEditMode) return {};
    return {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
    };
  };

  const getTextAnimationStyle = (delaySeconds: number): React.CSSProperties => {
    if (isEditMode) return {};
    const isActiveAndVisible = isVisible && currentSlide !== undefined;
    return {
      opacity: isActiveAndVisible ? 1 : 0,
      transform: isActiveAndVisible ? "translateY(0)" : "translateY(12px)",
      transition: `opacity 0.4s ease-out ${delaySeconds}s, transform 0.4s ease-out ${delaySeconds}s`,
    };
  };

  return (
    <div 
      className={`${className} relative overflow-hidden`}
      style={{ ...style, ...getContainerAnimationStyle() }}
      data-testid="image-row-highlight"
    >
      <div className="relative flex-1 min-h-0">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const slideStyle: React.CSSProperties = isEditMode 
            ? { display: isActive ? "block" : "none" }
            : {
                position: index === 0 ? "relative" : "absolute",
                top: 0,
                left: 0,
                right: 0,
                opacity: isActive ? 1 : 0,
                transition: "opacity 0.5s ease-in-out",
                pointerEvents: isActive ? "auto" : "none",
              };

          return (
            <div
              key={index}
              className="flex flex-col justify-center"
              style={slideStyle}
              data-testid={`slide-content-${index}`}
            >
              <p 
                className="text-body mb-4 font-light"
                style={isActive ? getTextAnimationStyle(0.15) : {}}
              >
                {slide.heading}
              </p>
              <p 
                className="text-h2 leading-tight"
                style={isActive ? getTextAnimationStyle(0.35) : {}}
              >
                {slide.text}
              </p>
            </div>
          );
        })}
      </div>

      {hasMultipleSlides && showIndicators && (
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "bg-current opacity-100 scale-125" 
                  : "bg-current opacity-40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              data-testid={`slide-indicator-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

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

  const slides: ImageRowSlide[] = highlight?.slides?.length 
    ? highlight.slides 
    : highlight?.heading && highlight?.text 
      ? [{ heading: highlight.heading, text: highlight.text }]
      : [];

  const autoplayInterval = highlight?.autoplay_interval || 5000;
  const showIndicators = highlight?.show_indicators !== false;

  return (
    <section ref={sectionRef} className={sectionBgClass} data-testid="section-image-row">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 max-w-7xl mx-auto">
          {slides.length > 0 && (
            <HighlightSlideshow
              slides={slides}
              autoplayInterval={autoplayInterval}
              showIndicators={showIndicators}
              isEditMode={isEditMode}
              isVisible={isVisible}
              className={`${highlightBg} px-6 py-8 md:px-8 md:py-12 rounded-card md:hidden`}
            />
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

              {slides.length > 0 && (
                <HighlightSlideshow
                  slides={slides}
                  autoplayInterval={autoplayInterval}
                  showIndicators={showIndicators}
                  isEditMode={isEditMode}
                  isVisible={isVisible}
                  className={`hidden md:flex ${highlightBg} px-6 py-8 md:px-8 md:py-12 rounded-card flex-col h-[var(--image-row-height-desktop)]`}
                  style={{ flex: highlightWidth, ...getAnimationStyle(highlightIndex) }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
