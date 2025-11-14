import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconStarFilled, IconStar } from "@tabler/icons-react";

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

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-4">
        4.5 Outstanding / 1294 Comments
      </h2>
      <p className="text-center text-muted-foreground mb-12">
        See what our students have to say about their experience
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} data-testid={`card-testimonial-${testimonial.id}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  {testimonial.avatar && <AvatarImage src={testimonial.avatar} alt={testimonial.name} />}
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  i < testimonial.rating ? (
                    <IconStarFilled 
                      key={i} 
                      className="w-4 h-4 text-yellow-500"
                    />
                  ) : (
                    <IconStar 
                      key={i} 
                      className="w-4 h-4 text-muted"
                    />
                  )
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{testimonial.comment}</p>
              
              <p className="text-xs text-muted-foreground border-t pt-3">
                Course: {testimonial.course}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
