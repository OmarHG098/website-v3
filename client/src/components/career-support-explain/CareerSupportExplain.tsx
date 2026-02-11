import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { UniversalImage } from "@/components/UniversalImage";
import type { CareerSupportExplainSection, CareerSupportTab } from "@shared/schema";
import * as TablerIcons from "@tabler/icons-react";

interface CareerSupportExplainProps {
  data: CareerSupportExplainSection;
}

function getTablerIcon(name: string) {
  const icons = TablerIcons as Record<string, any>;
  return icons[name] || TablerIcons.IconCircle;
}

function TabContent({ tab }: { tab: CareerSupportTab }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[400px]" data-testid="grid-tab-content">
      <div className="lg:col-span-4 bg-card p-6 flex flex-col rounded-l-[0.8rem]" data-testid="col-1-info">
        {tab.col1_subtitle && (
          <h3 className="text-xl font-bold text-foreground mb-3" data-testid="text-col1-subtitle">
            {tab.col1_subtitle}
          </h3>
        )}
        {tab.col1_description && (
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line" data-testid="text-col1-description">
            {tab.col1_description}
          </p>
        )}

        {tab.col1_boxes && tab.col1_boxes.length > 0 && (
          <div className="mt-auto pt-4">
            <p className="text-sm font-semibold text-foreground mb-2">We'll help you create tailored job search materials</p>
            <div className="flex flex-wrap gap-2" data-testid="boxes-col1">
              {tab.col1_boxes.map((box, i) => {
                const IconComp = box.icon ? getTablerIcon(box.icon) : null;
                return (
                  <Card key={i} className="flex items-center gap-1.5 px-3 py-1.5 text-sm" data-testid={`box-item-${i}`}>
                    {IconComp && <IconComp className="w-4 h-4 text-muted-foreground" />}
                    <span className="text-foreground">{box.text}</span>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-4 bg-primary p-6 flex flex-col" data-testid="col-2-bullets">
        {tab.col2_heading && (
          <p className="text-lg font-semibold text-primary-foreground mb-6 leading-snug" data-testid="text-col2-heading">
            {tab.col2_heading}
          </p>
        )}

        {tab.col2_bullets && tab.col2_bullets.length > 0 && (
          <div className="flex flex-col gap-4" data-testid="bullets-col2">
            {tab.col2_bullets.map((bullet, i) => {
              const IconComp = bullet.icon ? getTablerIcon(bullet.icon) : null;
              return (
                <div key={i} className="flex items-start gap-3" data-testid={`bullet-item-${i}`}>
                  {IconComp && (
                    <Card className="flex-shrink-0 p-1.5">
                      <IconComp className="w-4 h-4 text-primary" />
                    </Card>
                  )}
                  <span className="text-sm text-primary-foreground">{bullet.text}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="lg:col-span-4 relative overflow-hidden rounded-r-[0.8rem] min-h-[300px]" data-testid="col-3-image">
        {tab.col3_image_id && (
          <UniversalImage
            id={tab.col3_image_id}
            className="w-full h-full absolute inset-0"
            style={{
              objectFit: (tab.col3_object_fit as React.CSSProperties["objectFit"]) || "cover",
              objectPosition: tab.col3_object_position || "center",
            }}
            data-testid="img-tab-content"
          />
        )}
      </div>
    </div>
  );
}

export function CareerSupportExplain({ data }: CareerSupportExplainProps) {
  const { tabs, heading, description } = data;
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section
      className="w-full"
      style={data.background ? { background: data.background } : undefined}
      data-testid="section-career-support-explain"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {(heading || description) && (
          <div className="text-center mb-10">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3" data-testid="text-career-heading">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-career-description">
                {description}
              </p>
            )}
          </div>
        )}

        {tabs.length > 1 && (
          <div className="flex items-center justify-center mb-8" data-testid="tabs-selector">
            <div className="inline-flex border border-border rounded-full p-1 gap-1">
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                    i === activeTab
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover-elevate",
                  )}
                  data-testid={`button-tab-${i}`}
                >
                  {tab.tab_label}
                </button>
              ))}
            </div>
          </div>
        )}

        <TabContent tab={tabs[activeTab]} />
      </div>
    </section>
  );
}

export default CareerSupportExplain;
