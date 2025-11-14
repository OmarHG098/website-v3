export default function LogoSection() {
  return (
    <section className="border-y bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Forbes Section */}
          <div className="text-center md:text-left">
            <h3 className="text-5xl font-bold font-serif mb-4">Forbes</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto md:mx-0">
              4Geeks is included by Forbes in "5 Coding bootcamps to consider"
            </p>
            <a 
              href="#" 
              className="text-sm text-primary font-medium hover:underline"
              data-testid="link-forbes-articles"
            >
              See articles
            </a>
          </div>

          {/* Clark University Section */}
          <div className="text-center">
            <h3 className="text-3xl font-bold tracking-wider mb-4">
              CLARK
              <br />
              UNIVERSITY
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
              We are certified by the most recognized universities
            </p>
            <a 
              href="#" 
              className="text-sm text-primary font-medium hover:underline"
              data-testid="link-clark-articles"
            >
              See articles
            </a>
          </div>

          {/* Badges/Awards Section */}
          <div className="text-center md:text-right">
            <div className="flex justify-center md:justify-end gap-4 mb-4">
              {/* Badge placeholders - can be replaced with actual badge images */}
              <div className="w-20 h-24 border-2 border-primary/20 rounded-lg flex items-center justify-center bg-background">
                <div className="text-xs font-bold text-center px-2">
                  2025
                  <br />
                  TOP
                  <br />
                  BOOTCAMPS
                </div>
              </div>
              <div className="w-24 h-24 border-2 border-chart-2/20 rounded-full flex items-center justify-center bg-background">
                <div className="text-xs font-bold text-center">
                  BEST
                  <br />
                  CODING
                  <br />
                  BOOTCAMP
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto md:mx-0 md:ml-auto">
              Recognized in 2024 and 2025 by SwitchUp, Course Report, and Forbes. 
              Continuing our legacy as one of the top coding bootcamps in the world.
            </p>
            <a 
              href="#" 
              className="text-sm text-primary font-medium hover:underline"
              data-testid="link-awards-articles"
            >
              See articles
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
