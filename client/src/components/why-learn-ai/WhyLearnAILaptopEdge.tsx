import { Button } from "@/components/ui/button";
import type { WhyLearnAISection as WhyLearnAISectionType } from "@shared/schema";
import laptopCodeEditor from "@assets/243f0f155c3d1683ecfaa1020801b365ad23092d_1769656566581.png";

interface WhyLearnAILaptopEdgeProps {
  data: WhyLearnAISectionType;
}

export function WhyLearnAILaptopEdge({ data }: WhyLearnAILaptopEdgeProps) {
  return (
    <section 
      className="relative overflow-hidden"
      data-testid="section-why-learn-ai"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-16">
          <div>
            <h2 
              className="text-h2 mb-4 text-foreground"
              data-testid="text-why-learn-title"
            >
              {data.title}
            </h2>
            
            <h3 
              className="text-body font-bold mb-6 text-foreground"
              data-testid="text-why-learn-subtitle"
            >
              {data.subtitle}
            </h3>
            
            <p 
              className="text-body text-muted-foreground mb-8 leading-relaxed"
              data-testid="text-why-learn-description"
            >
              {data.description}
            </p>
            
            {data.cta && (
              <Button
                variant={data.cta.variant === "primary" ? "default" : data.cta.variant === "outline" ? "outline" : "secondary"}
                asChild
                data-testid="button-why-learn-cta"
              >
                <a href={data.cta.url}>{data.cta.text}</a>
              </Button>
            )}
          </div>
          
          <div className="relative flex justify-end items-center min-h-[300px] lg:min-h-[400px]">
            <div 
              className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[120%] bg-primary/5 rounded-l-3xl"
              aria-hidden="true"
            />
            <img 
              src={laptopCodeEditor}
              alt="Code editor on laptop"
              className="relative z-10 w-full max-w-[600px] lg:max-w-none lg:w-[120%] lg:-mr-[20%] h-auto object-contain"
              loading="lazy"
              data-testid="img-why-learn-ai"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
