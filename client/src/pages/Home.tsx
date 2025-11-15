import Header from "@/components/Header";
import LandingHero from "@/components/LandingHero";
import LogoSection from "@/components/LogoSection";
import PersonalizedLearningSection from "@/components/PersonalizedLearningSection";
import FeatureSection from "@/components/FeatureSection";
import StatsSection from "@/components/StatsSection";
import IconFeatureGrid from "@/components/IconFeatureGrid";
import ImageTextSection from "@/components/ImageTextSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import SchemaOrg from "@/components/SchemaOrg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { IconStarFilled } from "@tabler/icons-react";
import rocketIcon from "@assets/generated_images/Rocket_launch_icon_76306c53.png";
import communityIcon from "@assets/generated_images/Community_network_icon_a5c67162.png";
import securityIcon from "@assets/generated_images/Security_shield_icon_e948888d.png";
import lightningIcon from "@assets/generated_images/Lightning_speed_icon_7822b42c.png";
import skillLearningIcon from "@assets/generated_images/Skill_learning_icon_b1295d22.png";
import toolMasteryIcon from "@assets/generated_images/Tool_mastery_icon_2e46cd62.png";
import careerIcon from "@assets/generated_images/Career_role_icon_080fe87b.png";
import collabImage from "@assets/generated_images/Students_collaborating_workspace_d1560810.png";
import teamImage from "@assets/generated_images/Tech_team_group_photo_4a9b4011.png";

export default function Home() {
  const [, setLocation] = useLocation();

  const aiAutomations = [
    {
      label: "Turn career goals into AI-guided learning plans",
      icon: rocketIcon,
      onClick: () => setLocation('/courses'),
    },
    {
      label: "Convert lecture notes into project-ready tasks",
      icon: toolMasteryIcon,
      onClick: () => console.log('Convert notes clicked'),
    },
    {
      label: "Generate interview drills from your progress gaps",
      icon: lightningIcon,
      onClick: () => console.log('Generate drills clicked'),
    },
    {
      label: "Match you with the right mentor instantly",
      icon: communityIcon,
      onClick: () => console.log('Match mentor clicked'),
    },
    {
      label: "Draft weekly skill reports for your manager",
      icon: skillLearningIcon,
      onClick: () => console.log('Draft reports clicked'),
    },
    {
      label: "Transform code reviews into practice scenarios",
      icon: securityIcon,
      onClick: () => console.log('Transform reviews clicked'),
    },
    {
      label: "Translate real projects into résumé wins",
      icon: careerIcon,
      onClick: () => console.log('Translate projects clicked'),
    },
    {
      label: "Forecast hiring-ready timelines with AI insights",
      icon: lightningIcon,
      onClick: () => console.log('Forecast timelines clicked'),
    },
  ];

  const iconFeatures = [
    {
      icon: rocketIcon,
      title: "Fast Launch",
      description: "Get started quickly with our streamlined onboarding and structured curriculum",
      color: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      icon: communityIcon,
      title: "Global Community",
      description: "Join thousands of learners worldwide on the same journey to tech mastery",
      color: "bg-green-100 dark:bg-green-900/20",
    },
    {
      icon: securityIcon,
      title: "Secure Platform",
      description: "Your progress, projects, and personal data are always protected",
      color: "bg-red-100 dark:bg-red-900/20",
    },
    {
      icon: lightningIcon,
      title: "Quick Results",
      description: "See measurable progress in weeks with our proven learning methodology",
      color: "bg-yellow-100 dark:bg-yellow-900/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SchemaOrg type="organization" />
      <SchemaOrg type="website" />
      <SchemaOrg type="educational" />
      
      <Header />
      
      <LandingHero />
      
      <LogoSection />
      
      <PersonalizedLearningSection />
      
      <FeatureSection 
        variant="notion"
        heading="Let your AI co-pilot fast-track every milestone."
        subheading="Pick a workflow and witness the platform auto-build plans, resources, and check-ins in seconds."
        ctaLabel="Explore all automations"
        ctaHref="/courses"
        actions={aiAutomations}
        decorations={[
          { src: skillLearningIcon, alt: "Skill learning icon", className: "h-14 w-14" },
          { src: toolMasteryIcon, alt: "Tool mastery icon", className: "h-16 w-16" },
          { src: rocketIcon, alt: "Rocket icon", className: "h-14 w-14" },
        ]}
      />
      
      <StatsSection />
      
      <IconFeatureGrid 
        title="Our mission is to get you into tech."
        features={iconFeatures}
      />

      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            The Key to Your Success: AI- Powered Tools and Unmatched Human Support
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card data-testid="card-ai-tools">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <img src={rocketIcon} alt="" className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">AI-Powered Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Personalized curriculum adapts to your pace and learning style
                </p>
              </CardContent>
            </Card>
            
            <Card data-testid="card-mentorship">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <img src={communityIcon} alt="" className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Expert Mentorship</h3>
                <p className="text-sm text-muted-foreground">
                  1-on-1 guidance from industry professionals with real-world experience
                </p>
              </CardContent>
            </Card>
            
            <Card data-testid="card-career-support">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <img src={lightningIcon} alt="" className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Career Support</h3>
                <p className="text-sm text-muted-foreground">
                  Job placement assistance and interview preparation included
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <ImageTextSection 
        title="Making Tech Careers Accessible"
        description="We believe everyone deserves the opportunity to build a career in technology. Our platform removes barriers with flexible learning schedules, affordable pricing options, and comprehensive support from day one to job placement. Whether you're a complete beginner or looking to level up your skills, we're here to guide you every step of the way."
        image={collabImage}
        imagePosition="left"
        ctaText="Start Your Journey"
        onCtaClick={() => {
          console.log('Start journey clicked');
          setLocation('/courses');
        }}
      />

      <ImageTextSection 
        title="Fuel Your Company's Growth with Top Early Talent"
        description="Partner with us to access a pipeline of skilled, job-ready tech professionals. Our graduates are trained in the latest technologies and best practices, ready to contribute from day one. Build your team with passionate developers who bring fresh perspectives and cutting-edge knowledge."
        image={teamImage}
        imagePosition="right"
        ctaText="Partner With Us"
        onCtaClick={() => console.log('Partner clicked')}
      />

      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Important Awards and Top Ratings</h2>
          
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStarFilled key={i} className="w-6 h-6 text-yellow-500" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">5.0 Course Report</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStarFilled key={i} className="w-6 h-6 text-yellow-500" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">4.9 SwitchUp</p>
            </div>
            
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">Best Coding Bootcamp</p>
              <p className="text-sm text-muted-foreground">2024 Awards</p>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection testimonials={[
        {
          id: '1',
          name: 'Sarah Johnson',
          role: 'Software Engineer at Google',
          course: 'Full Stack Web Development',
          rating: 5,
          comment: 'This course completely transformed my career. The instructors are incredibly knowledgeable and the curriculum is perfectly structured for real-world applications.',
        },
        {
          id: '2',
          name: 'Michael Chen',
          role: 'Data Analyst at Meta',
          course: 'Data Science & Analytics',
          rating: 5,
          comment: 'Best investment I ever made. Got a job offer before even finishing the program! The mentorship and career support were invaluable.',
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          role: 'ML Engineer at Amazon',
          course: 'AI & Machine Learning',
          rating: 5,
          comment: 'Excellent content and great support from mentors. The projects were challenging but rewarding, and now I\'m working on cutting-edge AI.',
        },
        {
          id: '4',
          name: 'David Kim',
          role: 'Full Stack Developer',
          course: 'Full Stack Web Development',
          rating: 5,
          comment: 'From zero coding knowledge to landing my dream job in 4 months. The structured curriculum and hands-on projects made all the difference.',
        },
        {
          id: '5',
          name: 'Jessica Martinez',
          role: 'Frontend Developer at Spotify',
          course: 'Full Stack Web Development',
          rating: 4,
          comment: 'Great course with practical, real-world projects. The community is supportive and the instructors are always available to help.',
        },
        {
          id: '6',
          name: 'Ryan Thompson',
          role: 'Data Scientist',
          course: 'Data Science & Analytics',
          rating: 5,
          comment: 'The best online learning experience I\'ve had. Clear explanations, practical exercises, and excellent career guidance throughout.',
        },
      ]} />

      <footer className="bg-muted/30 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Our Story</a></li>
                <li><a href="#" className="hover:text-foreground">Team</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Programs</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Full Stack</a></li>
                <li><a href="#" className="hover:text-foreground">Data Science</a></li>
                <li><a href="#" className="hover:text-foreground">AI & ML</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">FAQ</a></li>
                <li><a href="#" className="hover:text-foreground">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>hello@aireskill.com</li>
                <li>1-800-RESKILL</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 The AI Reskilling Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
