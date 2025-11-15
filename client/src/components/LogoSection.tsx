import { useTranslation } from 'react-i18next';
import forbesLogo from "@assets/forbes-logo.avif";
import clarkLogo from "@assets/clark-logo.avif";
import bestBootcampBadge from "@assets/best-bootcamp-badge.avif";

export default function LogoSection() {
  const { t } = useTranslation();
  
  return (
    <section className="border-y bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          {/* Badges/Awards Section */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <div className="flex justify-center md:justify-start gap-4 mb-4">
              <img 
                src={bestBootcampBadge} 
                alt="Best Coding Bootcamp Award" 
                className="h-24 w-auto object-contain"
                loading="lazy"
                data-testid="img-best-bootcamp-badge"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              {t('logo.awardsText')}
            </p>
            <a 
              href="#" 
              className="text-sm text-primary font-medium hover:underline"
              data-testid="link-awards-articles"
            >
              {t('logo.forbesLink')}
            </a>
          </div>

          {/* Clark University Section */}
          <div className="text-center flex flex-col items-center">
            <img 
              src={clarkLogo} 
              alt="Clark University" 
              className="h-16 w-auto object-contain mb-4"
              loading="lazy"
              data-testid="img-clark-logo"
            />
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              {t('logo.clarkSubtitle')}
            </p>
            <a 
              href="#" 
              className="text-sm text-primary font-medium hover:underline"
              data-testid="link-clark-articles"
            >
              {t('logo.forbesLink')}
            </a>
          </div>

          {/* Forbes Section */}
          <div className="text-center md:text-right flex flex-col items-center md:items-end">
            <img 
              src={forbesLogo} 
              alt="Forbes" 
              className="h-12 w-auto object-contain mb-4"
              loading="lazy"
              data-testid="img-forbes-logo"
            />
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              {t('logo.forbesDescription')}
            </p>
            <a 
              href="#" 
              className="text-sm text-primary font-medium hover:underline"
              data-testid="link-forbes-articles"
            >
              {t('logo.forbesLink')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
