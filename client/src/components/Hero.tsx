import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import heroImage from "@assets/generated_images/Hero_image_students_learning_437ba36d.png";

export default function Hero() {
  return (
    <section className="relative h-[500px] w-full overflow-hidden">
      <img 
        src={heroImage} 
        alt="Students learning together" 
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
      
      <div className="container relative mx-auto flex h-full max-w-6xl items-center px-4">
        <div className="max-w-2xl text-white">
          <h1 className="text-h1 tracking-tight">
            Master AI Skills for the Future
          </h1>
          <p className="mt-4 text-body text-white/90">
            Transform your career with personalized learning paths designed by industry experts. 
            Start your journey today.
          </p>
          <div className="mt-8 flex gap-4">
            <Button 
              size="lg" 
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
              data-testid="button-get-started"
            >
              Get Started
              <IconArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
              data-testid="button-explore-courses"
            >
              Explore Courses
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
