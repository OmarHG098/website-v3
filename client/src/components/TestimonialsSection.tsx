import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IconStarFilled, IconStar } from "@tabler/icons-react";
import type { TestimonialsSection as TestimonialsSectionType } from "@shared/schema";

import profilePic1 from "@assets/profile-pic1_1764775438461.webp";
import profilePic2 from "@assets/profile-pic2_1764775432918.webp";
import profilePic3 from "@assets/profile-pic3_1764775528641.webp";
import profilePic4 from "@assets/profile-pic4_1764775523318.webp";
import profilePic5 from "@assets/profile-pic5_1764775738827.webp";
import profilePic6 from "@assets/profile-pic6_1764775742734.webp";

const defaultAvatars = [profilePic1, profilePic2, profilePic3, profilePic4, profilePic5, profilePic6];

interface LegacyTestimonial {
  id: string;
  name: string;
  role: string;
  course?: string;
  rating: number;
  comment: string;
}

interface TestimonialsSectionProps {
  data?: TestimonialsSectionType;
  testimonials?: LegacyTestimonial[];
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

export function TestimonialsSection({ data, testimonials }: TestimonialsSectionProps) {
  const items = data?.items || testimonials?.map(t => ({
    name: t.name,
    role: t.role,
    rating: t.rating,
    comment: t.comment,
    company: t.course,
  })) || [];

  const title = data?.title || "What Our Students Say";
  const subtitle = data?.subtitle;
  const ratingSummary = data?.rating_summary;

  const { heroItem, smallItems, heroIndex, smallIndices } = useMemo(() => {
    if (items.length < 3) {
      return { 
        heroItem: items[0], 
        smallItems: items.slice(1), 
        heroIndex: 0,
        smallIndices: items.slice(1).map((_, i) => i + 1)
      };
    }

    const indexed = items.slice(0, 3).map((item, idx) => ({ item, idx, len: item.comment.length }));
    indexed.sort((a, b) => a.len - b.len);
    
    const small1 = indexed[0];
    const small2 = indexed[1];
    const hero = indexed[2];

    return {
      heroItem: hero.item,
      smallItems: [small1.item, small2.item],
      heroIndex: hero.idx,
      smallIndices: [small1.idx, small2.idx],
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <section 
      className="py-section bg-background"
      data-testid="section-testimonials"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
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

        {/* Mobile: single column stack */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {items.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              testimonial={testimonial} 
              index={index} 
              variant="normal"
            />
          ))}
        </div>

        {/* Tablet: 2 columns, hero spans full width on top */}
        <div className="hidden md:block lg:hidden">
          <div className="mb-4">
            <TestimonialCard 
              testimonial={heroItem} 
              index={heroIndex} 
              variant="hero"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {smallItems.map((testimonial, i) => (
              <TestimonialCard 
                key={i} 
                testimonial={testimonial} 
                index={smallIndices[i]} 
                variant="small"
              />
            ))}
          </div>
        </div>

        {/* Desktop: small - hero - small layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="col-span-3">
            <TestimonialCard 
              testimonial={smallItems[0]} 
              index={smallIndices[0]} 
              variant="small"
            />
          </div>
          <div className="col-span-6">
            <TestimonialCard 
              testimonial={heroItem} 
              index={heroIndex} 
              variant="hero"
            />
          </div>
          <div className="col-span-3">
            <TestimonialCard 
              testimonial={smallItems[1]} 
              index={smallIndices[1]} 
              variant="small"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;

function TestimonialCard({ 
  testimonial, 
  index,
  variant = "normal"
}: { 
  testimonial: TestimonialItem; 
  index: number;
  variant?: "small" | "hero" | "normal";
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSmall = variant === "small";
  const isHero = variant === "hero";

  const shouldClamp = isSmall && testimonial.comment.length > 120;

  return (
    <Card
      data-testid={`card-testimonial-${index}`}
      className="h-full"
    >
      <CardContent className={`h-full flex flex-col ${isHero ? "p-8" : "p-6"}`}>
        <div className="flex items-center gap-3 mb-4">
          <Avatar className={isHero ? "h-12 w-12" : "h-10 w-10"}>
            <AvatarImage 
              src={testimonial.avatar || defaultAvatars[index % defaultAvatars.length]} 
              alt={testimonial.name} 
            />
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-foreground truncate ${isHero ? "text-base" : "text-sm"}`}>
              {testimonial.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {testimonial.role}
              {testimonial.company && ` at ${testimonial.company}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) =>
            i < testimonial.rating ? (
              <IconStarFilled key={i} className={`${isHero ? "w-5 h-5" : "w-4 h-4"} text-yellow-500`} />
            ) : (
              <IconStar key={i} className={`${isHero ? "w-5 h-5" : "w-4 h-4"} text-muted`} />
            ),
          )}
        </div>

        <div className="flex-1">
          {shouldClamp && !isExpanded ? (
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {testimonial.comment}
              </p>
              <button
                onClick={() => setIsExpanded(true)}
                className="text-xs text-primary/80 hover:text-primary mt-2 transition-colors"
                data-testid={`button-read-more-${index}`}
              >
                Read more
              </button>
            </div>
          ) : (
            <p className={`text-muted-foreground leading-relaxed ${isHero ? "text-base" : "text-sm"}`}>
              {testimonial.comment}
            </p>
          )}
        </div>

        {testimonial.outcome && (
          <div className="pt-3 border-t mt-4">
            <Badge variant="secondary" className="text-xs">
              {testimonial.outcome}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
