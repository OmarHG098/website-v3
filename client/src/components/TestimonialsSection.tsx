import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconStarFilled, IconStar } from "@tabler/icons-react";
import { memo } from "react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  course: string;
  rating: number;
  comment: string;
  avatar?: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const avatarColors = [
  "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
];

const TestimonialCard = memo(
  ({ testimonial, index }: { testimonial: Testimonial; index: number }) => (
    <Card
      key={testimonial.id}
      data-testid={`card-testimonial-${testimonial.id}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            {testimonial.avatar && (
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            )}
            <AvatarFallback className={avatarColors[index % avatarColors.length]}>
              {testimonial.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{testimonial.name}</p>
            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
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

        <p className="text-sm text-muted-foreground mb-3">
          {testimonial.comment}
        </p>

        <p className="text-xs text-muted-foreground border-t pt-3">
          Course: {testimonial.course}
        </p>
      </CardContent>
    </Card>
  ),
);

TestimonialCard.displayName = "TestimonialCard";

function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-4 flex items-center justify-center gap-2">
        <IconStarFilled className="w-7 h-7 text-yellow-500" /> 4.5 Outstanding /
        1294 Comments
      </h2>
      <p className="text-center text-muted-foreground mb-12">
        See what our students have to say about their experience
      </p>

      {/* Mobile: Show only first 3 */}
      <div className="grid grid-cols-1 gap-3 max-w-[77rem] mx-auto md:hidden">
        {testimonials.slice(0, 3).map((testimonial, index) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
        ))}
      </div>

      {/* Tablet and Desktop: Show all */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[77rem] mx-auto">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
        ))}
      </div>
    </section>
  );
}

export default memo(TestimonialsSection);
