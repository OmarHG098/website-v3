import { IconFlag } from "@tabler/icons-react";
import Marquee from "react-fast-marquee";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLocation } from "@/contexts/SessionContext";
import {
  filterTestimonialsByRelatedFeatures,
  type TestimonialItem as YAMLTestimonialItem,
} from "@/lib/testimonialConstants";

export interface TestimonialsSlideTestimonial {
  name: string;
  img: string;
  status?: string;
  country: {
    name: string;
    iso: string;
  };
  contributor: string;
  description: string;
  achievement?: string;
}

export interface TestimonialsSlideData {
  title: string;
  description: string;
  background?: string;
  testimonials?: TestimonialsSlideTestimonial[];
  related_features?: string[];
}

interface TestimonialsSlideProps {
  data: TestimonialsSlideData;
}

type CardSize = "small" | "medium" | "large";

const DEFAULT_TESTIMONIALS: TestimonialsSlideTestimonial[] = [
  {
    name: "Loretta Thompson",
    img: "/attached_assets/ttaLoretta_1764725322100.jpeg",
    status: "Graduated",
    country: { iso: "us", name: "United States of America" },
    contributor: "United Way Miami",
    description: "Loretta joined in 2022 and graduated in 2023. She already found a job within the next few months and has fulfilled the whole circle of skills+job that we all want to complete!",
    achievement: "She got a 45% increase in her salary"
  },
  {
    name: "Rich Akers",
    img: "/attached_assets/Akers_1764725327796.jpeg",
    status: "Graduated",
    country: { iso: "us", name: "United States of America" },
    contributor: "Clark University",
    description: "Richard is a great developer that just transitioned from a different background and is now working as a web dev in the tech field.",
    achievement: "He got a 30% increase in his salary"
  },
  {
    name: "MaiLinh Tran",
    img: "/attached_assets/MaiLinh_1764725334980.png",
    status: "Graduated",
    country: { iso: "us", name: "United States of America" },
    contributor: "Clark University",
    description: "An entrepreneur with a passion for technology is now focusing on the dev side of their endeavour.",
    achievement: "She has launched her startup, is capable of hiring new tech talent and coordinates a dev team!"
  },
  {
    name: "Jorge Martín Coimbra",
    img: "/attached_assets/coimbra_1764725341501.png",
    status: "Graduated",
    country: { iso: "uy", name: "Uruguay" },
    contributor: "UTEC-BID",
    description: "Martín joined the first program that we launched together with UTEC and IDB. He got a better paying job, a career that he is passionate about and a new professional life.",
    achievement: "He got a 100% increase in his salary"
  },
  {
    name: "Jean St. Cloud",
    img: "/attached_assets/JeanSt.Cloud_1764725356935.jpeg",
    status: "Graduated",
    country: { iso: "us", name: "United States of America" },
    contributor: "Clark",
    description: "Jean is transitioning from other industries (Music) and is finding his way into Tech. He got it with the support of Clark University and is already performing as a developer and a Mentor.",
    achievement: "He got a 100% increase in his salary"
  },
  {
    name: "Alexandra Espinoza",
    img: "/attached_assets/AlexandraEspinoza_1764725386161.jpeg",
    status: "Graduated",
    country: { iso: "cr", name: "Costa Rica" },
    contributor: "CINDE-BID",
    description: "Alexandra came from a total different background is been a huge revelation for her and everyone around her. She is now a successful and talented software developer in Costa Rica.",
    achievement: "She got a 100% increase in her salary"
  },
  {
    name: "Gabriel Salazar",
    img: "/attached_assets/GabrielSalazar_1764725392872.jpeg",
    status: "Graduated",
    country: { iso: "cr", name: "Costa Rica" },
    contributor: "CINDE-BID",
    description: "Gabriel was already a support specialist at Microsoft and after completing the program he was able to achieve a new position within Microsoft where he is now working as a Software Engineer.",
    achievement: "He got a 50% increase in his salary"
  },
  {
    name: "Laura Magallanes",
    img: "/attached_assets/Laura_1764725397398.jpeg",
    status: "Graduated",
    country: { iso: "uy", name: "Uruguay" },
    contributor: "UTEC-BID",
    description: "Laura is just extraordinary. From a little town in Uruguay with no experience in Coding, she is now a woman head of household, an Instructor and a Program Coordinator.",
    achievement: "She got a 120% increase in her salary"
  },
  {
    name: "Melanie Galaretto",
    img: "/attached_assets/MelamnieGalaretto_1764725408397.jpeg",
    status: "Graduated",
    country: { iso: "uy", name: "Uruguay" },
    contributor: "UTEC-BID",
    description: "Melanie is a young professional who is dreaming of achieving a life that now she owns. She is a resourceful and committed software developer working for a software firm in her home country.",
    achievement: "She got a +100% increase in her salary"
  },
  {
    name: "Natia Lombardo",
    img: "/attached_assets/NatiaLombardo_1764725413363.jpeg",
    status: "Graduated",
    country: { iso: "uy", name: "Uruguay" },
    contributor: "UTEC-BID",
    description: "Natia is a philosopher and a software developer. Currently working as a QA Engineer of a huge and successful International firm."
  },
  {
    name: "Luis Larraburo",
    img: "/attached_assets/LuisLarraburo_1764725418057.jpeg",
    status: "Graduated",
    country: { iso: "cr", name: "Costa Rica" },
    contributor: "CINDE-BID",
    description: "Luis came to the program without any previous experience, He is now a software developer working on a tech firm in Costa Rica.",
    achievement: "He got a 50% increase in his salary"
  },
  {
    name: "Leandro Matonte",
    img: "/attached_assets/Leandro_1764725403142.jpeg",
    status: "Graduated",
    country: { iso: "uy", name: "Uruguay" },
    contributor: "UTEC-BID",
    description: "Leandro got into the program with the expectation to achieve a better understanding and some coding skills that will help with his decision of being a computer scientist graduate. Now he is a software developer at a tech firm in Uruguay.",
    achievement: "He got a 60% increase in his salary"
  }
];

const sizeConfig: Record<CardSize, { lineClamp: string; minHeight: string }> = {
  small: { lineClamp: "line-clamp-3 md:line-clamp-2", minHeight: "min-h-[140px]" },
  medium: { lineClamp: "line-clamp-5 md:line-clamp-4", minHeight: "min-h-[180px]" },
  large: { lineClamp: "line-clamp-7 md:line-clamp-6", minHeight: "min-h-[220px]" }
};

function MasonryCard({ 
  testimonial, 
  size = "medium" 
}: { 
  testimonial: TestimonialsSlideTestimonial; 
  size?: CardSize;
}) {
  const config = sizeConfig[size];
  const hasValidImg = testimonial.img && testimonial.img.trim() !== "";
  
  return (
    <div 
      className={cn(
        "bg-muted/30 border max-w- border-border/50 rounded-[0.8rem] p-4 shadow-sm",
        config.minHeight
      )}
      data-testid={`card-testimonial-${testimonial.name.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="flex items-center gap-3 mb-3">
        {hasValidImg ? (
          <img 
            src={testimonial.img} 
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                const placeholder = document.createElement("div");
                placeholder.className = "w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0";
                placeholder.innerHTML = `<span class="text-xs font-semibold text-muted-foreground">${testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</span>`;
                parent.appendChild(placeholder);
              }
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-muted-foreground">
              {testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-foreground text-sm leading-tight truncate">
            {testimonial.name}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {testimonial.contributor}
          </p>
        </div>
      </div>
      
      <p className={cn(
        "text-sm text-foreground leading-relaxed mb-3",
        config.lineClamp
      )}>
        {testimonial.description}
      </p>
      
      {testimonial.achievement && (
        <div className="bg-primary/10 rounded-md px-2.5 py-1.5 inline-flex items-center gap-1.5">
          <IconFlag className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <span className="text-xs font-medium text-primary">
            {testimonial.achievement}
          </span>
        </div>
      )}
    </div>
  );
}

interface MasonryColumn {
  cards: { testimonial: TestimonialsSlideTestimonial; size: CardSize }[];
}

function createMasonryColumns(testimonials: TestimonialsSlideTestimonial[]): MasonryColumn[] {
  const twoCardPatterns: CardSize[][] = [
    ["large", "small"],
    ["small", "large"],
    ["medium", "medium"],
    ["large", "medium"],
    ["medium", "small"],
    ["small", "medium"],
  ];
  
  const columns: MasonryColumn[] = [];
  
  for (let i = 0; i < testimonials.length; i += 2) {
    const pattern = twoCardPatterns[(i / 2) % twoCardPatterns.length];
    const column: MasonryColumn = { cards: [] };
    
    column.cards.push({
      testimonial: testimonials[i],
      size: pattern[0]
    });
    
    if (i + 1 < testimonials.length) {
      column.cards.push({
        testimonial: testimonials[i + 1],
        size: pattern[1]
      });
    } else if (columns.length > 0) {
      const lastColumn = columns[columns.length - 1];
      lastColumn.cards.push({
        testimonial: testimonials[i],
        size: "medium"
      });
      continue;
    }
    
    columns.push(column);
  }
  
  return columns;
}

function MasonryColumnComponent({ column }: { column: MasonryColumn }) {
  return (
    <div className="flex flex-col gap-4 w-[280px] flex-shrink-0 mx-2">
      {column.cards.map((card, index) => (
        <MasonryCard 
          key={index} 
          testimonial={card.testimonial} 
          size={card.size} 
        />
      ))}
    </div>
  );
}

export default function TestimonialsSlide({ data }: TestimonialsSlideProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    if (mediaQuery.matches) {
      setIsPlaying(false);
    }
    
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        setIsPlaying(false);
      }
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleInteractionStart = useCallback(() => {
    if (prefersReducedMotion) return;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
    setIsPlaying(false);
  }, [prefersReducedMotion]);

  const handleInteractionEnd = useCallback(() => {
    if (prefersReducedMotion) return;
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPlaying(true);
    }, 500);
  }, [prefersReducedMotion]);

  const location = useLocation();
  const { i18n } = useTranslation();
  const locale = i18n.language?.startsWith("es") ? "es" : "en";
  
  const hasInlineTestimonials = data.testimonials && data.testimonials.length > 0;
  const hasRelatedFeatures = data.related_features && data.related_features.length > 0;
  
  const { data: testimonialsData, isLoading } = useQuery<{ testimonials: YAMLTestimonialItem[] }>({
    queryKey: ["/api/testimonials", locale],
    enabled: hasRelatedFeatures,
    staleTime: 5 * 60 * 1000,
  });
  
  const testimonials: TestimonialsSlideTestimonial[] = useMemo(() => {
    if (hasRelatedFeatures && testimonialsData?.testimonials) {
      const filtered = filterTestimonialsByRelatedFeatures(testimonialsData.testimonials, {
        relatedFeatures: data.related_features!,
        location: location?.country_code,
        componentType: "testimonials_slide",
      });
      
      // Map YAML structure to TestimonialsSlideTestimonial format
      return filtered.map((testimonial) => {
        // Try to extract country from location or use defaults
        // Since YAML doesn't have country/contributor, we'll use defaults or extract from available data
        const countryIso = location?.country_code?.toLowerCase() || "us";
        const countryName = location?.country || "United States";
        
        return {
          name: testimonial.student_name,
          img: testimonial.student_thumb || "",
          description: testimonial.content || "",
          achievement: testimonial.outcome,
          country: {
            iso: countryIso,
            name: countryName,
          },
          contributor: testimonial.company || "4Geeks Academy",
          status: testimonial.role ? `Graduated - ${testimonial.role}` : "Graduated",
        };
      });
    }
    
    if (hasInlineTestimonials) {
      return data.testimonials!;
    }
    
    return DEFAULT_TESTIMONIALS;
  }, [hasRelatedFeatures, hasInlineTestimonials, data.related_features, data.testimonials, testimonialsData, location?.country_code, location?.country]);

  const masonryColumns = createMasonryColumns(testimonials);

  if (isLoading && hasRelatedFeatures) {
    return (
      <section 
        className={`py-12 md:py-16 ${data.background || ""}`}
        data-testid="section-testimonials-slide"
      >
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <div className="animate-pulse">
            <div className="h-10 w-64 bg-muted rounded mx-auto mb-4" />
            <div className="h-6 w-96 bg-muted rounded mx-auto" />
          </div>
        </div>
        <div className="h-[550px] md:h-[400px] bg-muted rounded" />
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section 
      className={`py-12 md:py-16 ${data.background || ""}`}
      data-testid="section-testimonials-slide"
    >
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <h2 
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-foreground mb-4"
          data-testid="text-testimonials-slide-title"
        >
          {data.title}
        </h2>
        <p 
          className="text-center text-lg text-muted-foreground max-w-3xl mx-auto"
          data-testid="text-testimonials-slide-description"
        >
          {data.description}
        </p>
      </div>
      
      <div className="relative">
        {/* Mobile height constraint - limits visible content on mobile */}
        <div className="overflow-hidden h-[550px] md:h-[400px] md:h-auto">
          <div
            className={cn(
              prefersReducedMotion && "overflow-x-auto"
            )}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            onMouseEnter={handleInteractionStart}
            onMouseLeave={handleInteractionEnd}
          >
            <Marquee 
              gradient={false} 
              speed={25} 
              play={isPlaying && !prefersReducedMotion}
              data-testid="marquee-testimonials-slide"
            >
            <div className="flex items-start py-4">
              {/* Duplicate columns 3x to ensure seamless loop on ultra-wide screens */}
              {[...masonryColumns, ...masonryColumns, ...masonryColumns].map((column, index) => (
                <MasonryColumnComponent key={index} column={column} />
              ))}
            </div>
          </Marquee>
        </div>
        </div>
        
        <div 
          className="absolute inset-0 top-auto pointer-events-none z-10"
          style={{
            height: '100%',
            maxHeight: '400px',
            background: 'radial-gradient(50% 100% at 50% 0%, transparent 0%, transparent 50%, hsl(var(--background)) 100%)'
          }}
        />
        
        <div 
          className="absolute left-0 right-0 pointer-events-none z-10"
          style={{
            top: 0,
            bottom: 0,
            background: 'linear-gradient(to right, hsl(var(--background)) 0%, transparent 15%, transparent 85%, hsl(var(--background)) 100%)'
          }}
        />
      </div>
    </section>
  );
}
