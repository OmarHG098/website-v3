import ImageTextSection from '../ImageTextSection';
import teamImage from "@assets/generated_images/Tech_team_group_photo_4a9b4011.webp";

export default function ImageTextSectionExample() {
  return (
    <div className="bg-background">
      <ImageTextSection 
        title="Making Tech Careers Accessible"
        description="We believe everyone deserves the opportunity to build a career in technology. Our platform removes barriers with flexible learning schedules, affordable pricing, and comprehensive support from day one to job placement."
        image={teamImage}
        imagePosition="left"
        ctaText="Learn More"
        onCtaClick={() => console.log('CTA clicked')}
      />
    </div>
  );
}
