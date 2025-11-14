import FeatureSection from '../FeatureSection';

export default function FeatureSectionExample() {
  const features = [
    {
      title: "Head Digital",
      description: "Our AI-powered learning assistant provides personalized guidance throughout your journey, helping you stay on track and overcome challenges.",
    },
    {
      title: "Unlimited Human Support",
      description: "Connect with experienced mentors and instructors who are dedicated to your success. Get help whenever you need it, no limits.",
    },
  ];

  return (
    <div className="bg-background">
      <FeatureSection features={features} />
    </div>
  );
}
