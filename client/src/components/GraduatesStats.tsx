import { UniversalImage } from "@/components/UniversalImage";
import type { GraduatesStatsSection } from "@shared/schema";

interface GraduatesStatsProps {
  data: GraduatesStatsSection;
}

export function GraduatesStats({ data }: GraduatesStatsProps) {
  const { heading, subheading, stats, collage_images, featured_images, visual_variant, background } = data;

  if (!stats || stats.length === 0) {
    return null;
  }

  const isFullBleed = visual_variant === "full_bleed_duo";

  const renderCollageImages = () => (
    <div 
      className="grid grid-cols-12 auto-rows-[80px] gap-3"
      data-testid="graduates-stats-collage"
    >
      {collage_images && collage_images.map((img, index) => {
        const colSpan = img.col_span || 6;
        const rowSpan = img.row_span || 2;
        
        return (
          <div 
            key={index}
            style={{
              gridColumn: `span ${colSpan} / span ${colSpan}`,
              gridRow: `span ${rowSpan} / span ${rowSpan}`,
            }}
          >
            <UniversalImage
              id={img.image_id}
              preset="card"
              className="w-full h-full object-cover shadow-sm"
              alt={`Graduate photo ${index + 1}`}
            />
          </div>
        );
      })}
    </div>
  );

  const renderStats = (compact = false) => (
    <div 
      className="flex flex-col justify-center"
      data-testid="graduates-stats-numbers"
    >
      {compact ? (
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {stats.slice(0, 2).map((stat, index) => (
            <div 
              key={index} 
              className="text-center lg:text-left"
              data-testid={`stat-item-${index}`}
            >
              <p 
                className="text-3xl md:text-4xl font-bold text-primary mb-1"
                data-testid={`text-stat-value-${index}`}
              >
                {stat.value}
                {stat.unit && <span className="text-xl md:text-2xl font-semibold ml-1">{stat.unit}</span>}
              </p>
              <p 
                className="text-sm text-muted-foreground"
                data-testid={`text-stat-label-${index}`}
              >
                {stat.label}
              </p>
            </div>
          ))}
          {stats[2] && (
            <div 
              className="col-span-2 text-center lg:text-left mt-2"
              data-testid="stat-item-2"
            >
              <p 
                className="text-3xl md:text-4xl font-bold text-primary mb-1"
                data-testid="text-stat-value-2"
              >
                {stats[2].value}
                {stats[2].unit && <span className="text-xl md:text-2xl font-semibold ml-1">{stats[2].unit}</span>}
              </p>
              <p 
                className="text-sm text-muted-foreground"
                data-testid="text-stat-label-2"
              >
                {stats[2].label}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {stats.map((stat, index) => {
            const isFirstColumn = index % 2 === 0;
            
            return (
              <div 
                key={index} 
                className={`text-center lg:text-left ${isFirstColumn ? 'lg:mr-auto' : 'lg:ml-auto'}`}
                data-testid={`stat-item-${index}`}
              >
                <p 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-1"
                  data-testid={`text-stat-value-${index}`}
                >
                  {stat.value}
                  {stat.unit && <span className="text-2xl md:text-3xl font-semibold ml-1">{stat.unit}</span>}
                </p>
                <p 
                  className="text-sm md:text-base text-muted-foreground"
                  data-testid={`text-stat-label-${index}`}
                >
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (isFullBleed && featured_images && featured_images.length >= 2) {
    return (
      <section 
        className={`py-16 md:py-24 overflow-hidden ${background || ''}`}
        data-testid="section-graduates-stats"
      >
        {(heading || subheading) && (
          <div className="max-w-6xl mx-auto px-4 text-center mb-12">
            {heading && (
              <h2 
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4"
                data-testid="text-graduates-stats-heading"
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p 
                className="text-muted-foreground text-base md:text-lg max-w-3xl mx-auto"
                data-testid="text-graduates-stats-subheading"
              >
                {subheading}
              </p>
            )}
          </div>
        )}

        <div className="hidden lg:block">
          <div className="flex items-stretch">
            <div 
              className="flex gap-3 flex-shrink-0"
              style={{ width: 'calc(50vw - 576px + 200px)', minWidth: '280px' }}
              data-testid="graduates-stats-featured"
            >
              <div className="flex-1 h-[320px]">
                <UniversalImage
                  id={featured_images[0].image_id}
                  preset="card"
                  className="w-full h-full object-cover shadow-sm"
                  alt="Featured graduate photo 1"
                />
              </div>
              <div className="flex-1 h-[320px]">
                <UniversalImage
                  id={featured_images[1].image_id}
                  preset="card"
                  className="w-full h-full object-cover shadow-sm"
                  alt="Featured graduate photo 2"
                />
              </div>
            </div>

            <div className="flex-1 max-w-4xl px-4">
              <div className="grid grid-cols-[2fr_1fr] gap-8 items-center h-full">
                <div className="h-[320px]">
                  {renderCollageImages()}
                </div>
                {renderStats(true)}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <div className="px-4 space-y-8">
            <div className="grid grid-cols-2 gap-3">
              <div className="h-[200px]">
                <UniversalImage
                  id={featured_images[0].image_id}
                  preset="card"
                  className="w-full h-full object-cover shadow-sm"
                  alt="Featured graduate photo 1"
                />
              </div>
              <div className="h-[200px]">
                <UniversalImage
                  id={featured_images[1].image_id}
                  preset="card"
                  className="w-full h-full object-cover shadow-sm"
                  alt="Featured graduate photo 2"
                />
              </div>
            </div>
            
            {renderCollageImages()}
            {renderStats(true)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className={`py-16 md:py-24 ${background || ''}`}
      data-testid="section-graduates-stats"
    >
      <div className="max-w-6xl mx-auto px-4">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4"
                data-testid="text-graduates-stats-heading"
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p 
                className="text-muted-foreground text-base md:text-lg max-w-3xl mx-auto"
                data-testid="text-graduates-stats-subheading"
              >
                {subheading}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12 items-center">
          {renderCollageImages()}
          {renderStats(false)}
        </div>
      </div>
    </section>
  );
}

export default GraduatesStats;
