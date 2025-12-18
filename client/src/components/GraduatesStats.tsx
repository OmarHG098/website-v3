import { UniversalImage } from "@/components/UniversalImage";
import type { GraduatesStatsSection } from "@shared/schema";

interface GraduatesStatsProps {
  data: GraduatesStatsSection;
}

export function GraduatesStats({ data }: GraduatesStatsProps) {
  const { heading, subheading, stats, collage_images, background } = data;
  const variant = 'variant' in data ? data.variant : 'standard';
  const featured_images = 'featured_images' in data ? data.featured_images : undefined;

  if (!stats || stats.length === 0) {
    return null;
  }

  const isFullBleed = variant === "fullBleed" && featured_images && featured_images.length >= 2;

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

  const renderStatsStandard = () => (
    <div 
      className="flex flex-col justify-center"
      data-testid="graduates-stats-numbers"
    >
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
    </div>
  );

  const renderStatsCompact = () => (
    <div 
      className="flex flex-col justify-center"
      data-testid="graduates-stats-numbers"
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {stats.map((stat, index) => {
          const isOdd = stats.length % 2 !== 0;
          const isLast = index === stats.length - 1;
          const shouldSpanFull = isOdd && isLast;
          
          return (
            <div 
              key={index} 
              className={`text-center lg:text-left ${shouldSpanFull ? 'col-span-2' : ''}`}
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
          );
        })}
      </div>
    </div>
  );

  if (isFullBleed && featured_images) {
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
              className="flex-shrink-0"
              style={{ width: 'calc(50vw - 576px + 500px)', minWidth: '500px' }}
            >
              <div 
                className="grid grid-cols-12 auto-rows-[80px] gap-3 h-[320px]"
                data-testid="graduates-stats-collage-full"
              >
                <div 
                  style={{ gridColumn: 'span 5', gridRow: 'span 2' }}
                >
                  <UniversalImage
                    id={featured_images[0].image_id}
                    preset="card"
                    className="w-full h-full object-cover shadow-sm"
                    alt="Featured graduate photo 1"
                  />
                </div>
                <div 
                  style={{ gridColumn: 'span 3', gridRow: 'span 2' }}
                >
                  <UniversalImage
                    id={featured_images[1].image_id}
                    preset="card"
                    className="w-full h-full object-cover shadow-sm"
                    alt="Featured graduate photo 2"
                  />
                </div>
                {collage_images && collage_images.map((img, index) => {
                  const colSpan = img.col_span || 4;
                  const rowSpan = img.row_span || 2;
                  return (
                    <div 
                      key={index}
                      style={{
                        gridColumn: `span ${colSpan}`,
                        gridRow: `span ${rowSpan}`,
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
            </div>

            <div 
              className="flex-1 flex flex-col justify-center"
              style={{ paddingLeft: '2rem', paddingRight: 'calc(50vw - 576px + 2rem)', minWidth: '200px' }}
            >
              {renderStatsCompact()}
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
            {renderStatsCompact()}
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
          {renderStatsStandard()}
        </div>
      </div>
    </section>
  );
}

export default GraduatesStats;
