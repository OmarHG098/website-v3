import { useState, useCallback, useEffect, useRef } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink,
} from "@tabler/icons-react";
import { UniversalImage } from "@/components/UniversalImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  PartnershipCarouselSection,
  PartnershipSlide,
} from "@shared/schema";
import { Card } from "@/components/ui/card";

interface PartnershipCarouselProps {
  data: PartnershipCarouselSection;
}

function SlideLeftCard({
  slide,
  verticalCards = false,
}: {
  slide: PartnershipSlide;
  verticalCards?: boolean;
}) {
  return (
    <Card className={`flex ${verticalCards ? "" : "flex-col"} h-full`}>
      <div
        className={`min-h-[415px] relative overflow-hidden aspect-[16/9] md:aspect-[16/6] rounded-t-[0.8rem] ${verticalCards ? "w-[53%]" : ""}`}
      >
        <UniversalImage
          id={slide.image_id}
          className="w-full h-full"
          style={{
            objectFit:
              (slide.object_fit as React.CSSProperties["objectFit"]) || "cover",
            objectPosition: slide.object_position || "center",
          }}
          data-testid="img-partnership-slide"
        />
      </div>

      <div className="flex flex-col gap-4 p-6 flex-1">
        <h3
          className="text-2xl md:text-3xl font-bold text-foreground"
          data-testid="text-partnership-title"
        >
          {slide.title}
        </h3>

        {slide.description && (
          <p
            className="text-muted-foreground leading-relaxed text-sm"
            data-testid="text-partnership-description"
          >
            {slide.description}
          </p>
        )}
        <div className="flex flex-col justify-end h-full">
          {slide.stats && slide.stats.length > 0 && (
            <div className="flex justify-center">
              <div
                className={`grid ${slide.stats.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"} grid-cols-2 gap-3 mt-auto`}
                data-testid="stats-partnership"
              >
                {slide.stats.map((stat, i) => (
                  <Card
                    key={i}
                    className="flex flex-col items-center justify-center p-3"
                  >
                    <span
                      className="text-2xl md:text-3xl font-bold text-primary"
                      data-testid={`text-stat-value-${i}`}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-xs text-muted-foreground text-center"
                      data-testid={`text-stat-label-${i}`}
                    >
                      {stat.label}
                    </span>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {slide.cta && (
            <a
              href={slide.cta.url}
              className="mt-3 w-full"
              data-testid="link-partnership-cta"
            >
              <Button
                className="w-full"
                variant={
                  slide.cta.variant === "outline"
                    ? "outline"
                    : slide.cta.variant === "secondary"
                      ? "secondary"
                      : "default"
                }
              >
                {slide.cta.text}
              </Button>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

function SlideRightCard({
  slide,
  institutionsHeading,
  referencesHeading,
}: {
  slide: PartnershipSlide;
  institutionsHeading?: string;
  referencesHeading?: string;
}) {
  const hasInstitutions =
    slide.institution_logos && slide.institution_logos.length > 0;
  const hasReferences =
    slide.press_references && slide.press_references.length > 0;

  if (!hasInstitutions && !hasReferences) return null;

  return (
    <Card className="flex flex-col h-full p-6 gap-6">
      {hasInstitutions && (
        <div className="flex flex-col gap-3">
          <h4
            className="text-base font-bold text-foreground"
            data-testid="text-institutions-heading"
          >
            {institutionsHeading || "Institutions that contributed to this project"}
          </h4>
          <div
            className="flex gap-3"
            data-testid="logos-partnership"
          >
            {slide.institution_logos!.map((logo, i) => (
              <Card
                key={i}
                className="flex items-center justify-center p-1"
                data-testid={`card-institution-logo-${i}`}
              >
                <div
                  className="flex items-center justify-center"
                  style={{ height: logo.logo_height || "40px" }}
                >
                  <UniversalImage
                    id={logo.image_id}
                    alt={logo.alt}
                    className="h-full w-auto object-contain"
                    data-testid={`img-institution-logo-${i}`}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {hasReferences && (
        <div className="flex flex-col gap-3">
          <h4
            className="text-base font-bold text-foreground"
            data-testid="text-references-heading"
          >
            {referencesHeading || "References"}
          </h4>
          <div className="flex flex-col gap-3" data-testid="press-partnership">
            {slide.press_references!.map((ref, i) => {
              const wrapper = ref.url ? "a" : "div";
              const linkProps = ref.url
                ? {
                    href: ref.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  }
                : {};

              const Tag = wrapper as keyof JSX.IntrinsicElements;

              return (
                <Tag
                  key={i}
                  {...linkProps}
                  className={cn(
                    "flex items-start gap-3",
                    ref.url && "hover-elevate",
                  )}
                  data-testid={ref.url ? `link-press-ref-${i}` : `text-press-ref-${i}`}
                >
                  <IconExternalLink className="w-4 h-4 flex-shrink-0 mt-0.5 text-foreground" />
                  <div className="flex flex-col">
                    {ref.source && (
                      <span className="text-sm font-bold text-foreground">
                        {ref.source}
                      </span>
                    )}
                    {ref.text && (
                      <span className="text-xs text-muted-foreground">
                        {ref.text}
                      </span>
                    )}
                  </div>
                </Tag>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

function SlideContent({
  slide,
  verticalCards = false,
  institutionsHeading,
  referencesHeading,
}: {
  slide: PartnershipSlide;
  verticalCards?: boolean;
  institutionsHeading?: string;
  referencesHeading?: string;
}) {
  const hasRightCard =
    (slide.institution_logos && slide.institution_logos.length > 0) ||
    (slide.press_references && slide.press_references.length > 0);

  return (
    <div
      className={cn(
        "grid gap-6 h-full",
        hasRightCard ? "grid-cols-1 md:grid-cols-12" : "grid-cols-1",
      )}
    >
      <div
        className={
          hasRightCard
            ? `${verticalCards ? "md:col-span-9" : "md:col-span-8"}`
            : ""
        }
      >
        <SlideLeftCard slide={slide} verticalCards={verticalCards} />
      </div>

      {hasRightCard && (
        <div className={`${verticalCards ? "md:col-span-3" : "md:col-span-4"}`}>
          <SlideRightCard
            slide={slide}
            institutionsHeading={institutionsHeading}
            referencesHeading={referencesHeading}
          />
        </div>
      )}
    </div>
  );
}

export function PartnershipCarouselSplitCard({
  data,
}: PartnershipCarouselProps) {
  const {
    slides,
    heading,
    subtitle,
    autoplay,
    autoplay_interval,
    vertical_cards,
  } = data;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [maxHeight, setMaxHeight] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const totalSlides = slides.length;

  useEffect(() => {
    const measureNatural = () => {
      if (containerRef.current) {
        containerRef.current.style.height = "auto";
      }
      let tallest = 0;
      slideRefs.current.forEach((el) => {
        if (el) {
          tallest = Math.max(tallest, el.scrollHeight);
        }
      });
      if (tallest > 0) {
        setMaxHeight(tallest);
        if (containerRef.current) {
          containerRef.current.style.height = `${tallest}px`;
        }
      }
    };

    measureNatural();

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(measureNatural, 150);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [slides]);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setActiveIndex(((index % totalSlides) + totalSlides) % totalSlides);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [totalSlides, isTransitioning],
  );

  const goToPrevious = useCallback(
    () => goTo(activeIndex - 1),
    [activeIndex, goTo],
  );
  const goToNext = useCallback(
    () => goTo(activeIndex + 1),
    [activeIndex, goTo],
  );

  useEffect(() => {
    if (!autoplay || totalSlides <= 1) return;

    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        if (!isPausedRef.current) {
          setActiveIndex((prev) => (prev + 1) % totalSlides);
        }
      }, autoplay_interval || 5000);
    };

    startAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [autoplay, autoplay_interval, totalSlides]);

  const handlePause = useCallback(() => {
    isPausedRef.current = true;
  }, []);
  const handleResume = useCallback(() => {
    isPausedRef.current = false;
  }, []);

  return (
    <section
      className="w-full"
      style={data.background ? { background: data.background } : undefined}
      data-testid="section-partnership-carousel"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {(heading || subtitle) && (
          <div className="text-center mb-10">
            {heading && (
              <h2
                className="text-3xl md:text-4xl font-bold text-foreground mb-3"
                data-testid="text-carousel-heading"
              >
                {heading}
              </h2>
            )}
            {subtitle && (
              <p
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                data-testid="text-carousel-subtitle"
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div
          ref={containerRef}
          className="relative overflow-hidden"
          style={{
            height: maxHeight > 0 ? `${maxHeight}px` : "auto",
          }}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div
                key={i}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                className="w-full flex-shrink-0 h-full"
              >
                <SlideContent
                  slide={slide}
                  verticalCards={vertical_cards}
                  institutionsHeading={data.institutions_heading}
                  referencesHeading={data.references_heading}
                />
              </div>
            ))}
          </div>
        </div>

        {totalSlides > 1 && (
          <div className="flex items-center justify-between mt-6 px-2">
            <Button
              size="icon"
              variant="outline"
              onClick={goToPrevious}
              disabled={isTransitioning}
              data-testid="button-carousel-prev"
            >
              <IconChevronLeft className="w-5 h-5" />
            </Button>

            <div
              className="flex items-center gap-2"
              data-testid="dots-carousel"
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    i === activeIndex
                      ? "w-8 h-2 bg-primary"
                      : "w-2 h-2 bg-muted-foreground/30 hover-elevate",
                  )}
                  data-testid={`button-carousel-dot-${i}`}
                />
              ))}
            </div>

            <Button
              size="icon"
              variant="outline"
              onClick={goToNext}
              disabled={isTransitioning}
              data-testid="button-carousel-next"
            >
              <IconChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
