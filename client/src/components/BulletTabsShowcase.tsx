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
          <div key={index} className="flex items-stretch gap-1">
            <div className="py-1 flex-shrink-0">
              <div 
                className={`w-1 h-full rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-primary"
                    : "bg-muted-foreground/20"
                }`}
              />
            </div>
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
    <div className="relative flex justify-center">
      <div
        className="relative bg-primary/10 rounded-2xl pt-12 pb-12 pl-12 flex justify-end"
        data-testid="bullet-tabs-image-container"
      >
        <div key={activeIndex} className="animate-in fade-in duration-300 w-[95%]">
          <UniversalImage
            id={activeTab.image_id}
            preset="full"
            className="w-full h-auto rounded-l-lg shadow-lg"
            alt={activeTab.label}
          />
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 md:py-24" data-testid="section-bullet-tabs-showcase">
      <div className="max-w-6xl mx-auto px-4">
        <div className={`grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 lg:gap-12 items-center ${
          image_position === "left" ? "lg:grid-cols-[3fr_2fr]" : ""
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
