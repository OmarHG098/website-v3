import { UniversalImage } from "@/components/UniversalImage";
import type { GraduatesStatsSection } from "@shared/schema";

interface GraduatesStatsFullBleedProps {
  data: GraduatesStatsSection;
}

export function GraduatesStatsFullBleed({ data }: GraduatesStatsFullBleedProps) {
  const { heading, subheading, stats, collage_images, background } = data;
  const featured_images = 'featured_images' in data ? data.featured_images : undefined;

  if (!stats || stats.length === 0) {
    return null;
  }

  if (!featured_images || featured_images.length < 2) {
    return null;
  }

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

  const renderStatsCompact = () => (
    <div 
      className="flex flex-col justify-center"
      data-testid="graduates-stats-numbers"
    >
      <div className="flex flex-col gap-4">
        {stats.map((stat, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <div 
              key={index} 
              className={`text-center lg:text-left max-w-[140px] ${isEven ? 'lg:mr-auto' : 'lg:ml-auto'}`}
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
            style={{ width: 'calc(50vw - 576px + 850px)', minWidth: '700px' }}
          >
            <div 
              className="grid grid-cols-12 auto-rows-[80px] gap-3 h-[320px]"
              data-testid="graduates-stats-collage-full"
            >
              {featured_images.map((img, index) => {
                const colSpan = img.col_span || (index === 0 ? 5 : 3);
                const rowSpan = img.row_span || 2;
                const colStart = img.col_start || 1;
                const rowStart = img.row_start || (index === 0 ? 1 : 3);
                return (
                  <div 
                    key={`featured-${index}`}
                    style={{
                      gridColumn: colStart ? `${colStart} / span ${colSpan}` : `span ${colSpan}`,
                      gridRow: rowStart ? `${rowStart} / span ${rowSpan}` : `span ${rowSpan}`,
                    }}
                  >
                    <UniversalImage
                      id={img.image_id}
                      preset="card"
                      className="w-full h-full object-cover shadow-sm"
                      alt={`Featured graduate photo ${index + 1}`}
                    />
                  </div>
                );
              })}
              {collage_images && collage_images.map((img, index) => {
                const colSpan = img.col_span || 4;
                const rowSpan = img.row_span || 2;
                const colStart = img.col_start || (index < 2 ? 6 + index * 4 : 4 + index * 2);
                const rowStart = img.row_start || (index < 2 ? 1 : 3);
                return (
                  <div 
                    key={`collage-${index}`}
                    style={{
                      gridColumn: colStart ? `${colStart} / span ${colSpan}` : `span ${colSpan}`,
                      gridRow: rowStart ? `${rowStart} / span ${rowSpan}` : `span ${rowSpan}`,
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
            style={{ paddingLeft: '2rem', paddingRight: 'max(2rem, calc(50vw - 576px))' }}
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
