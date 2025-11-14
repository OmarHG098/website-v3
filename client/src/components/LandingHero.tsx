import { Button } from "@/components/ui/button";
import collabImage from "@assets/generated_images/Students_collaborating_workspace_d1560810.png";
import happyDevImage from "@assets/generated_images/Happy_developer_portrait_1d924db5.png";
import womanCodingImage from "@assets/generated_images/Woman_coding_portrait_fa2041e2.png";

export default function LandingHero() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="text-primary">Build your Freedom.</span>
          <br />
          <span className="text-foreground">Tech is where it's at</span>
        </h1>
        
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <img src={collabImage} alt="Student 1" className="w-32 h-32 rounded-lg object-cover" />
          <img src={happyDevImage} alt="Student 2" className="w-32 h-32 rounded-lg object-cover" />
          <img src={womanCodingImage} alt="Student 3" className="w-32 h-32 rounded-lg object-cover" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold">
            Welcome to the best personal tech Learning.
            <br />
            <span className="text-primary">Progress Like Never Before.</span>
          </h2>
        </div>
        
        <div className="bg-primary text-primary-foreground rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">YES, you can LEARN!</h3>
          <p className="text-lg mb-6">
            COURSE with your college or university and get on a earning track
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90"
            data-testid="button-start-learning"
          >
            Start Learning
          </Button>
        </div>
      </div>
    </section>
  );
}
