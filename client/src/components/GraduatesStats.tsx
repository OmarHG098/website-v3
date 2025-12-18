import { UniversalImage } from "@/components/UniversalImage";
import type { GraduatesStatsSection } from "@shared/schema";

interface GraduatesStatsProps {
  data: GraduatesStatsSection;
}

export function GraduatesStats({ data }: GraduatesStatsProps) {
  const { heading, subheading, stats, collage_images, background } = data;

  if (!stats || stats.length === 0) {
    return null;
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
          <div 
            className="grid grid-cols-12 auto-rows-[80px] gap-3"
            data-testid="graduates-stats-collage"
          >
            {collage_images && collage_images.map((img, index) => {
              const colSpan = img.col_span || 6;
              const rowSpan = img.row_span || 2;
              
              const colSpanClass = `col-span-${colSpan}`;
              const rowSpanClass = `row-span-${rowSpan}`;
              
              return (
                <div 
                  key={index}
                  className={`${colSpanClass} ${rowSpanClass}`}
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
        </div>
      </div>
    </section>
  );
}

export default GraduatesStats;
