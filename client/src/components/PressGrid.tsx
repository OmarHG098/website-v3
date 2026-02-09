import type { PressGridSection as PressGridSectionType } from "@shared/schema";
import { UniversalImage } from "@/components/UniversalImage";

interface PressGridProps {
  data: PressGridSectionType;
}

export function PressGrid({ data }: PressGridProps) {
  const items = data.items || [];
  const title = data.title;
  const subtitle = data.subtitle;
  const defaultBoxColor = data.default_box_color || "hsl(var(--muted))";
  const defaultTitleColor = data.default_title_color;
  const defaultExcerptColor = data.default_excerpt_color;
  const defaultLinkColor = data.default_link_color;
  const columns = data.columns || 3;
  const background = data.background;

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
      data-testid="section-press-grid"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && (
              <h2
                className="text-h2 mb-3 text-foreground"
                style={data.title_color ? { color: data.title_color } : undefined}
                data-testid="text-press-grid-title"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="text-body text-muted-foreground max-w-2xl mx-auto"
                style={data.subtitle_color ? { color: data.subtitle_color } : undefined}
                data-testid="text-press-grid-subtitle"
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
          data-testid="press-grid-container"
        >
          <style>{`
            @media (min-width: 768px) {
              [data-testid="press-grid-container"] {
                column-count: ${Math.min(columns, 2)} !important;
              }
            }
            @media (min-width: 1024px) {
              [data-testid="press-grid-container"] {
                column-count: ${columns} !important;
              }
            }
          `}</style>
          {items.map((item, index) => (
            <PressGridCard
              key={index}
              item={item}
              defaultBoxColor={defaultBoxColor}
              defaultTitleColor={defaultTitleColor}
              defaultExcerptColor={defaultExcerptColor}
              defaultLinkColor={defaultLinkColor}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface PressGridCardProps {
  item: NonNullable<PressGridSectionType["items"]>[number];
  defaultBoxColor: string;
  defaultTitleColor?: string;
  defaultExcerptColor?: string;
  defaultLinkColor?: string;
  index: number;
}

function PressGridCard({
  item,
  defaultBoxColor,
  defaultTitleColor,
  defaultExcerptColor,
  defaultLinkColor,
  index,
}: PressGridCardProps) {
  const boxColor = item.box_color || defaultBoxColor;
  const titleColor = item.title_color || defaultTitleColor;
  const excerptColor = item.excerpt_color || defaultExcerptColor;
  const linkColor = item.link_color || defaultLinkColor || "hsl(var(--primary))";

  return (
    <div
      className="break-inside-avoid mb-4 md:mb-5 rounded-[0.8rem] overflow-hidden"
      style={{ backgroundColor: boxColor }}
      data-testid={`card-press-grid-${index}`}
    >
      <div className="p-5 md:p-6 flex flex-col gap-4">
        {item.logo && (
          <div className="h-6 md:h-7 flex items-start" data-testid={`img-press-logo-${index}`}>
            <UniversalImage
              id={item.logo}
              alt={item.title}
              className="h-full w-auto object-contain max-w-[140px]"
              loading="lazy"
            />
          </div>
        )}

        <h3
          className="text-lg md:text-xl font-bold text-foreground leading-tight"
          style={titleColor ? { color: titleColor } : undefined}
          data-testid={`text-press-title-${index}`}
        >
          {item.title}
        </h3>

        <p
          className="text-sm text-muted-foreground leading-relaxed"
          style={excerptColor ? { color: excerptColor } : undefined}
          data-testid={`text-press-excerpt-${index}`}
        >
          {item.excerpt}
        </p>

        {item.link_text && item.link_url && (
          <a
            href={item.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold hover:underline"
            style={{ color: linkColor }}
            data-testid={`link-press-article-${index}`}
          >
            {item.link_text}
          </a>
        )}
      </div>
    </div>
  );
}

export default PressGrid;
