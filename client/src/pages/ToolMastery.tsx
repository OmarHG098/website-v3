import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconArrowLeft, IconTool } from "@tabler/icons-react";

export default function ToolMastery() {
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
              <IconTool className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Tool Mastery</h1>
              <p className="text-lg text-muted-foreground">
                Become highly effective with specific software or platforms
              </p>
            </div>
          </div>

          {/* Placeholder Content */}
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                We're preparing comprehensive tool mastery programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This section will provide deep-dive training on popular tools and platforms used by 
                professional developers. Master the technologies that matter most in modern software development:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>Git & GitHub Advanced Workflows</li>
                <li>Docker & Kubernetes</li>
                <li>AWS, Azure, or Google Cloud</li>
                <li>React, Vue, or Angular Frameworks</li>
                <li>VS Code Power User Techniques</li>
                <li>CI/CD Pipelines (Jenkins, GitHub Actions)</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                We'll help you go from beginner to expert with interactive tutorials and real-world projects.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
