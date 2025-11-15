import { useTranslation } from 'react-i18next';
import forbesLogo from "@assets/forbes-new.avif";
import clarkLogo from "@assets/clark-new.avif";
import badgesImage from "@assets/badges-new.avif";

export default function LogoSection() {
  const { t } = useTranslation();
  
  return (
    <section className="bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-7xl mx-auto">
          {/* Forbes Section */}
          <div className="text-center flex flex-col items-center">
            <img 
              src={forbesLogo} 
              alt="Forbes" 
              className="h-16 w-auto object-contain mb-4"
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

          {/* Badges/Awards Section */}
          <div className="text-center flex flex-col items-center">
            <div className="flex justify-center gap-4 mb-4">
              <img 
                src={badgesImage} 
                alt="Award Badges - Best Coding Bootcamp" 
                className="h-24 w-auto object-contain"
                loading="lazy"
                data-testid="img-award-badges"
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
        </div>
      </div>
    </section>
  );
}
