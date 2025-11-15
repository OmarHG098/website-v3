import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconArrowLeft, IconBriefcase } from "@tabler/icons-react";

export default function CareerPaths() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => setLocation('/learning-paths')}
            className="mb-8"
            data-testid="button-back"
          >
            <IconArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Paths
          </Button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center">
              <IconBriefcase className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Career Paths</h1>
              <p className="text-lg text-muted-foreground">
                Develop or transition into a specific professional role
              </p>
            </div>
          </div>

          {/* Placeholder Content */}
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                We're building an amazing career path experience for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This section will help you explore and pursue specific professional roles in technology. 
                Our AI-powered platform will guide you through structured learning paths designed to prepare 
                you for careers such as:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>Full Stack Developer</li>
                <li>Data Scientist</li>
                <li>Cloud Engineer</li>
                <li>DevOps Specialist</li>
                <li>Machine Learning Engineer</li>
                <li>And many more...</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Check back soon for personalized career recommendations based on your goals and experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
