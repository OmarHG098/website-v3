import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { IconFileDownload } from "@tabler/icons-react";

export default function JobGuarantee() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section 
          className="py-20 md:py-32 bg-gradient-to-b from-primary/10 via-primary/5 to-background"
          data-testid="section-job-guarantee-hero"
        >
          <div className="container mx-auto px-4 text-center">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground uppercase tracking-tight"
              data-testid="text-hero-title"
            >
              Get Into Tech With Our{" "}
              <span className="text-primary">Job Guarantee</span>
            </h1>
            
            <p 
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
              data-testid="text-hero-subtitle"
            >
              Your success is our mission — Get hired within 9 months of graduation, 
              or we will refund your tuition.{" "}
              <a 
                href="#" 
                className="text-primary hover:underline"
                data-testid="link-conditions"
              >
                Conditions apply
              </a>.
            </p>
            
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              data-testid="button-request-syllabus"
            >
              <IconFileDownload className="mr-2" size={20} />
              Request a Syllabus
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
