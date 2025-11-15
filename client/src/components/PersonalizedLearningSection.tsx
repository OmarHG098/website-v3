import { useTranslation } from 'react-i18next';
import student1 from "@assets/generated_images/Woman_profile_headshot_1_608aff01.png";
import student2 from "@assets/generated_images/Man_profile_headshot_1_0850c276.png";
import student3 from "@assets/generated_images/Woman_coding_portrait_fa2041e2.png";
import student4 from "@assets/generated_images/Man_profile_headshot_2_516b72e4.png";

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
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-7xl mx-auto">
          {/* Left: Student Images */}
          <div className="flex-1 flex gap-4 justify-center">
            {studentImages.map((image, index) => (
              <div
                key={index}
                className="w-24 md:w-32 lg:w-40 flex-shrink-0"
                data-testid={`img-student-${index + 1}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Right: Blue Message Box */}
          <div className="flex-1 bg-primary text-primary-foreground p-8 md:p-12 rounded-lg" data-testid="box-personalized-message">
            <p className="text-lg md:text-xl mb-4 font-light">
              {t('personalized.heading')}
            </p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              {t('personalized.mainText')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
