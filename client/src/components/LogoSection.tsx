import { useTranslation } from "react-i18next";
import forbesLogo from "@assets/forbes-new.avif";
import clarkLogo from "@assets/clark-new.avif";
import badgesImage from "@assets/badges-new.avif";
import { AwardBadges, type AwardBadgeItem } from "@/components/AwardBadges";

export default function LogoSection() {
  const { t } = useTranslation();

  const awardItems: AwardBadgeItem[] = [
    {
      id: "forbes",
      logo: forbesLogo,
      alt: "Forbes",
      logoHeight: "64px",
      description: t("logo.forbesDescription"),
      link: "#",
      linkText: t("logo.forbesLink"),
    },
    {
      id: "clark",
      logo: clarkLogo,
      alt: "Clark University",
      logoHeight: "64px",
      description: t("logo.clarkSubtitle"),
      link: "#",
      linkText: t("logo.forbesLink"),
    },
    {
      id: "badges",
      logo: badgesImage,
      alt: "Award Badges - Best Coding Bootcamp",
      logoHeight: "96px",
      description: t("logo.awardsText"),
      link: "#",
      linkText: t("logo.forbesLink"),
    },
  ];

  return (
    <section>
      <div className="container mx-auto px-4 mt-12">
        <AwardBadges items={awardItems} variant="detailed" />
      </div>
    </section>
  );
}
