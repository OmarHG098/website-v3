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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = useCallback((index: number) => {
    if (index === currentSlide || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 300);
  }, [currentSlide, isTransitioning]);

  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }, [currentSlide, slides.length, goToSlide]);

  useEffect(() => {
    if (isEditMode || slides.length <= 1 || !isVisible) return;

    timerRef.current = setInterval(nextSlide, autoplayInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isEditMode, slides.length, autoplayInterval, nextSlide, isVisible]);

  const slide = slides[currentSlide];
  const hasMultipleSlides = slides.length > 1;

  const getTextAnimationStyle = (delay: number) => {
    if (isEditMode) return {};
    return {
      opacity: isVisible && !isTransitioning ? 1 : 0,
      transform: isVisible && !isTransitioning ? "translateY(0)" : "translateY(12px)",
      transition: `opacity 0.4s ease-out ${delay}s, transform 0.4s ease-out ${delay}s`,
    };
  };

  return (
    <div 
      className={`${className} relative`}
      style={style}
      data-testid="image-row-highlight"
    >
      <div className="flex flex-col justify-center h-full">
        <p 
          className="text-body mb-4 font-light"
          style={getTextAnimationStyle(0.1)}
        >
          {slide?.heading}
        </p>
        <p 
          className="text-h2 leading-tight"
          style={getTextAnimationStyle(0.25)}
        >
          {slide?.text}
        </p>
      </div>

      {hasMultipleSlides && showIndicators && (
        <div 
          className="absolute bottom-4 left-0 right-0 flex justify-center gap-2"
          style={getTextAnimationStyle(0.4)}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "bg-current opacity-100 scale-125" 
                  : "bg-current opacity-40 hover:opacity-60"
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
              style={getAnimationStyle(0)}
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
                  className={`hidden md:flex ${highlightBg} px-6 py-8 md:px-8 md:py-12 rounded-card h-[var(--image-row-height-desktop)]`}
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
