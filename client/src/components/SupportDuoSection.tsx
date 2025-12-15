import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as TablerIcons from "@tabler/icons-react";
import type { ComponentType } from "react";
import rigobotLogo from "@assets/rigobot-logo_1764707022198.webp";

interface BulletGroup {
  title: string;
  description?: string;
  image?: string;
  icon?: string;
  bullets?: { text: string; icon?: string }[];
  button?: {
    text: string;
    url: string;
    variant?: "primary" | "secondary" | "outline";
  };
}

interface SupportDuoData {
  type: "support_duo";
  version?: string;
  variant?: "default" | "grid";
  heading: string;
  description: string;
  bullet_groups: BulletGroup[];
  footer_description?: string;
  image?: string;
  image_alt?: string;
  background?: string;
}

interface SupportDuoSectionProps {
  data: SupportDuoData;
}

const getIcon = (iconName: string, className?: string, size?: number) => {
  const icons = TablerIcons as unknown as Record<string, ComponentType<{ className?: string; size?: number }>>;
  const IconComponent = icons[`Icon${iconName}`];
  return IconComponent ? <IconComponent className={className} size={size || 20} /> : null;
};

// Human + AI Support Duo Section - Displays mentorship and Rigobot benefits
// Supports two variants: "default" (stacked with image) and "grid" (side-by-side cards)
export function SupportDuoSection({ data }: SupportDuoSectionProps) {
  const backgroundClass = data.background || "bg-background";
  const isGrid = data.variant === "grid";
  const [expandedGroups, setExpandedGroups] = useState<Record<string | number, boolean>>({});

  const toggleGroup = (index: number) => {
    setExpandedGroups(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section 
      className={`py-14 ${backgroundClass}`}
      data-testid="section-support-duo"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Grid variant header with image on right of title/description */}
        {isGrid && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center mb-10">
            <div className="col-span-1 md:col-span-9 text-center md:text-start order-2 md:order-1">
              <h2 
                className="text-3xl md:text-4xl font-bold text-foreground mb-4"
                data-testid="text-support-duo-heading"
              >
                {data.heading}
              </h2>
              <p 
                className="text-lg text-muted-foreground leading-relaxed"
                data-testid="text-support-duo-description"
              >
                {data.description}
              </p>
            </div>
            {data.image && (
              <div className="col-span-1 md:col-span-3 order-1 md:order-2">
                <div className="flex justify-center">
                  <img 
                    src={data.image} 
                    alt={data.image_alt || "Section image"}
                    className="rounded-md h-auto max-w-[150px] md:max-w-full"
                    loading="lazy"
                    data-testid="img-support-duo-grid"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {isGrid ? (
          <div className="space-y-10">
            {/* Bullet groups displayed side by side without cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-testid="list-support-duo-groups">
              {data.bullet_groups.map((group, groupIndex) => {
                const isDescExpanded = expandedGroups[`desc-${groupIndex}`] ?? false;
                return (
                  <div key={groupIndex} className="space-y-3">
                    <div className="flex items-center gap-3">
                      {group.icon ? (
                        <span className="text-primary flex-shrink-0">
                          {getIcon(group.icon, "w-7 h-7")}
                        </span>
                      ) : group.image ? (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                          <img 
                            src={group.image} 
                            alt="Group icon" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : null}
                      <h4 className="font-bold text-foreground uppercase tracking-wide text-sm">
                        {group.title}
                      </h4>
                    </div>
                    {group.description && (
                      <>
                        {/* Mobile: Collapsible description */}
                        <div className="md:hidden">
                          <button
                            onClick={() => setExpandedGroups(prev => ({ ...prev, [`desc-${groupIndex}`]: !prev[`desc-${groupIndex}`] }))}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                            data-testid={`button-toggle-description-${groupIndex}`}
                          >
                            <span className="flex-shrink-0">
                              {getIcon(isDescExpanded ? "ChevronUp" : "ChevronDown", "", 16)}
                            </span>
                            <span className="text-sm">{isDescExpanded ? "Hide details" : "Show details"}</span>
                          </button>
                          {isDescExpanded && (
                            <p className="text-muted-foreground text-base leading-relaxed mt-2">
                              {group.description}
                            </p>
                          )}
                        </div>
                        {/* Tablet/Desktop: Static description */}
                        <p className="hidden md:block text-muted-foreground text-base leading-relaxed">
                          {group.description}
                        </p>
                      </>
                    )}
                    {group.bullets && group.bullets.length > 0 && (
                      <ul className="space-y-2 mt-2">
                        {group.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="flex items-start gap-3">
                            {bullet.icon ? (
                              <span className="text-primary mt-0.5 flex-shrink-0">
                                {getIcon(bullet.icon)}
                              </span>
                            ) : (
                              <span className="text-foreground mt-1 flex-shrink-0">•</span>
                            )}
                            <span className="text-foreground text-base">{bullet.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {group.button && (
                      <div className="mt-4">
                        {/* Mobile: Text link with arrow */}
                        <a 
                          href={group.button.url}
                          className="md:hidden text-primary hover:underline inline-flex items-center gap-1 font-medium"
                          data-testid={`link-bullet-group-${groupIndex}`}
                        >
                          {group.button.text}
                          {getIcon("ArrowRight", "", 16)}
                        </a>
                        {/* Tablet/Desktop: Button */}
                        <Button
                          variant={group.button.variant === "primary" ? "default" : group.button.variant || "default"}
                          asChild
                          className="hidden md:inline-flex"
                          data-testid={`button-bullet-group-${groupIndex}`}
                        >
                          <a href={group.button.url}>{group.button.text}</a>
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {/* ===== MOBILE LAYOUT (base, hidden at md+) ===== */}
            <div className="md:hidden space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-support-duo-heading">
                  {data.heading}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {data.description}
                </p>
              </div>
              {data.image && (
                <div className="flex justify-center">
                  <img 
                    src={data.image} 
                    alt={data.image_alt || "Section image"}
                    className="rounded-md max-w-[200px] h-auto"
                    loading="lazy"
                    data-testid="img-support-duo-mobile"
                  />
                </div>
              )}
              <div className="space-y-4" data-testid="list-support-duo-groups-mobile">
                {data.bullet_groups.map((group, groupIndex) => {
                  const isExpanded = expandedGroups[groupIndex] ?? false;
                  return (
                    <div key={groupIndex}>
                      <button
                        onClick={() => toggleGroup(groupIndex)}
                        className="w-full flex items-center justify-between gap-3 p-3 rounded-md hover-elevate"
                        data-testid={`button-toggle-group-${groupIndex}`}
                      >
                        <div className="flex items-center gap-3">
                          {group.icon ? (
                            <span className="text-primary flex-shrink-0">{getIcon(group.icon, "w-8 h-8")}</span>
                          ) : (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                              <img src={group.image || rigobotLogo} alt="Support icon" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <h4 className="font-bold text-foreground uppercase tracking-wide text-sm text-left">{group.title}</h4>
                        </div>
                        <span className="text-muted-foreground flex-shrink-0">
                          {getIcon(isExpanded ? "ChevronUp" : "ChevronDown", "", 20)}
                        </span>
                      </button>
                      {isExpanded && (
                        <Card className="p-4 mt-2 ms-4">
                          {group.description && <p className="text-muted-foreground text-base mb-3">{group.description}</p>}
                          {group.bullets && group.bullets.length > 0 && (
                            <ul className="space-y-2">
                              {group.bullets.map((bullet, bulletIndex) => (
                                <li key={bulletIndex} className="flex items-start gap-3">
                                  {bullet.icon ? (
                                    <span className="text-primary mt-0.5 flex-shrink-0">{getIcon(bullet.icon)}</span>
                                  ) : (
                                    <span className="text-foreground mt-1 flex-shrink-0">•</span>
                                  )}
                                  <span className="text-foreground text-base">{bullet.text}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </Card>
                      )}
                    </div>
                  );
                })}
              </div>
              {data.footer_description && (
                <p className="text-base text-muted-foreground leading-relaxed italic text-center">{data.footer_description}</p>
              )}
            </div>

            {/* ===== TABLET LAYOUT (md to lg-1, hidden below md and at lg+) ===== */}
            <div className="hidden md:block lg:hidden space-y-8">
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-8 text-left">
                  <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-support-duo-heading-tablet">
                    {data.heading}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">{data.description}</p>
                </div>
                {data.image && (
                  <div className="col-span-4">
                    <img src={data.image} alt={data.image_alt || "Section image"} className="rounded-md w-full max-w-[180px] h-auto mx-auto" loading="lazy" data-testid="img-support-duo-tablet" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-6" data-testid="list-support-duo-groups-tablet">
                {data.bullet_groups.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-3">
                    <div className="flex items-center gap-3">
                      {group.icon ? (
                        <span className="text-primary flex-shrink-0">{getIcon(group.icon, "w-10 h-10")}</span>
                      ) : (
                        <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
                          <img src={group.image || rigobotLogo} alt="Support icon" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <h4 className="font-bold text-foreground uppercase tracking-wide text-sm">{group.title}</h4>
                    </div>
                    {group.description && <p className="text-muted-foreground text-base ms-12 mb-2">{group.description}</p>}
                    {group.bullets && group.bullets.length > 0 && (
                      <ul className="space-y-2 ms-12">
                        {group.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="flex items-start gap-3">
                            {bullet.icon ? (
                              <span className="text-primary mt-0.5 flex-shrink-0">{getIcon(bullet.icon)}</span>
                            ) : (
                              <span className="text-foreground mt-1 flex-shrink-0">•</span>
                            )}
                            <span className="text-foreground text-base">{bullet.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              {data.footer_description && (
                <p className="text-base text-muted-foreground leading-relaxed italic text-left">{data.footer_description}</p>
              )}
            </div>

            {/* ===== DESKTOP LAYOUT (lg+, original stacked layout) ===== */}
            <div className="hidden lg:block">
              <div className="mb-10 text-start">
                <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-support-duo-heading">
                  {data.heading}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{data.description}</p>
              </div>
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-7">
                  <div className="space-y-6" data-testid="list-support-duo-groups">
                    {data.bullet_groups.map((group, groupIndex) => (
                      <div key={groupIndex} className="space-y-3">
                        <div className="flex items-center gap-3">
                          {group.icon ? (
                            <span className="text-primary flex-shrink-0">{getIcon(group.icon, "w-10 h-10")}</span>
                          ) : (
                            <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
                              <img src={group.image || rigobotLogo} alt="Support icon" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <h4 className="font-bold text-foreground uppercase tracking-wide text-sm">{group.title}</h4>
                        </div>
                        <Card className="p-4 ms-10">
                          {group.description && <p className="text-muted-foreground text-base mb-3">{group.description}</p>}
                          {group.bullets && group.bullets.length > 0 && (
                            <ul className="space-y-2">
                              {group.bullets.map((bullet, bulletIndex) => (
                                <li key={bulletIndex} className="flex items-start gap-3">
                                  {bullet.icon ? (
                                    <span className="text-primary mt-0.5 flex-shrink-0">{getIcon(bullet.icon)}</span>
                                  ) : (
                                    <span className="text-foreground mt-1 flex-shrink-0">•</span>
                                  )}
                                  <span className="w-px bg-border self-stretch flex-shrink-0" />
                                  <span className="text-foreground text-base">{bullet.text}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </Card>
                      </div>
                    ))}
                  </div>
                  {data.footer_description && (
                    <p className="text-base text-muted-foreground leading-relaxed italic mt-4">{data.footer_description}</p>
                  )}
                </div>
                {data.image && (
                  <div className="col-span-5">
                    <img src={data.image} alt={data.image_alt || "Section image"} className="rounded-md w-full h-auto" loading="lazy" data-testid="img-support-duo" />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {isGrid && data.footer_description && (
          <p 
            className="text-base text-muted-foreground leading-relaxed italic mt-6 text-center"
            data-testid="text-support-duo-footer"
          >
            {data.footer_description}
          </p>
        )}
      </div>
    </section>
  );
}

export type { SupportDuoData };
