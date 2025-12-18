import { useState } from "react";
import { UniversalImage } from "@/components/UniversalImage";
import { Button } from "@/components/ui/button";
import type { BulletTabsShowcaseSection } from "@shared/schema";

interface BulletTabsShowcaseProps {
  data: BulletTabsShowcaseSection;
}

export function BulletTabsShowcase({ data }: BulletTabsShowcaseProps) {
  const { heading, subheading, tabs, image_position = "right" } = data;
  const [activeIndex, setActiveIndex] = useState(0);

  if (!tabs || tabs.length === 0) {
    return null;
  }

  const activeTab = tabs[activeIndex];

  const textContent = (
    <div className="flex flex-col justify-center">
      {heading && (
        <h2 
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight"
          data-testid="text-bullet-tabs-heading"
        >
          {heading}
        </h2>
      )}
      {subheading && (
        <p 
          className="text-muted-foreground mb-8 text-base md:text-lg"
          data-testid="text-bullet-tabs-subheading"
        >
          {subheading}
        </p>
      )}

      <div className="space-y-1">
        {tabs.map((tab, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className={`w-1 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
                activeIndex === index
                  ? "bg-primary"
                  : "bg-muted-foreground/20"
              }`}
            />
            <Button
              variant="ghost"
              onClick={() => setActiveIndex(index)}
              className={`flex-1 justify-start text-left whitespace-normal py-2 transition-opacity duration-300 ${
                activeIndex === index ? "opacity-100" : "opacity-40"
              }`}
              data-testid={`button-bullet-tab-${index}`}
            >
              <p 
                className="text-base text-foreground font-normal"
                data-testid={`text-bullet-tab-description-${index}`}
              >
                {tab.description || tab.label}
              </p>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  const imageContent = (
    <div className="relative flex items-center justify-center">
      <div
        className="relative w-full max-w-[600px] rounded-lg overflow-hidden bg-card border"
        data-testid="bullet-tabs-image-container"
      >
        <div key={activeIndex} className="animate-in fade-in duration-300">
          <UniversalImage
            id={activeTab.image_id}
            preset="full"
            className="w-full h-auto"
            alt={activeTab.label}
          />
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 md:py-24" data-testid="section-bullet-tabs-showcase">
      <div className="max-w-6xl mx-auto px-4">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
          image_position === "left" ? "lg:grid-flow-dense" : ""
        }`}>
          {image_position === "left" ? (
            <>
              <div className="lg:col-start-1">{imageContent}</div>
              <div className="lg:col-start-2">{textContent}</div>
            </>
          ) : (
            <>
              <div>{textContent}</div>
              <div>{imageContent}</div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default BulletTabsShowcase;
