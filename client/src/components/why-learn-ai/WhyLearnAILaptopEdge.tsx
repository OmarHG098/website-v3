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
      <div>
        <div 
          className="absolute right-0 top-0 bottom-0 w-[20%] bg-primary/10"
          aria-hidden="true"
        />
        <div 
          className="absolute left-0 top-0 bottom-0 w-[80%] bg-muted"
          aria-hidden="true"
        />
      </div>
      

        <div className="relative max-w-6xl mx-auto px-4 py-4">
          <div className="grid lg:grid-cols-9 gap-8 items-center py-16">
            <div className="col-span-7">
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
          </div>
      </div>

      <div className="absolute right-[-250px] top-0 bottom-0 w-1/2 flex items-center pointer-events-none">
        <img 
          src={laptopCodeEditor}
          alt="Code editor on laptop"
          className="w-[100%] max-w-none h-auto object-contain object-left"
          loading="lazy"
          data-testid="img-why-learn-ai"
        />
      </div>
    </section>
  );
}
