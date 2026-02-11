import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { UniversalImage } from "@/components/UniversalImage";
import { IconChevronLeft, IconChevronRight, IconBrandLinkedin } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import type { ProfilesCarouselSection, ProfileCard } from "@shared/schema";

interface ProfilesCarouselProps {
  data: ProfilesCarouselSection;
}

function ProfileCardItem({ profile }: { profile: ProfileCard }) {
  const isRound = profile.image_round === true;

  return (
    <div
      className="flex flex-col items-center text-center flex-shrink-0 w-[220px] md:w-[240px]"
      data-testid={`profile-card-${profile.name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div
        className={cn(
          "w-full aspect-[3/4] mb-4 overflow-hidden flex items-center justify-center",
          isRound ? "bg-transparent" : "bg-muted rounded-lg"
        )}
        data-testid="profile-image-container"
      >
        {profile.image_id ? (
          <UniversalImage
            id={profile.image_id}
            alt={profile.name}
            className={cn(
              isRound
                ? "w-32 h-32 rounded-full object-cover"
                : "w-full h-full object-cover"
            )}
            data-testid="img-profile"
          />
        ) : (
          <div
            className={cn(
              "flex items-center justify-center bg-muted text-muted-foreground text-3xl font-bold",
              isRound
                ? "w-32 h-32 rounded-full"
                : "w-full h-full rounded-lg"
            )}
          >
            {profile.name.charAt(0)}
          </div>
        )}
      </div>

      <h3 className="text-base font-semibold text-foreground" data-testid="text-profile-name">
        {profile.name}
      </h3>

      {profile.role && (
        <p className="text-sm text-muted-foreground mt-0.5" data-testid="text-profile-role">
          {profile.role}
        </p>
      )}

      {profile.description && (
        <p className="text-sm text-muted-foreground mt-2 line-clamp-3" data-testid="text-profile-description">
          {profile.description}
        </p>
      )}

      {profile.linkedin_url && (
        <a
          href={profile.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-muted-foreground transition-colors hover:text-foreground"
          data-testid="link-profile-linkedin"
        >
          <IconBrandLinkedin className="w-5 h-5" />
        </a>
      )}
    </div>
  );
}

export function ProfilesCarousel({ data }: ProfilesCarouselProps) {
  const { profiles, heading, description } = data;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 260;
    el.scrollBy({
      left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
      behavior: "smooth",
    });
    setTimeout(updateScrollState, 350);
  }, [updateScrollState]);

  return (
    <section
      className="w-full"
      style={data.background ? { background: data.background } : undefined}
      data-testid="section-profiles-carousel"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {(heading || description) && (
          <div className="text-center mb-10">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3" data-testid="text-profiles-heading">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-profiles-description">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="relative">
          {canScrollLeft && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => scroll("left")}
                className="rounded-full bg-background/80 backdrop-blur-sm"
                data-testid="button-scroll-left"
              >
                <IconChevronLeft className="w-5 h-5" />
              </Button>
            </div>
          )}

          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="flex gap-6 overflow-x-auto scrollbar-hide py-2 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {profiles.map((profile, i) => (
              <ProfileCardItem key={i} profile={profile} />
            ))}
          </div>

          {canScrollRight && profiles.length > 4 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => scroll("right")}
                className="rounded-full bg-background/80 backdrop-blur-sm"
                data-testid="button-scroll-right"
              >
                <IconChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProfilesCarousel;
