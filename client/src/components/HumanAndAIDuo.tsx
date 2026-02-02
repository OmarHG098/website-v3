import { Card } from "@/components/ui/card";
import * as TablerIcons from "@tabler/icons-react";
import type { ComponentType, CSSProperties } from "react";
import rigobotAvatar from "@assets/rigo-avatar_1763181725290.png";
import { getCustomIcon } from "@/components/custom-icons";
import student1 from "@assets/student-1-asian.png";
import student2 from "@assets/student-2-latin.png";
import student3 from "@assets/student-3-african.png";
import student4 from "@assets/student-4-lady-latin.png";
import type { HumanAndAIDuoSection } from "@shared/schema";

// Image type for styling
interface StyledImageProps {
  src: string;
  alt?: string;
  object_fit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  object_position?: string;
  width?: string;
  height?: string;
  max_width?: string;
  max_height?: string;
  border_radius?: string;
  opacity?: number;
  filter?: string;
}

const defaultStudentImages: StyledImageProps[] = [
  { src: student1, alt: "Student 1" },
  { src: student2, alt: "Student 2" },
  { src: student3, alt: "Student 3" },
  { src: student4, alt: "Student 4" },
];

function getImageStyle(image: StyledImageProps): CSSProperties {
  return {
    objectFit: image.object_fit || "cover",
    objectPosition: image.object_position || "center top",
    width: image.width || "100%",
    height: image.height || "100%",
    maxWidth: image.max_width,
    maxHeight: image.max_height,
    borderRadius: image.border_radius || "0.5rem",
    opacity: image.opacity,
    filter: image.filter,
  };
}

interface HumanAndAIDuoData {
  type: "human_and_ai_duo";
  version?: string;
  heading: string;
  description: string;
  bullet_groups: HumanAndAIDuoSection["bullet_groups"];
  footer_description?: string;
  // New format: array of images with CSS styling
  images?: StyledImageProps[];
  // Legacy format: single image (backward compatible)
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
  
  // Use custom images array if provided, otherwise always show default 4 student images
  // Note: legacy image/image_alt fields are kept for backward compatibility but don't affect the student images display
  const images: StyledImageProps[] = data.images && data.images.length > 0 
    ? data.images 
    : defaultStudentImages;

  return (
    <section 
      className={`py-14 ${backgroundClass}`}
      data-testid="section-human-and-ai-duo"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* ===== MOBILE LAYOUT (base, hidden at md+) ===== */}
        <div className="md:hidden space-y-6">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-foreground mb-3" data-testid="text-human-ai-heading">
              {data.heading}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {data.description}
            </p>
          </div>
          <div className="flex justify-center gap-3 w-full" data-testid="img-students-mobile">
            {images.map((image, index) => (
              <div key={index} className="flex-1 h-36">
                <img
                  src={image.src}
                  alt={image.alt || `Image ${index + 1}`}
                  style={getImageStyle(image)}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <Card className="p-0 overflow-hidden" data-testid="card-info-container-mobile">
            <div className="divide-y divide-border">
              {data.bullet_groups.map((group, groupIndex) => (
                <div key={groupIndex} className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    {group.icon ? (
                      <span className="text-primary flex-shrink-0">{getIcon(group.icon, "w-6 h-6")}</span>
                    ) : (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden">
                        <img src={group.image || rigobotAvatar} alt="Support icon" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h4 className="font-semibold text-foreground uppercase tracking-wide text-xs">{group.title}</h4>
                  </div>
                  {group.description && <p className="text-muted-foreground text-sm mb-3">{group.description}</p>}
                  {group.bullets && group.bullets.length > 0 && (
                    <ul className="space-y-2">
                      {group.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex items-start gap-2">
                          <TablerIcons.IconCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground text-sm">{bullet.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Card>
          {data.footer_description && (
            <p className="text-sm text-muted-foreground leading-relaxed italic text-center">{data.footer_description}</p>
          )}
        </div>

        {/* ===== TABLET LAYOUT (md to lg-1, hidden below md and at lg+) ===== */}
        <div className="hidden md:block lg:hidden space-y-8">
          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-7 text-left">
              <h2 className="text-3xl font-bold text-foreground mb-3" data-testid="text-human-ai-heading-tablet">
                {data.heading}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">{data.description}</p>
            </div>
            <div className="col-span-5 flex gap-3" data-testid="img-students-tablet">
              {images.map((image, index) => (
                <div key={index} className="flex-1 h-40">
                  <img
                    src={image.src}
                    alt={image.alt || `Image ${index + 1}`}
                    style={getImageStyle(image)}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
          <Card className="p-0 overflow-hidden hover:shadow-md transition-shadow duration-200" data-testid="card-info-container-tablet">
            <div className="grid grid-cols-2 divide-x divide-border">
              {data.bullet_groups.map((group, groupIndex) => (
                <div key={groupIndex} className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {group.icon ? (
                      <span className="text-primary flex-shrink-0">{getIcon(group.icon, "w-7 h-7")}</span>
                    ) : (
                      <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden">
                        <img src={group.image || rigobotAvatar} alt="Support icon" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h4 className="font-semibold text-foreground uppercase tracking-wide text-xs">{group.title}</h4>
                  </div>
                  {group.description && <p className="text-muted-foreground text-sm mb-3">{group.description}</p>}
                  {group.bullets && group.bullets.length > 0 && (
                    <ul className="space-y-2">
                      {group.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex items-start gap-2">
                          <TablerIcons.IconCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground text-sm">{bullet.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Card>
          {data.footer_description && (
            <p className="text-sm text-muted-foreground leading-relaxed italic text-left">{data.footer_description}</p>
          )}
        </div>

        {/* ===== DESKTOP LAYOUT (lg+, Notion-like layout) ===== */}
        <div className="hidden lg:block space-y-8">
          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-7 text-left">
              <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-human-ai-heading">
                {data.heading}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">{data.description}</p>
            </div>
            <div className="col-span-5 flex items-start gap-4 bg-primary/5 p-4 rounded-card" data-testid="img-students-desktop">
              {images.map((image, index) => (
                <div key={index} className="flex-1 h-44">
                  <img
                    src={image.src}
                    alt={image.alt || `Image ${index + 1}`}
                    style={getImageStyle(image)}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
          <Card className="p-0 overflow-hidden hover:shadow-md transition-shadow duration-200" data-testid="card-info-container">
            <div className="grid grid-cols-2 divide-x divide-border" data-testid="list-human-ai-groups">
              {data.bullet_groups.map((group, groupIndex) => (
                <div key={groupIndex} className="p-8">
                  <div className="flex items-center gap-3 mb-5">
                    {group.icon ? (
                      <span className="text-primary flex-shrink-0">{getIcon(group.icon, "w-8 h-8")}</span>
                    ) : (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                        <img src={group.image || rigobotAvatar} alt="Support icon" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h4 className="font-semibold text-foreground uppercase tracking-wide text-xs">{group.title}</h4>
                  </div>
                  {group.description && <p className="text-muted-foreground text-base mb-4">{group.description}</p>}
                  {group.bullets && group.bullets.length > 0 && (
                    <ul className="space-y-3">
                      {group.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex items-start gap-3">
                          <TablerIcons.IconCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground text-base">{bullet.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Card>
          {data.footer_description && (
            <p className="text-base text-muted-foreground leading-relaxed italic">{data.footer_description}</p>
          )}
        </div>
      </div>
    </section>
  );
}

export type { HumanAndAIDuoData };
