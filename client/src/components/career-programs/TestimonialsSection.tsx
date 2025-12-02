import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconStarFilled, IconStar } from "@tabler/icons-react";
import type { TestimonialsSection as TestimonialsSectionType } from "@shared/schema";

interface TestimonialsSectionProps {
  data: TestimonialsSectionType;
}

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  return (
    <section 
      className="py-16 bg-background"
      data-testid="section-testimonials"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {data.rating_summary && (
            <div 
              className="flex items-center justify-center gap-2 mb-4"
              data-testid="rating-summary"
            >
              <IconStarFilled className="w-7 h-7 text-yellow-500" />
              <span className="text-2xl font-bold text-foreground">
                {data.rating_summary.average}
              </span>
              <span className="text-muted-foreground">
                / {data.rating_summary.count} Reviews
              </span>
            </div>
          )}
          
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
            data-testid="text-testimonials-title"
          >
            {data.title}
          </h2>
          
          {data.subtitle && (
            <p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              data-testid="text-testimonials-subtitle"
            >
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto md:hidden">
          {data.items.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {data.items.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ 
  testimonial, 
  index 
}: { 
  testimonial: TestimonialsSectionType['items'][0]; 
  index: number;
}) {
  return (
    <Card
      data-testid={`card-testimonial-${index}`}
      className="h-full"
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            {testimonial.avatar && (
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            )}
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {testimonial.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{testimonial.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {testimonial.role}
              {testimonial.company && ` at ${testimonial.company}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) =>
            i < testimonial.rating ? (
              <IconStarFilled key={i} className="w-4 h-4 text-yellow-500" />
            ) : (
              <IconStar key={i} className="w-4 h-4 text-muted" />
            ),
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {testimonial.comment}
        </p>

        {testimonial.outcome && (
          <div className="pt-3 border-t">
            <Badge variant="secondary" className="text-xs">
              {testimonial.outcome}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
