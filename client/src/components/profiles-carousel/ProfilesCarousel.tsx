import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { UniversalImage } from "@/components/UniversalImage";
import { IconChevronLeft, IconChevronRight, IconBrandLinkedin } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import type { ProfilesCarouselSection, ProfileCard } from "@shared/schema";

interface ProfilesCarouselProps {
  data: ProfilesCarouselSection;
}

const PROFILES_PER_PAGE = 5;

function ProfileCardItem({ profile, isRound }: { profile: ProfileCard; isRound: boolean }) {
  return (
    <div
      className="flex flex-col items-center text-center flex-1 min-w-0"
      data-testid={`profile-card-${profile.name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div
        className={cn(
          "mb-4 overflow-hidden flex items-center justify-center h-[100px]",
          isRound
            ? "w-28 h-28 rounded-full"
            : "w-full aspect-[3/4] rounded-lg bg-muted"
        )}
        data-testid="profile-image-container"
      >
        {profile.image_id ? (
          <UniversalImage
            id={profile.image_id}
            alt={profile.name}
            className="w-full h-full"
            data-testid="img-profile"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-3xl font-bold">
            {profile.name.charAt(0)}
          </div>
        )}
      </div>

      <h3 className="text-base font-semibold text-foreground" data-testid="text-profile-name">
        {profile.name}
      </h3>
      {/* test */}
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
  const isRound = data.image_round === true;
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = useMemo(() => Math.ceil(profiles.length / PROFILES_PER_PAGE), [profiles.length]);

  const currentProfiles = useMemo(
    () => profiles.slice(currentPage * PROFILES_PER_PAGE, (currentPage + 1) * PROFILES_PER_PAGE),
    [profiles, currentPage]
  );

  const goTo = (page: number) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  };

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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {currentProfiles.map((profile, i) => (
            <ProfileCardItem key={currentPage * PROFILES_PER_PAGE + i} profile={profile} isRound={isRound} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8" data-testid="carousel-controls">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 0}
              data-testid="button-page-prev"
            >
              <IconChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-2" data-testid="carousel-dots">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-colors duration-200",
                    i === currentPage ? "bg-primary" : "bg-border"
                  )}
                  data-testid={`button-dot-${i}`}
                />
              ))}
            </div>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              data-testid="button-page-next"
            >
              <IconChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProfilesCarousel;
