import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen } from "lucide-react";

interface CourseCardProps {
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  progress?: number;
  lessons?: number;
  onClick?: () => void;
}

export default function CourseCard({ 
  title, 
  description, 
  thumbnail, 
  duration, 
  difficulty, 
  progress = 0,
  lessons = 0,
  onClick 
}: CourseCardProps) {
  const difficultyColor = {
    Beginner: "bg-green-500/10 text-green-700 dark:text-green-400",
    Intermediate: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    Advanced: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer hover-elevate"
      onClick={onClick}
      data-testid={`card-course-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <img 
          src={thumbnail} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
        />
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          <Badge className={difficultyColor[difficulty]} data-testid={`badge-difficulty-${difficulty.toLowerCase()}`}>
            {difficulty}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{duration}</span>
          </div>
          {lessons > 0 && (
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>{lessons} lessons</span>
            </div>
          )}
        </div>
        
        {progress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" data-testid="progress-course" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
