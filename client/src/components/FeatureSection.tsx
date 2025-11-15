import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Feature {
  title?: string;
  bullets?: string[];
  description?: string;
  icon?: string;
}

interface FeatureSectionProps {
  title?: string;
  features: Feature[];
  avatars?: { src: string; alt: string; fallback: string }[];
}

export default function FeatureSection({ title, features, avatars }: FeatureSectionProps) {
  return (
    <section className="container mx-auto px-4 py-16 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 md:gap-12 max-w-6xl mx-auto">
        {/* Left: Content with bullets */}
        <div className="space-y-6">
          {title && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-[60ch]">
              {title}
            </h2>
          )}
          
          {features.map((feature, index) => (
            <div key={index} className="space-y-3" data-testid={`feature-${index}`}>
              {feature.title && (
                <h3 className="text-xl md:text-2xl font-semibold">{feature.title}</h3>
              )}
              {feature.bullets && feature.bullets.length > 0 ? (
                <ul className="space-y-2 text-muted-foreground" data-testid={`list-feature-${index}`}>
                  {feature.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : feature.description ? (
                <p className="text-muted-foreground">{feature.description}</p>
              ) : null}
            </div>
          ))}
        </div>

        {/* Right: Avatar logos in vertical stack */}
        {avatars && avatars.length > 0 && (
          <div className="flex flex-col justify-center items-center gap-4 md:gap-6 relative">
            {/* Optional connector line (desktop only) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 -z-10" />
            
            {avatars.map((avatar, index) => (
              <Avatar 
                key={index} 
                className="h-12 w-12 md:h-16 md:w-16 border-2 border-border bg-background"
                data-testid={`avatar-logo-${index}`}
              >
                <AvatarImage src={avatar.src} alt={avatar.alt} />
                <AvatarFallback>{avatar.fallback}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
