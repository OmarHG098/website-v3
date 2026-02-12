import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UniversalImage } from "@/components/UniversalImage";
import type {
  CareerSupportExplainSection,
  CareerSupportTab,
  CareerSupportTestimonial,
} from "@shared/schema";
import * as TablerIcons from "@tabler/icons-react";
import { IconChevronLeft, IconChevronRight, IconFlag } from "@tabler/icons-react";

interface CareerSupportExplainProps {
  data: CareerSupportExplainSection;
}

function getTablerIcon(name: string) {
  const icons = TablerIcons as Record<string, any>;
  return icons[name] || TablerIcons.IconCircle;
}

function ThreeColumnsLayout({ tab }: { tab: CareerSupportTab }) {
  return (
    <div className="flex gap-4 h-full" data-testid="grid-tab-content">
      <Card
        className="bg-card p-6 flex flex-col rounded-lg flex-1"
        data-testid="col-1-info"
      >
        {tab.col1_subtitle && (
          <h3
            className="text-2xl font-bold text-foreground mb-3"
            data-testid="text-col1-subtitle"
          >
            {tab.col1_subtitle}
          </h3>
        )}
        {tab.col1_description && (
          <p
            className="text-sm lg:text-base text-muted-foreground leading-snug whitespace-pre-line"
            data-testid="text-col1-description"
          >
            {tab.col1_description}
          </p>
        )}

        {tab.col1_boxes && tab.col1_boxes.length > 0 && (
          <div className="mt-auto pt-4">
            <p className="font-semibold text-primary mb-2">
              We'll help you create tailored job search materials
            </p>
            <div className="flex flex-wrap gap-2" data-testid="boxes-col1">
              {tab.col1_boxes.map((box, i) => {
                const IconComp = box.icon ? getTablerIcon(box.icon) : null;
                return (
                  <Card
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm"
                    data-testid={`box-item-${i}`}
                  >
                    {IconComp && <IconComp className="w-4 h-4 text-primary" />}
                    <span className="text-foreground">{box.text}</span>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      <Card
        className="bg-primary/5 p-6 flex-1 flex-col text-muted-foreground rounded-lg"
        data-testid="col-2-bullets"
      >
        {tab.col2_heading && (
          <p
            className="text-2xl font-semibold text-primary mb-6 leading-snug text-foreground"
            data-testid="text-col2-heading"
          >
            {tab.col2_heading}
          </p>
        )}

        {tab.col2_bullets && tab.col2_bullets.length > 0 && (
          <div className="flex flex-col gap-4 " data-testid="bullets-col2">
            {tab.col2_bullets.map((bullet, i) => {
              const IconComp = bullet.icon ? getTablerIcon(bullet.icon) : null;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3"
                  data-testid={`bullet-item-${i}`}
                >
                  {IconComp && (
                    <Card className="flex-shrink-0 p-1.5 !rounded-lg">
                      <IconComp className="w-4 h-4 text-primary" />
                    </Card>
                  )}
                  <span className="text-base">{bullet.text}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div
        className="relative overflow-hidden rounded-lg flex-[1.55]"
        data-testid="col-3-image"
      >
        {tab.col3_image_id && (
          <UniversalImage
            id={tab.col3_image_id}
            className="w-full h-full absolute inset-0"
            style={{
              objectFit:
                (tab.col3_object_fit as React.CSSProperties["objectFit"]) ||
                "cover",
              objectPosition: tab.col3_object_position || "center",
            }}
            data-testid="img-tab-content"
          />
        )}
      </div>
    </div>
  );
}

function TwoColumnCardsLayout({ tab }: { tab: CareerSupportTab }) {
  return (
    <div
      className="flex gap-4 h-full items-center"
      data-testid="grid-two-column-cards"
    >
      <Card
        className="flex flex-col flex-[2.5] p-6 overflow-hidden h-full"
        data-testid="card-left"
      >
        {tab.title && (
          <h3
            className="text-4xl me-[200px] font-bold text-foreground "
            data-testid="text-tab-title"
          >
            {tab.title}
          </h3>
        )}
        <div className="flex items-end text-muted-foreground h-full">
          <p>Once your profile is ready, visibility becomes the focus.</p>
        </div>
        <div className="flex items-end flex-1" style={{ marginTop: "0px" }}>
          <div className="flex gap-3 flex-1 ">
            <div className="flex flex-col flex-1 leading-snug">
              {tab.left_text && (
                <p
                  className="text-base text-muted-foreground whitespace-pre-line"
                  data-testid="text-left-content"
                >
                  {tab.left_text}
                </p>
              )}

              {tab.left_stat && (
                <div className="flex items-end h-full">
                  <div className="mt-auto pt-4" data-testid="stat-left">
                    <span className="text-5xl font-bold text-primary">
                      {tab.left_stat.value}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tab.left_stat.label}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {tab.left_image_id && (
              <div
                className="relative rounded-lg flex-[1.2]"
                data-testid="img-left-container"
              >
                <UniversalImage
                  id={tab.left_image_id}
                  className="w-full h-auto rounded-lg mt-2"
                  style={{
                    objectFit:
                      (tab.left_image_object_fit as React.CSSProperties["objectFit"]) ||
                      "cover",
                    objectPosition: tab.left_image_object_position || "center",
                  }}
                  data-testid="img-left-content"
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card
        className="flex flex-col flex-1 p-6 bg-primary/5 h-full"
        data-testid="card-right"
      >
        {tab.right_bullets && tab.right_bullets.length > 0 && (
          <div className="flex flex-col gap-4 mb-6" data-testid="bullets-right">
            {tab.right_bullets.map((bullet, i) => {
              const IconComp = bullet.icon ? getTablerIcon(bullet.icon) : null;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3"
                  data-testid={`right-bullet-${i}`}
                >
                  {IconComp && (
                    <Card className="flex-shrink-0 p-1.5">
                      <IconComp className="w-4 h-4 text-primary" />
                    </Card>
                  )}
                  <span className="text- text-muted-foreground">
                    {bullet.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {tab.right_logos && tab.right_logos.length > 0 && (
          <div className="mt-auto" data-testid="logos-right">
            <div className="flex flex-wrap items-center gap-1 justify-center">
              {tab.right_logos.map((logo, i) => (
                <Card
                  key={i}
                  className="flex items-center border border-muted-foreground/10 shadow-none bg-opacity-0 rounded-lg p-1"
                  style={{ height: logo.logo_height || "40px" }}
                  data-testid={`logo-right-${i}`}
                >
                  <UniversalImage
                    id={logo.image_id}
                    alt={logo.alt || ""}
                    className="h-full w-auto object-contain"
                  />
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function TextAndImageLayout({ tab }: { tab: CareerSupportTab }) {
  return (
    <div className="flex gap-8 h-full" data-testid="grid-text-and-image">
      <div
        className="flex flex-col justify-start flex-1"
        data-testid="col-text-content"
      >
        {tab.title && (
          <h3
            className="text-3xl font-bold text-foreground mb-4"
            data-testid="text-tab-title"
          >
            {tab.title}
          </h3>
        )}
        {tab.left_description && (
          <p
            className="text-muted-foreground leading-relaxed whitespace-pre-line mb-6"
            data-testid="text-left-description"
          >
            {tab.left_description}
          </p>
        )}
        {tab.left_bullets && tab.left_bullets.length > 0 && (
          <div className="flex flex-col gap-3" data-testid="bullets-left">
            {tab.left_bullets.map((bullet, i) => {
              const IconComp = bullet.icon ? getTablerIcon(bullet.icon) : null;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3"
                  data-testid={`left-bullet-${i}`}
                >
                  {IconComp && (
                    <Card className="flex-shrink-0 p-1.5">
                      <IconComp className="w-4 h-4 text-primary" />
                    </Card>
                  )}
                  <span className="text-foreground">{bullet.text}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div
        className="flex-[1.1] rounded-l-2xl border-l border-t border-b border-border flex items-center justify-center py-16 ps-16"
        style={{
          background:
            tab.right_panel_background ?? "hsl(var(--primary) / 0.15)",
        }}
        data-testid="panel-right-image"
      >
        {tab.right_image_id && (
          <UniversalImage
            id={tab.right_image_id}
            className="w-full h-full rounded-lg shadow-lg"
            style={{
              objectFit:
                (tab.right_image_object_fit as React.CSSProperties["objectFit"]) ??
                "cover",
              objectPosition: tab.right_image_object_position ?? "center",
            }}
            data-testid="img-right-content"
          />
        )}
      </div>
    </div>
  );
}

function TestimonialSlide({
  testimonial,
}: {
  testimonial: CareerSupportTestimonial;
}) {
  return (
    <div className="flex gap-4 h-full min-w-0" data-testid="testimonial-slide">
      <div
        className="flex-1 rounded-lg overflow-hidden"
        data-testid="testimonial-image-col"
      >
        {testimonial.image_id && (
          <UniversalImage
            id={testimonial.image_id}
            className="w-full h-full"
            style={{
              objectFit:
                (testimonial.image_object_fit as React.CSSProperties["objectFit"]) ??
                "cover",
              objectPosition: testimonial.image_object_position ?? "center",
              minHeight: "320px",
            }}
            data-testid="testimonial-image"
          />
        )}
      </div>

      <div
        className="flex-1 flex flex-col gap-4 p-5 bg-primary/5 rounded-lg"
        data-testid="testimonial-info-col"
      >
        {testimonial.contributor_logos &&
          testimonial.contributor_logos.length > 0 && (
            <div
              className="flex items-center gap-3"
              data-testid="testimonial-logos"
            >
              {testimonial.contributor_logos.map((logo, i) => (
                <Card className="p-1 bg-transparent shadow-none border-muted-foreground/10">
                  <UniversalImage
                    key={i}
                    id={logo.image_id}
                    className="h-12 w-auto object-contain"
                    data-testid={`testimonial-logo-${i}`}
                  />
                </Card>
              ))}
            </div>
          )}

        {testimonial.description && (
          <p
            className="text-muted-foreground leading-relaxed"
            data-testid="testimonial-description"
          >
            {testimonial.description}
          </p>
        )}

        {testimonial.achievement && (
          <Card className="p-4 mt-auto" data-testid="testimonial-achievement">
            <IconFlag className="w-4 h-4 text-primary mb-1" />

            <span className="font-medium text-foreground flex inline-flex items-end">
              {testimonial.achievement}

            </span>

          </Card>
        )}
      </div>
    </div>
  );
}

function TextWithTestimonialsCarouselLayout({
  tab,
}: {
  tab: CareerSupportTab;
}) {
  const testimonials = tab.testimonials ?? [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = testimonials.length;

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  return (
    <div
      className="flex gap-8 h-full"
      data-testid="grid-text-with-testimonials"
    >
      <div className="flex-[1.2] min-w-0" data-testid="col-left-text">
        {tab.title && (
          <h3
            className="text-3xl font-bold text-foreground mb-4"
            data-testid="text-testimonials-title"
          >
            {tab.title}
          </h3>
        )}
        {tab.left_description && (
          <p
            className="text-muted-foreground leading-relaxed whitespace-pre-line mb-6"
            data-testid="text-testimonials-description"
          >
            {tab.left_description}
          </p>
        )}
        {tab.left_bullets && tab.left_bullets.length > 0 && (
          <div
            className="flex flex-col gap-3"
            data-testid="bullets-testimonials"
          >
            {tab.left_bullets.map((bullet, i) => {
              const IconComp = bullet.icon ? getTablerIcon(bullet.icon) : null;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3"
                  data-testid={`testimonial-bullet-${i}`}
                >
                  {IconComp && (
                    <Card className="flex-shrink-0 p-1.5">
                      <IconComp className="w-4 h-4 text-primary" />
                    </Card>
                  )}
                  <span className="text-foreground">{bullet.text}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div
        className="flex-[2] flex flex-col gap-3 min-w-0"
        data-testid="col-testimonials-carousel"
      >
        {totalSlides > 0 && (
          <>
            <div className="relative overflow-hidden rounded-lg flex-1">
              <div
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, i) => (
                  <div key={i} className="w-full flex-shrink-0 h-full">
                    <TestimonialSlide testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>

            {totalSlides > 1 && (
              <div
                className="flex items-center justify-between"
                data-testid="carousel-controls"
              >
                <Button
                  size="icon"
                  variant="outline"
                  onClick={goPrev}
                  data-testid="button-carousel-prev"
                >
                  <IconChevronLeft className="w-4 h-4" />
                </Button>

                <div
                  className="flex items-center gap-2"
                  data-testid="carousel-dots"
                >
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentSlide(i)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        i === currentSlide
                          ? "bg-primary"
                          : "bg-muted-foreground/40",
                      )}
                      data-testid={`carousel-dot-${i}`}
                    />
                  ))}
                </div>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={goNext}
                  data-testid="button-carousel-next"
                >
                  <IconChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyLayout() {
  return (
    <div
      className="flex items-center justify-center h-full rounded-[0.8rem] border border-dashed border-border"
      data-testid="tab-empty"
    >
      <p className="text-muted-foreground text-sm">Content coming soon</p>
    </div>
  );
}

function TabContent({ tab }: { tab: CareerSupportTab }) {
  switch (tab.layout) {
    case "three_columns":
      return <ThreeColumnsLayout tab={tab} />;
    case "two_column_cards":
      return <TwoColumnCardsLayout tab={tab} />;
    case "text_and_image":
      return <TextAndImageLayout tab={tab} />;
    case "text_with_testimonials_carousel":
      return <TextWithTestimonialsCarouselLayout tab={tab} />;
    default:
      return <EmptyLayout />;
  }
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
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {(heading || description) && (
          <div className="text-center mb-10">
            {heading && (
              <h2
                className="text-3xl md:text-4xl font-bold text-foreground mb-3"
                data-testid="text-career-heading"
              >
                {heading}
              </h2>
            )}
            {description && (
              <p
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                data-testid="text-career-description"
              >
                {description}
              </p>
            )}
          </div>
        )}

        {tabs.length > 1 && (
          <div
            className="flex items-center justify-center mb-8 w-full"
            data-testid="tabs-selector"
          >
            <div className="grid grid-cols-4 gap-3 border border-border bg-background rounded-lg w-full p-1">
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "py-1 rounded-lg text-sm font-medium transition-colors duration-200 col-span-1 w-full",
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

        <div className="h-[480px] mx-12">
          <TabContent tab={tabs[activeTab]} />
        </div>
      </div>
    </section>
  );
}

export default CareerSupportExplain;
