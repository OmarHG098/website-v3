import { useTranslation } from 'react-i18next';
import student1 from "@assets/student-1-asian.png";
import student2 from "@assets/student-2-latin.png";
import student3 from "@assets/student-3-african.png";
import student4 from "@assets/student-4-lady-latin.png";

export default function PersonalizedLearningSection() {
  const { t } = useTranslation();
  
  const studentImages = [
    { src: student1, alt: t('personalized.altStudent1') },
    { src: student2, alt: t('personalized.altStudent2') },
    { src: student3, alt: t('personalized.altStudent3') },
    { src: student4, alt: t('personalized.altStudent4') },
  ];
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 max-w-7xl mx-auto">
          {/* Blue Message Box - appears first on mobile */}
          <div className="bg-primary text-primary-foreground p-8 md:p-12 rounded-lg flex flex-col justify-center md:hidden" data-testid="box-personalized-message">
            <p className="text-lg md:text-xl mb-4 font-light">
              {t('personalized.heading')}
            </p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              {t('personalized.mainText')}
            </p>
          </div>

          {/* Images row */}
          <div className="flex flex-row items-stretch gap-4 h-48 md:h-[26rem]">
            {/* Student Images - 4 columns */}
            {studentImages.map((image, index) => (
              <div
                key={index}
                className="flex-1 min-w-0"
                data-testid={`img-student-${index + 1}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            ))}

            {/* Blue Message Box - 5th column, desktop only */}
            <div className="hidden md:flex flex-1 bg-primary text-primary-foreground p-8 md:p-12 rounded-lg flex-col justify-center" data-testid="box-personalized-message-desktop">
              <p className="text-lg md:text-xl mb-4 font-light">
                {t('personalized.heading')}
              </p>
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                {t('personalized.mainText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
