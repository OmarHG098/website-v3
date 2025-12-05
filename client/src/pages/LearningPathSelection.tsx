import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconBriefcase, IconTrendingUp, IconTool, IconArrowRight } from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: Icon;
  route: string;
}

export default function LearningPathSelection() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  const learningPaths: LearningPath[] = [
    {
      id: "career-paths",
      title: "Career Paths",
      description: "Develop or transition into a specific professional role.",
      icon: IconBriefcase,
      route: "/career-paths"
    },
    {
      id: "skill-boosters",
      title: "Skill Boosters",
      description: "Level up fast with targeted, practical abilities.",
      icon: IconTrendingUp,
      route: "/skill-boosters"
    },
    {
      id: "tool-mastery",
      title: "Tool Mastery",
      description: "Become highly effective with a specific software or platform.",
      icon: IconTool,
      route: "/tool-mastery"
    }
  ];

  const handlePathSelect = (route: string) => {
    setLocation(route);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Learning Path
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the path that best matches your goals. Each journey is powered by AI and supported by expert human mentors.
            </p>
          </div>

          {/* Learning Path Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {learningPaths.map((path) => {
              const IconComponent = path.icon;
              return (
                <Card
                  key={path.id}
                  className="hover-elevate active-elevate-2 cursor-pointer transition-all"
                  onClick={() => handlePathSelect(path.route)}
                  data-testid={`card-${path.id}`}
                >
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl mb-2">{path.title}</CardTitle>
                    <CardDescription className="text-base">
                      {path.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between group"
                      data-testid={`button-select-${path.id}`}
                    >
                      <span>Get Started</span>
                      <IconArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Not sure which path to choose? Our AI advisor can help you find the perfect fit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
