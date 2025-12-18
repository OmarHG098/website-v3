import { useState } from "react";
import { Card } from "@/components/ui/card";
import * as TablerIcons from "@tabler/icons-react";
import type { ComponentType } from "react";
import rigobotLogo from "@assets/rigobot-logo_1764707022198.webp";
import { getCustomIcon } from "@/components/custom-icons";

interface BulletItem {
  text: string;
  icon?: string;
}

interface BulletGroup {
  title: string;
  description?: string;
  image?: string;
  icon?: string;
  bullets?: BulletItem[];
}

interface HumanAndAIDuoData {
  type: "human_and_ai_duo";
  version?: string;
  heading: string;
  description: string;
  bullet_groups: BulletGroup[];
  footer_description?: string;
  image?: string;
  image_alt?: string;
  background?: string;
}

interface HumanAndAIDuoProps {
  data: HumanAndAIDuoData;
}

const getIcon = (iconName: string, className?: string, size?: number, color?: string) => {
  const CustomIcon = getCustomIcon(iconName);
  if (CustomIcon) {
    const sizeStr = size ? `${size}px` : "20px";
    return <CustomIcon width={sizeStr} height={sizeStr} className={className} color={color} />;
  }
  const icons = TablerIcons as unknown as Record<string, ComponentType<{ className?: string; size?: number; color?: string }>>;
  const IconComponent = icons[`Icon${iconName}`];
  return IconComponent ? <IconComponent className={className} size={size || 20} color={color} /> : null;
};

export function HumanAndAIDuo({ data }: HumanAndAIDuoProps) {
  const backgroundClass = data.background || "bg-background";
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

  const toggleGroup = (index: number) => {
    setExpandedGroups(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section 
      className={`py-14 ${backgroundClass}`}
      data-testid="section-human-and-ai-duo"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* ===== MOBILE LAYOUT (base, hidden at md+) ===== */}
        <div className="md:hidden space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-human-ai-heading">
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
                data-testid="img-human-ai-mobile"
              />
            </div>
          )}
          <div className="space-y-4" data-testid="list-human-ai-groups-mobile">
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
              <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-human-ai-heading-tablet">
                {data.heading}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{data.description}</p>
            </div>
            {data.image && (
              <div className="col-span-4">
                <img src={data.image} alt={data.image_alt || "Section image"} className="rounded-md w-full max-w-[180px] h-auto mx-auto" loading="lazy" data-testid="img-human-ai-tablet" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-6" data-testid="list-human-ai-groups-tablet">
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
            <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-human-ai-heading">
              {data.heading}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{data.description}</p>
          </div>
          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-7">
              <div className="space-y-6" data-testid="list-human-ai-groups">
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
                <img src={data.image} alt={data.image_alt || "Section image"} className="rounded-md w-full h-auto" loading="lazy" data-testid="img-human-ai" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export type { HumanAndAIDuoData };
