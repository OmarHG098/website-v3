import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconStarFilled, IconStar } from "@tabler/icons-react";
import type { TestimonialsSection } from "@shared/schema";

interface TestimonialsGridProps {
  data: TestimonialsSection;
}

interface TestimonialItem {
  name: string;
  role: string;
  rating: number;
  comment: string;
  company?: string;
  outcome?: string;
  avatar?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TestimonialsGrid({ data }: TestimonialsGridProps) {
  const items = data?.items || [];
  const title = data?.title || "What Our Students Say";
  const subtitle = data?.subtitle;
  const ratingSummary = data?.rating_summary;

  if (items.length === 0) return null;

  return (
    <section 
      className="bg-background"
      data-testid="section-testimonials"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          {ratingSummary && (
            <div 
              className="flex items-center justify-center gap-2 mb-4"
              data-testid="rating-summary"
            >
              <IconStarFilled className="w-7 h-7 text-yellow-500" />
              <span className="text-2xl font-bold text-foreground">
                {ratingSummary.average}
              </span>
              <span className="text-muted-foreground">
                / {ratingSummary.count} Reviews
              </span>
            </div>
          )}
          
          <h2 
            className="text-h2 mb-4 text-foreground"
            data-testid="text-testimonials-title"
          >
            {title}
          </h2>
          
          {subtitle && (
            <p 
              className="text-body text-muted-foreground max-w-2xl mx-auto"
              data-testid="text-testimonials-subtitle"
            >
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.slice(0, 3).map((testimonial, index) => (
            <TestimonialCardGrid key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  testimonial: TestimonialItem;
}

function TestimonialCardGrid({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="border border-border bg-card h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <span className="font-semibold text-muted-foreground text-sm">
              {getInitials(testimonial.name)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate text-sm">
              {testimonial.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {testimonial.role}
              {testimonial.company && ` at ${testimonial.company}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0.5 mb-3">
          {Array.from({ length: 5 }).map((_, i) =>
            i < testimonial.rating ? (
              <IconStarFilled key={i} className="w-4 h-4 text-yellow-500" />
            ) : (
              <IconStar key={i} className="w-4 h-4 text-muted" />
            ),
          )}
        </div>

        <p className="text-muted-foreground leading-relaxed text-sm flex-1">
          {testimonial.comment}
        </p>

        {testimonial.outcome && (
          <div className="pt-4 mt-auto">
            <Badge variant="secondary" className="text-xs">
              {testimonial.outcome}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
