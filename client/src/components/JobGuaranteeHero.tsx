import { HeroSection } from "@/components/career-programs/HeroSection";
import type { HeroSection as HeroSectionType } from "@shared/schema";

interface JobGuaranteeHeroProps {
  data: HeroSectionType;
  conditionsLink?: string;
}

export function JobGuaranteeHero({ data, conditionsLink }: JobGuaranteeHeroProps) {
  return (
    <section 
      className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden"
      data-testid="section-hero"
    >
      {/* MD only: simplified decorative circles */}
      <div className="hidden md:flex lg:hidden absolute left-8 top-8 flex-col gap-6">
        <div className="w-4 h-4 rounded-full bg-[#FFB718]" />
        <div className="w-4 h-4 rounded-full bg-[#1a1a1a]" />
        <div className="w-4 h-4 rounded-full bg-[#d1d5db]" />
        <div className="w-4 h-4 rounded-full bg-primary" />
      </div>

      {/* LG+: full decorative circles grid */}
      <div className="hidden lg:grid absolute left-16 top-8 grid-cols-2 gap-3">
        <div className="w-4 h-4 rounded-full bg-[#FFB718]" />
        <div />
        <div className="w-4 h-4 rounded-full bg-[#1a1a1a]" />
        <div className="w-4 h-4 rounded-full bg-[#1a1a1a]" />
        <div />
        <div className="w-4 h-4 rounded-full bg-[#d1d5db]" />
        <div className="w-4 h-4 rounded-full bg-[#d1d5db]" />
        <div />
        <div />
        <div className="w-4 h-4 rounded-full bg-[#d1d5db]" />
        <div className="w-4 h-4 rounded-full bg-primary" />
        <div />
        <div />
        <div className="w-4 h-4 rounded-full bg-[#FFB718]" />
        <div className="w-4 h-4 rounded-full bg-[#d1d5db]" />
        <div />
      </div>

      {/* MD only: smaller right circle */}
      <div className="hidden md:block lg:hidden absolute right-0 top-1/3 -translate-y-1/2">
        <div className="w-40 h-40 rounded-full bg-[#FFF1D1] translate-x-1/3" />
      </div>

      {/* LG+: large right circle with small yellow dot */}
      <div className="hidden lg:block absolute right-0 top-1/3 -translate-y-1/2">
        <div className="w-80 h-80 rounded-full bg-[#FFF1D1] translate-x-1/4" />
      </div>
      <div className="hidden lg:block absolute right-32 bottom-36">
        <div className="w-6 h-6 rounded-full bg-[#FFB718]" />
      </div>

      {/* Hero content - reusing HeroSection but overriding container */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <HeroContentOnly data={data} conditionsLink={conditionsLink} />
      </div>
    </section>
  );
}

function HeroContentOnly({ data, conditionsLink }: { data: HeroSectionType; conditionsLink?: string }) {
  return (
    <>
      <h1 
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground"
        data-testid="text-hero-title"
      >
        {data.title}
      </h1>
      
      {data.subtitle && (
        <p 
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-2"
          data-testid="text-hero-subtitle"
        >
          {data.subtitle}
        </p>
      )}

      {conditionsLink && (
        <div className="mb-6">
          <a 
            href={conditionsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-lg md:text-xl"
          >
            Conditions apply
          </a>
          <span className="text-lg md:text-xl text-muted-foreground">.</span>
        </div>
      )}
      
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        {data.cta_buttons.map((button, index) => {
          const ButtonIcon = button.icon ? getIcon(button.icon) : null;
          return (
            <a
              key={index}
              href={button.url}
              className={`inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-11 px-8 ${
                button.variant === "primary" || button.variant === "secondary"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
              data-testid={`button-hero-cta-${index}`}
            >
              {ButtonIcon}
              {button.text}
            </a>
          );
        })}
      </div>
    </>
  );
}

function getIcon(iconName: string) {
  const icons: Record<string, JSX.Element> = {
    Download: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  };
  return icons[iconName] || null;
}
