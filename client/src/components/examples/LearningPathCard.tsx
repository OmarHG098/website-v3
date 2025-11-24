import LearningPathCard from '../LearningPathCard';
import careerIcon from "@assets/generated_images/Career_role_icon_080fe87b.webp";

export default function LearningPathCardExample() {
  return (
    <div className="p-8 bg-background">
      <LearningPathCard 
        title="I want to become a Developer"
        description="Follow a structured path to become a professional software developer"
        icon={careerIcon}
        onClick={() => console.log('Career path selected')}
      />
    </div>
  );
}
