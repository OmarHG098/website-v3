import { Button } from "@/components/ui/button";

interface ImageTextSectionProps {
  title: string;
  description: string;
  image: string;
  imagePosition?: "left" | "right";
  ctaText?: string;
  onCtaClick?: () => void;
}

export default function ImageTextSection({ 
  title, 
  description, 
  image, 
  imagePosition = "left",
  ctaText,
  onCtaClick
}: ImageTextSectionProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className={`grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto ${imagePosition === "right" ? "md:grid-flow-dense" : ""}`}>
        <div className={imagePosition === "right" ? "md:col-start-2" : ""}>
          <img 
            src={image} 
            alt={title}
            className="rounded-lg w-full h-auto object-cover"
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
          {ctaText && (
            <Button 
              size="lg" 
              onClick={onCtaClick}
              data-testid="button-section-cta"
            >
              {ctaText}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
