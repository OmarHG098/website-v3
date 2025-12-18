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

  const firstRowStats = stats.slice(0, 2);
  const secondRowStats = stats.slice(2);

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
            className="relative h-[450px] md:h-[550px] lg:h-[600px]"
            data-testid="graduates-stats-collage"
          >
            {collage_images && collage_images.length >= 6 && (
              <div className="relative w-full h-full">
                <div className="absolute top-[2%] left-[3%] w-[50%] h-[32%]">
                  <UniversalImage
                    id={collage_images[0]?.image_id}
                    preset="card"
                    className="w-full h-full object-cover rounded-2xl shadow-sm"
                    alt="Graduate photo 1"
                  />
                </div>
                
                <div className="absolute top-[5%] right-[5%] w-[38%] h-[26%]">
                  <UniversalImage
                    id={collage_images[1]?.image_id}
                    preset="card"
                    className="w-full h-full object-cover rounded-xl shadow-sm"
                    alt="Graduate photo 2"
                  />
                </div>
                
                <div className="absolute top-[34%] right-[2%] w-[52%] h-[30%]">
                  <UniversalImage
                    id={collage_images[2]?.image_id}
                    preset="card"
                    className="w-full h-full object-cover rounded-2xl shadow-sm"
                    alt="Graduate photo 3"
                  />
                </div>
                
                <div className="absolute top-[38%] left-[5%] w-[38%] h-[26%]">
                  <UniversalImage
                    id={collage_images[3]?.image_id}
                    preset="card"
                    className="w-full h-full object-cover rounded-xl shadow-sm"
                    alt="Graduate photo 4"
                  />
                </div>
                
                <div className="absolute bottom-[3%] left-[2%] w-[54%] h-[28%]">
                  <UniversalImage
                    id={collage_images[4]?.image_id}
                    preset="card"
                    className="w-full h-full object-cover rounded-2xl shadow-sm"
                    alt="Graduate photo 5"
                  />
                </div>
                
                <div className="absolute bottom-[5%] right-[6%] w-[35%] h-[30%]">
                  <UniversalImage
                    id={collage_images[5]?.image_id}
                    preset="card"
                    className="w-full h-full object-cover rounded-xl shadow-sm"
                    alt="Graduate photo 6"
                  />
                </div>
              </div>
            )}
            
            {collage_images && collage_images.length > 0 && collage_images.length < 6 && (
              <div className="grid grid-cols-2 gap-3 h-full">
                {collage_images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`${index === 0 ? 'col-span-2' : ''}`}
                  >
                    <UniversalImage
                      id={img.image_id}
                      preset="card"
                      className="w-full h-full object-cover rounded-lg shadow-sm"
                      alt={`Graduate photo ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div 
            className="flex flex-col justify-center"
            data-testid="graduates-stats-numbers"
          >
            <div className="grid grid-cols-2 gap-8 mb-8">
              {firstRowStats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center lg:text-left"
                  data-testid={`stat-item-${index}`}
                >
                  <p 
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2"
                    data-testid={`text-stat-value-${index}`}
                  >
                    {stat.value}
                  </p>
                  <p 
                    className="text-sm md:text-base text-muted-foreground"
                    data-testid={`text-stat-label-${index}`}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            
            {secondRowStats.length > 0 && (
              <div className="grid grid-cols-2 gap-8">
                {secondRowStats.map((stat, index) => (
                  <div 
                    key={index + 2} 
                    className={`text-center lg:text-left ${secondRowStats.length === 1 ? 'col-span-2' : ''}`}
                    data-testid={`stat-item-${index + 2}`}
                  >
                    <p 
                      className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2"
                      data-testid={`text-stat-value-${index + 2}`}
                    >
                      {stat.value}
                    </p>
                    <p 
                      className="text-sm md:text-base text-muted-foreground"
                      data-testid={`text-stat-label-${index + 2}`}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GraduatesStats;
