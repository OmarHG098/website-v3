import type { Section } from "@shared/schema";
import { IconFeatureGridSection } from "./IconFeatureGridSection";

interface HomeSectionRendererProps {
  sections: Section[];
}

export function HomeSectionRenderer({ sections }: HomeSectionRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section.type) {
          case "icon_feature_grid":
            return <IconFeatureGridSection key={index} data={section} />;
          default: {
            if (process.env.NODE_ENV === "development") {
              console.warn(`Unknown home section type: ${(section as { type: string }).type}`);
            }
            return null;
          }
        }
      })}
    </>
  );
}
