import IconFeatureGrid from '../IconFeatureGrid';
import rocketIcon from "@assets/generated_images/Rocket_launch_icon_76306c53.webp";
import communityIcon from "@assets/generated_images/Community_network_icon_a5c67162.webp";
import securityIcon from "@assets/generated_images/Security_shield_icon_e948888d.webp";
import lightningIcon from "@assets/generated_images/Lightning_speed_icon_7822b42c.webp";

export default function IconFeatureGridExample() {
  const features = [
    {
      icon: rocketIcon,
      title: "Fast Launch",
      description: "Get started quickly with our streamlined onboarding process",
      color: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      icon: communityIcon,
      title: "Community",
      description: "Join thousands of learners on the same journey",
      color: "bg-green-100 dark:bg-green-900/20",
    },
    {
      icon: securityIcon,
      title: "Secure Learning",
      description: "Your progress and data are always protected",
      color: "bg-red-100 dark:bg-red-900/20",
    },
    {
      icon: lightningIcon,
      title: "Quick Results",
      description: "See measurable progress in weeks, not years",
      color: "bg-yellow-100 dark:bg-yellow-900/20",
    },
  ];

  return (
    <div className="bg-background">
      <IconFeatureGrid 
        title="Our mission is to get you into tech."
        features={features}
      />
    </div>
  );
}
