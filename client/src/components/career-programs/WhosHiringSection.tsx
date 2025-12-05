import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { WhosHiringSection as WhosHiringSectionType } from "@shared/schema";

interface WhosHiringSectionProps {
  data: WhosHiringSectionType;
}

export function WhosHiringSection({ data }: WhosHiringSectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const logos = data.logos || [];
  const LOGOS_PER_PAGE = isMobile ? 4 : 8;
  const totalPages = Math.ceil(logos.length / LOGOS_PER_PAGE);

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [currentPage, totalPages]);

  const goToPrevious = useCallback(() => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  }, [totalPages]);

  const goToNext = useCallback(() => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  }, [totalPages]);

  const currentLogos = logos.slice(
    currentPage * LOGOS_PER_PAGE,
    currentPage * LOGOS_PER_PAGE + LOGOS_PER_PAGE
  );

  if (logos.length === 0) {
    return null;
  }

  return (
    <section 
      className="py-12 md:py-16 bg-background"
      data-testid="section-whos-hiring"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-3 text-foreground"
            data-testid="text-whos-hiring-title"
          >
            {data.title}
          </h2>
          {data.subtitle && (
            <p 
              className="text-lg md:text-xl mb-4 text-foreground"
              data-testid="text-whos-hiring-subtitle"
            >
              {data.subtitle}
            </p>
          )}
          {data.description && (
            <p 
              className="text-base md:text-lg max-w-3xl mx-auto text-muted-foreground"
              data-testid="text-whos-hiring-description"
            >
              {data.description}
            </p>
          )}
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentLogos.map((logo, index) => (
              <Card 
                key={`${currentPage}-${index}`} 
                className="p-3 lg:p-6 flex items-center justify-center h-20 sm:h-40"
                data-testid={`card-logo-${currentPage * LOGOS_PER_PAGE + index}`}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-16 max-w-full object-contain"
                  loading="lazy"
                />
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6" data-testid="carousel-pagination">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                className="flex-shrink-0"
                data-testid="button-carousel-prev"
              >
                <IconChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      currentPage === index 
                        ? "bg-primary" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    data-testid={`button-pagination-dot-${index}`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="flex-shrink-0"
                data-testid="button-carousel-next"
              >
                <IconChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
