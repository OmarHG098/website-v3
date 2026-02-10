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

function SlideLeftCard({ slide }: { slide: PartnershipSlide }) {
  return (
    <Card className="flex flex-col h-full">
      <div className="relative overflow-hidden aspect-[16/9] md:aspect-[16/8] rounded-t-[0.8rem]">
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

        {slide.stats && slide.stats.length > 0 && (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-auto"
            data-testid="stats-partnership"
          >
            {slide.stats.map((stat, i) => (
              <Card key={i} className="flex flex-col items-center justify-center p-3">
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
        )}

        {slide.cta && (
          <a
            href={slide.cta.url}
            className="mt-2 w-full"
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
    </Card>
  );
}

function SlideRightCard({ slide }: { slide: PartnershipSlide }) {
  const hasInstitutions = slide.institution_logos && slide.institution_logos.length > 0;
  const hasReferences = slide.press_references && slide.press_references.length > 0;

  if (!hasInstitutions && !hasReferences) return null;

  return (
    <Card className="flex flex-col h-full p-6 gap-6">
      {hasInstitutions && (
        <div className="flex flex-col gap-3">
          <h4
            className="text-base font-bold text-foreground"
            data-testid="text-institutions-heading"
          >
            Institutions that contributed to this project
          </h4>
          <div className="grid grid-cols-2 gap-3" data-testid="logos-partnership">
            {slide.institution_logos!.map((logo, i) => (
              <Card
                key={i}
                className="flex items-center justify-center p-3"
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
        <div className="flex flex-col gap-2">
          <h4
            className="text-base font-bold text-foreground"
            data-testid="text-references-heading"
          >
            References
          </h4>
          <div
            className="flex flex-col gap-2"
            data-testid="press-partnership"
          >
            {slide.press_references!.map((ref, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                {ref.url ? (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover-elevate inline-flex items-center gap-1"
                    data-testid={`link-press-ref-${i}`}
                  >
                    {ref.source && (
                      <span className="font-medium">{ref.source}:</span>
                    )}
                    <span>{ref.text}</span>
                    <IconExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                ) : (
                  <span data-testid={`text-press-ref-${i}`}>
                    {ref.source && (
                      <span className="font-medium">{ref.source}: </span>
                    )}
                    {ref.text}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export function PartnershipCarouselSplitCard({ data }: PartnershipCarouselProps) {
  const { slides, heading, subtitle, autoplay, autoplay_interval } = data;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);

  const totalSlides = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setActiveIndex(((index % totalSlides) + totalSlides) % totalSlides);
      setTimeout(() => setIsTransitioning(false), 400);
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

  const currentSlide = slides[activeIndex];

  if (!currentSlide) return null;

  const hasRightCard =
    (currentSlide.institution_logos && currentSlide.institution_logos.length > 0) ||
    (currentSlide.press_references && currentSlide.press_references.length > 0);

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
          className={cn(
            "grid gap-6",
            hasRightCard
              ? "grid-cols-1 md:grid-cols-12"
              : "grid-cols-1",
          )}
        >
          <div className={hasRightCard ? "md:col-span-8" : ""}>
            <SlideLeftCard slide={currentSlide} />
          </div>

          {hasRightCard && (
            <div className="md:col-span-4">
              <SlideRightCard slide={currentSlide} />
            </div>
          )}
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
