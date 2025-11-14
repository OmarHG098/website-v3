import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CourseProgress {
  id: string;
  title: string;
  progress: number;
  thumbnail: string;
}

interface ProgressCardProps {
  courses: CourseProgress[];
}

export default function ProgressCard({ courses }: ProgressCardProps) {
  return (
    <Card data-testid="card-progress">
      <CardHeader>
        <CardTitle className="text-lg">Current Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {courses.map((course) => (
          <div key={course.id} className="space-y-2">
            <div className="flex items-center gap-3">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="h-12 w-12 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{course.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={course.progress} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{course.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
