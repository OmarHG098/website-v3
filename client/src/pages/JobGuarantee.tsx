import Header from "@/components/Header";
import GrowthChart from "@/components/job-guarantee/GrowthChart";

export default function JobGuarantee() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-8">
          <h1 className="text-3xl font-bold text-center">Job Guarantee Page</h1>
          <p className="text-muted-foreground text-center">Testing the GrowthChart SVG component</p>
          
          <div className="flex flex-wrap gap-8 items-end justify-center">
            <div className="text-center">
              <GrowthChart />
              <p className="mt-2 text-sm text-muted-foreground">Default (89x93, green)</p>
            </div>
            
            <div className="text-center">
              <GrowthChart width="120px" height="125px" color="#2563EB" />
              <p className="mt-2 text-sm text-muted-foreground">Larger, blue</p>
            </div>
            
            <div className="text-center">
              <GrowthChart width="60px" height="63px" color="#8B5CF6" />
              <p className="mt-2 text-sm text-muted-foreground">Smaller, purple</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
