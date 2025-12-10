import type { z } from "zod";
import type { ctaBannerSectionSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "wouter";

type CTABannerSectionData = z.infer<typeof ctaBannerSectionSchema>;

interface CTABannerSectionProps {
  data: CTABannerSectionData;
}

export function CTABannerSection({ data }: CTABannerSectionProps) {
  return (
    <section 
      className="py-16 px-4 bg-primary text-primary-foreground"
      data-testid="section-cta-banner"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-4"
          data-testid="text-cta-banner-title"
        >
          {data.title}
        </h2>
        {data.subtitle && (
          <p 
            className="text-lg opacity-90 mb-8 max-w-2xl mx-auto"
            data-testid="text-cta-banner-subtitle"
          >
            {data.subtitle}
          </p>
        )}
        <Link href={data.cta_url}>
          <Button 
            size="lg" 
            variant="secondary"
            className="font-semibold"
            data-testid="button-cta-banner-action"
          >
            {data.cta_text}
            <IconArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
