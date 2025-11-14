import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconStarFilled, IconStar } from "@tabler/icons-react";
import collabImage from "@assets/generated_images/Students_collaborating_workspace_d1560810.png";
import happyDevImage from "@assets/generated_images/Happy_developer_portrait_1d924db5.png";
import womanCodingImage from "@assets/generated_images/Woman_coding_portrait_fa2041e2.png";
import teamImage from "@assets/generated_images/Tech_team_group_photo_4a9b4011.png";
import avatar1 from "@assets/generated_images/Woman_profile_headshot_1_608aff01.png";
import avatar2 from "@assets/generated_images/Man_profile_headshot_1_0850c276.png";
import avatar3 from "@assets/generated_images/Woman_profile_headshot_2_a0ea2c29.png";
import avatar4 from "@assets/generated_images/Man_profile_headshot_2_516b72e4.png";

export default function LandingHero() {
  return (
    <section className="relative container mx-auto px-4 py-16 md:py-24 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-8 items-center max-w-7xl mx-auto">
        {/* Left Images Column */}
        <div className="relative h-[300px] lg:h-[500px] hidden lg:block">
          {/* Photo Card 1 - Top */}
          <div 
            className="absolute top-0 left-0 w-56 transform -rotate-6 transition-transform hover:rotate-0 hover:scale-105 z-20"
            style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
          >
            <img 
              src={collabImage} 
              alt="Student learning" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
          
          {/* Photo Card 2 - Bottom */}
          <div 
            className="absolute bottom-0 right-0 w-56 transform rotate-3 transition-transform hover:rotate-0 hover:scale-105 z-10"
            style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
          >
            <img 
              src={happyDevImage} 
              alt="Happy developer" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Content Column (Center) */}
        <div className="z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-primary">Build your Freedom,</span>{" "}
            <span className="text-foreground">Tech is where it's at</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Learn smarter with AI tools, real-time feedback, and expert guidance
            all with a money-back guarantee.
          </p>
          
          {/* Ratings Bar */}
          <div className="flex flex-col items-start gap-3 mb-8 mx-auto">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4].map((i) => (
                  <IconStarFilled key={i} className="text-yellow-500 w-5 h-5" />
                ))}
                <IconStar className="text-yellow-500 w-5 h-5" />
              </div>
              <span className="font-semibold">4.5</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={avatar1} alt="Sarah J." />
                  <AvatarFallback className="bg-primary/20 text-xs">SJ</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={avatar2} alt="Michael C." />
                  <AvatarFallback className="bg-blue-500/20 text-xs">MC</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={avatar3} alt="Emily R." />
                  <AvatarFallback className="bg-green-500/20 text-xs">ER</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={avatar4} alt="David K." />
                  <AvatarFallback className="bg-purple-500/20 text-xs">DK</AvatarFallback>
                </Avatar>
              </div>
              <span className="text-sm text-muted-foreground">Trusted by 2.5K+ learners</span>
            </div>
          </div>
          
          {/* CTA with Arrow */}
          <div className="relative inline-block">
            <Button 
              size="lg" 
              className="text-lg px-8"
              data-testid="button-choose-path"
            >
              Choose your path
            </Button>
            
            {/* Hand-drawn arrow - hidden on mobile */}
            <div className="hidden lg:block absolute -bottom-12 left-1/2 -translate-x-1/2">
              <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M40 5 Q 30 25, 35 40 L 35 45 M 35 45 L 30 40 M 35 45 L 40 40" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-foreground/60"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Images Column */}
        <div className="relative h-[300px] lg:h-[500px] hidden lg:block">
          {/* Photo Card 3 - Top */}
          <div 
            className="absolute top-0 right-0 w-56 transform rotate-6 transition-transform hover:rotate-0 hover:scale-105 z-30"
            style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
          >
            <img 
              src={womanCodingImage} 
              alt="Woman coding" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
          
          {/* Photo Card 4 - Bottom */}
          <div 
            className="absolute bottom-0 left-0 w-56 transform -rotate-3 transition-transform hover:rotate-0 hover:scale-105 z-20"
            style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
          >
            <img 
              src={teamImage} 
              alt="Tech team" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
      
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5 pointer-events-none -z-10"></div>
    </section>
  );
}
