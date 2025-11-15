import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconArrowLeft, IconTrendingUp } from "@tabler/icons-react";

export default function SkillBoosters() {
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
              <IconTrendingUp className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Skill Boosters</h1>
              <p className="text-lg text-muted-foreground">
                Level up fast with targeted, practical abilities
              </p>
            </div>
          </div>

          {/* Placeholder Content */}
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                We're crafting focused learning modules to boost your skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This section will offer targeted micro-learning experiences to rapidly develop specific 
                technical abilities. Get job-ready skills through practical, hands-on training in areas like:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>API Development & Integration</li>
                <li>Database Design & Optimization</li>
                <li>Front-End Performance</li>
                <li>Testing & Quality Assurance</li>
                <li>Security Best Practices</li>
                <li>Agile & Project Management</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Soon you'll be able to select individual skills to master and track your progress in real-time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
