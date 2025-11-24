import { useTranslation } from 'react-i18next';
import forbesLogo from "@assets/forbes-new.avif";
import clarkLogo from "@assets/clark-new.avif";
import badgesImage from "@assets/badges-new.avif";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export default function LogoSection() {
  const { t } = useTranslation();

  const achievementItems = [
    {
      id: 'forbes',
      logo: forbesLogo,
      alt: 'Forbes',
      logoHeight: 'h-16',
      description: t('logo.forbesDescription'),
      linkTestId: 'link-forbes-articles',
      imgTestId: 'img-forbes-logo',
    },
    {
      id: 'clark',
      logo: clarkLogo,
      alt: 'Clark University',
      logoHeight: 'h-16',
      description: t('logo.clarkSubtitle'),
      linkTestId: 'link-clark-articles',
      imgTestId: 'img-clark-logo',
    },
    {
      id: 'badges',
      logo: badgesImage,
      alt: 'Award Badges - Best Coding Bootcamp',
      logoHeight: 'h-24',
      description: t('logo.awardsText'),
      linkTestId: 'link-awards-articles',
      imgTestId: 'img-award-badges',
    },
  ];

  const AchievementCard = ({ item }: { item: typeof achievementItems[0] }) => (
    <div className="text-center flex flex-col items-center">
      <img 
        src={item.logo} 
        alt={item.alt} 
        className={`${item.logoHeight} w-auto object-contain mb-4`}
        loading="lazy"
        data-testid={item.imgTestId}
      />
      <p className="text-sm text-muted-foreground mb-4 max-w-xs">
        {item.description}
      </p>
      <a 
        href="#" 
        className="text-sm text-primary font-medium hover:underline"
        data-testid={item.linkTestId}
      >
        {t('logo.forbesLink')}
      </a>
    </div>
  );
  
  return (
    <section>
      <div className="container mx-auto px-4">
        {/* Mobile Carousel */}
        <div className="md:hidden relative px-12">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full max-w-sm mx-auto"
          >
            <CarouselContent>
              {achievementItems.map((item) => (
                <CarouselItem key={item.id}>
                  <AchievementCard item={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious 
              className="!left-0 !top-8 !-translate-y-0"
              data-testid="button-achievement-prev" 
            />
            <CarouselNext 
              className="!right-0 !top-8 !-translate-y-0"
              data-testid="button-achievement-next" 
            />
          </Carousel>
        </div>

        {/* Desktop Horizontal Layout */}
        <div className="hidden md:flex justify-center items-center gap-8 max-w-7xl mx-auto">
          {achievementItems.map((item) => (
            <AchievementCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
