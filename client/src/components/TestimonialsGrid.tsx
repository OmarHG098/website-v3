import { useMemo } from "react";
import { IconStarFilled, IconStar, IconBrandLinkedin } from "@tabler/icons-react";
import type { TestimonialsGridSection as TestimonialsGridSectionType } from "@shared/schema";
import { UniversalVideo } from "@/components/UniversalVideo";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface BankTestimonial {
  student_name: string;
  student_thumb?: string;
  linkedin_url?: string;
  excerpt?: string;
  full_text?: string;
  content?: string;
  short_content?: string;
  related_features?: string[];
  locations?: string[];
  priority?: number;
  rating?: number;
  role?: string;
  company?: string;
  media?: {
    url: string;
    type?: "image" | "video";
    ratio?: string;
  };
}

interface GridItem {
  name: string;
  role: string;
  company?: string;
  comment: string;
  rating?: number;
  avatar?: string;
  linkedin_url?: string;
  box_color?: string;
  name_color?: string;
  role_color?: string;
  comment_color?: string;
  star_color?: string;
  linkedin_color?: string;
  media?: {
    url: string;
    type?: "image" | "video";
    ratio?: string;
  };
}

interface TestimonialsGridProps {
  data: TestimonialsGridSectionType;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function isVideoUrl(url: string): boolean {
  const videoExtensions = [".mp4", ".webm", ".mov", ".ogg", ".m4v"];
  const videoHosts = ["youtube.com", "youtu.be", "vimeo.com"];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.endsWith(ext)) ||
    videoHosts.some(host => lowerUrl.includes(host));
}

function mapBankToGridItem(t: BankTestimonial): GridItem {
  return {
    name: t.student_name,
    role: t.role || "",
    company: t.company,
    comment: t.excerpt || t.short_content || t.content || t.full_text || "",
    rating: t.rating,
    avatar: t.student_thumb,
    linkedin_url: t.linkedin_url,
    media: t.media,
  };
}

function filterByRelatedFeatures(
  testimonials: BankTestimonial[],
  relatedFeatures: string[],
  limit: number
): GridItem[] {
  let filtered = testimonials.filter((t) => {
    const features = t.related_features || [];
    return relatedFeatures.some((f) => features.includes(f));
  });

  filtered.sort((a, b) => {
    const aFeatures = a.related_features || [];
    const bFeatures = b.related_features || [];
    const aMatchCount = relatedFeatures.filter((f) => aFeatures.includes(f)).length;
    const bMatchCount = relatedFeatures.filter((f) => bFeatures.includes(f)).length;

    if (bMatchCount !== aMatchCount) {
      return bMatchCount - aMatchCount;
    }
    return (b.priority ?? 0) - (a.priority ?? 0);
  });

  return filtered.slice(0, limit).map(mapBankToGridItem);
}

export function TestimonialsGrid({ data }: TestimonialsGridProps) {
  const { i18n } = useTranslation();
  const locale = i18n.language?.startsWith("es") ? "es" : "en";

  const relatedFeatures = data.related_features || [];
  const limit = Math.min(data.limit || 30, 30);

  const { data: bankData, isLoading } = useQuery<{ testimonials: BankTestimonial[] }>({
    queryKey: ["/api/testimonials", locale],
    staleTime: 5 * 60 * 1000,
  });

  const items: GridItem[] = useMemo(() => {
    if (!bankData?.testimonials) return [];
    if (relatedFeatures.length > 0) {
      return filterByRelatedFeatures(bankData.testimonials, relatedFeatures, limit);
    }
    return bankData.testimonials.slice(0, limit).map(mapBankToGridItem);
  }, [relatedFeatures, bankData, limit]);

  const title = data.title;
  const subtitle = data.subtitle;
  const defaultBoxColor = data.default_box_color || "hsl(var(--muted))";
  const defaultNameColor = data.default_name_color;
  const defaultRoleColor = data.default_role_color;
  const defaultCommentColor = data.default_comment_color;
  const defaultStarColor = data.default_star_color;
  const defaultLinkedinColor = data.default_linkedin_color;
  const columns = data.columns || 3;
  const background = data.background;

  if (isLoading) {
    return (
      <section data-testid="section-testimonials-grid">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="animate-pulse">
            <div className="h-10 w-64 bg-muted rounded mx-auto mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-40 bg-muted rounded-[0.8rem]" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  const bgStyle: React.CSSProperties = {};
  if (background) {
    if (background.startsWith("linear-gradient") || background.startsWith("radial-gradient")) {
      bgStyle.backgroundImage = background;
    } else {
      bgStyle.backgroundColor = background;
    }
  }

  return (
    <section
      className="py-12 md:py-16"
      style={bgStyle}
      data-testid="section-testimonials-grid"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && (
              <h2
                className="text-h2 mb-3 text-foreground"
                style={data.title_color ? { color: data.title_color } : undefined}
                data-testid="text-testimonials-grid-title"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="text-body text-muted-foreground max-w-2xl mx-auto"
                style={data.subtitle_color ? { color: data.subtitle_color } : undefined}
                data-testid="text-testimonials-grid-subtitle"
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div
          className="gap-4 md:gap-5"
          style={{
            columnCount: 1,
            columnGap: "1.25rem",
          }}
          data-testid="testimonials-grid-container"
        >
          <style>{`
            @media (min-width: 768px) {
              [data-testid="testimonials-grid-container"] {
                column-count: ${Math.min(columns, 2)} !important;
              }
            }
            @media (min-width: 1024px) {
              [data-testid="testimonials-grid-container"] {
                column-count: ${columns} !important;
              }
            }
          `}</style>
          {items.map((item, index) => (
            <TestimonialGridCard
              key={index}
              item={item}
              defaultBoxColor={defaultBoxColor}
              defaultNameColor={defaultNameColor}
              defaultRoleColor={defaultRoleColor}
              defaultCommentColor={defaultCommentColor}
              defaultStarColor={defaultStarColor}
              defaultLinkedinColor={defaultLinkedinColor}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface TestimonialGridCardProps {
  item: GridItem;
  defaultBoxColor: string;
  defaultNameColor?: string;
  defaultRoleColor?: string;
  defaultCommentColor?: string;
  defaultStarColor?: string;
  defaultLinkedinColor?: string;
  index: number;
}

function TestimonialGridCard({
  item,
  defaultBoxColor,
  defaultNameColor,
  defaultRoleColor,
  defaultCommentColor,
  defaultStarColor,
  defaultLinkedinColor,
  index,
}: TestimonialGridCardProps) {
  const boxColor = item.box_color || defaultBoxColor;
  const nameColor = item.name_color || defaultNameColor;
  const roleColor = item.role_color || defaultRoleColor;
  const commentColor = item.comment_color || defaultCommentColor;
  const starColor = item.star_color || defaultStarColor;
  const linkedinColor = item.linkedin_color || defaultLinkedinColor;
  const hasMedia = !!item.media?.url;
  const mediaType = item.media?.type || (item.media?.url && isVideoUrl(item.media.url) ? "video" : "image");

  return (
    <div
      className="break-inside-avoid mb-4 md:mb-5 rounded-[0.8rem] overflow-hidden"
      style={{ backgroundColor: boxColor }}
      data-testid={`card-testimonial-grid-${index}`}
    >
      {hasMedia && item.media && (
        <div className="w-full" data-testid={mediaType === "video" ? `video-media-${index}` : undefined}>
          {mediaType === "video" ? (
            <UniversalVideo
              url={item.media.url}
              ratio={item.media.ratio || "16:9"}
              className="w-full"
            />
          ) : (
            <img
              src={item.media.url}
              alt={`${item.name} testimonial`}
              className="w-full h-auto object-cover"
              loading="lazy"
              data-testid={`img-media-${index}`}
            />
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-10 h-10 flex-shrink-0" data-testid={`img-avatar-${index}`}>
            {item.avatar && <AvatarImage src={item.avatar} alt={item.name} />}
            <AvatarFallback className="bg-foreground/10 text-foreground/70 text-sm font-semibold">
              {getInitials(item.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p
              className="font-semibold text-foreground text-sm truncate"
              style={nameColor ? { color: nameColor } : undefined}
              data-testid={`text-name-${index}`}
            >
              {item.name}
            </p>
            <p
              className="text-xs text-muted-foreground truncate"
              style={roleColor ? { color: roleColor } : undefined}
              data-testid={`text-role-${index}`}
            >
              {item.role}
              {item.company && ` en ${item.company}`}
            </p>
          </div>
          {item.linkedin_url && (
            <a
              href={item.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-muted-foreground"
              style={linkedinColor ? { color: linkedinColor } : undefined}
              data-testid={`link-linkedin-${index}`}
            >
              <IconBrandLinkedin size={20} />
            </a>
          )}
        </div>

        <p
          className="text-muted-foreground text-sm leading-relaxed mb-3"
          style={commentColor ? { color: commentColor } : undefined}
          data-testid={`text-comment-${index}`}
        >
          {item.comment}
        </p>

        {item.rating && (
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) =>
              i < item.rating! ? (
                <IconStarFilled
                  key={i}
                  className="w-4 h-4 text-yellow-500"
                  style={starColor ? { color: starColor } : undefined}
                  data-testid={`icon-star-filled-${index}-${i}`}
                />
              ) : (
                <IconStar key={i} className="w-4 h-4 text-foreground/20" />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TestimonialsGrid;
