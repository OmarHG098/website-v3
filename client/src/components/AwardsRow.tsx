import { Link } from "wouter";
import { IconArrowRight } from "@tabler/icons-react";
import { AwardBadges, type AwardBadgeItem } from "@/components/AwardBadges";

import forbesLogo from "@assets/forbes-logo-award_1764709625651.webp";
import fortuneLogo from "@assets/fortune-logo_1764709618095.webp";
import newsweekLogo from "@assets/newsweek_1764709608255.webp";
import courseReportLogo from "@assets/Course-Report-Badge-2025_1764709632231.webp";

const awardLogos: Record<string, string> = {
  Forbes: forbesLogo,
  Fortune: fortuneLogo,
  Newsweek: newsweekLogo,
  "Course Report": courseReportLogo,
};

export interface AwardBadgeData {
  name: string;
  source: string;
  year?: string;
}

export interface AwardsRowData {
  title?: string;
  subtitle?: string;
  background?: string;
  link_text?: string;
  link_url?: string;
  badges?: AwardBadgeData[];
}

interface AwardsRowProps {
  data: AwardsRowData;
}

const defaultBadges: AwardBadgeData[] = [
  { name: "Top Coding Bootcamp", source: "Forbes", year: "2024" },
  { name: "Best for Spanish Speakers", source: "Fortune", year: "2024" },
  { name: "Top Coding Bootcamp", source: "Newsweek", year: "2024" },
  { name: "Best Coding Bootcamp", source: "Course Report", year: "2025" },
];

export default function AwardsRow({ data }: AwardsRowProps) {
  const badges = data.badges && data.badges.length > 0 ? data.badges : defaultBadges;
  
  const awardItems: AwardBadgeItem[] = badges.map((badge, index) => ({
    id: `${badge.source}-${index}`,
    logo: awardLogos[badge.source],
    alt: `${badge.source} - ${badge.name}`,
    source: badge.source,
    name: badge.name,
    year: badge.year,
  }));

  return (
    <section 
      className={`py-section ${data.background === 'muted' ? 'bg-muted' : ''}`}
      data-testid="section-awards-row"
    >
      <div className="max-w-6xl mx-auto px-4">
        {(data.title || data.subtitle) && (
          <div className="text-center mb-8">
            {data.title && (
              <h2 
                className="text-h2 mb-3 text-foreground"
                data-testid="text-awards-row-title"
              >
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                {data.subtitle}
              </p>
            )}
          </div>
        )}

        <AwardBadges items={awardItems} variant="simple" />

        {data.link_url && (
          <div className="text-center mt-8">
            <Link 
              href={data.link_url}
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              data-testid="link-awards-see-more"
            >
              {data.link_text || "See more"}
              <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
