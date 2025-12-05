import { Card } from "@/components/ui/card";
import { IconSchool, IconFlag } from "@tabler/icons-react";
import Marquee from "react-fast-marquee";

export interface TestimonialsSlideTestimonial {
  name: string;
  img: string;
  status?: string;
  country: {
    name: string;
    iso: string;
  };
  contributor: string;
  description: string;
  achievement?: string;
}

export interface TestimonialsSlideData {
  title: string;
  description: string;
  testimonials: TestimonialsSlideTestimonial[];
  background?: string;
}

interface TestimonialsSlideProps {
  data: TestimonialsSlideData;
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialsSlideTestimonial }) {
  return (
    <Card 
      className="w-[300px] h-[490px] -mx-7 md:mx-2 flex-shrink-0 overflow-visible flex flex-col scale-[0.75] md:scale-100 origin-center"
      data-testid={`card-testimonial-${testimonial.name.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="h-[170px] w-full overflow-hidden flex-shrink-0">
        <img 
          src={testimonial.img} 
          alt={testimonial.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-1 gap-2">
          <h4 className="font-bold text-foreground text-lg leading-tight">{testimonial.name}</h4>
          {testimonial.status === "Graduated" && (
            <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
              <IconSchool className="w-5 h-5" />
              <span className="text-base">Graduated</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 mb-1">
          <span 
            className={`flag flag-xs flag-country-${testimonial.country.iso.toLowerCase()}`}
            style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }}
          />
          <span className="text-base text-foreground">{testimonial.country.name}</span>
        </div>
        
        <p className="text-base text-muted-foreground mb-2">
          Contributor: {testimonial.contributor}
        </p>
        
        <div className="border-t border-border mb-2" />
        
        <p className="text-base text-foreground flex-1 overflow-hidden line-clamp-5 mb-2">
          {testimonial.description}
        </p>
        
        {testimonial.achievement ? (
          <div className="bg-amber-100 dark:bg-amber-900/30 rounded-md p-2 flex items-start gap-1.5 mt-auto flex-shrink-0">
            <IconFlag className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
              {testimonial.achievement}
            </p>
          </div>
        ) : (
          <div className="h-10 mt-auto flex-shrink-0" />
        )}
      </div>
    </Card>
  );
}

export default function TestimonialsSlide({ data }: TestimonialsSlideProps) {
  return (
    <section 
      className={`py-12 md:py-16 ${data.background || "bg-sidebar"}`}
      data-testid="section-testimonials-slide"
    >
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <h2 
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-foreground mb-4"
          data-testid="text-testimonials-slide-title"
        >
          {data.title}
        </h2>
        <p 
          className="text-center text-lg text-muted-foreground max-w-3xl mx-auto"
          data-testid="text-testimonials-slide-description"
        >
          {data.description}
        </p>
      </div>
      
      <Marquee 
        gradient={false} 
        speed={40} 
        pauseOnHover={true}
        data-testid="marquee-testimonials-slide"
      >
        {data.testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </Marquee>
    </section>
  );
}
