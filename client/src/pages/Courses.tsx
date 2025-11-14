import Header from "@/components/Header";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";
import webDevThumbnail from "@assets/generated_images/Web_development_course_thumbnail_fd09be69.png";
import dataScienceThumbnail from "@assets/generated_images/Data_science_course_thumbnail_c63194fb.png";
import aiThumbnail from "@assets/generated_images/AI_course_thumbnail_0a0401e7.png";

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");

  const allCourses = [
    {
      id: '1',
      title: "Full Stack Web Development",
      description: "Learn to build modern web applications from scratch using React, Node.js, and databases",
      thumbnail: webDevThumbnail,
      duration: "12 weeks",
      difficulty: "Intermediate" as const,
      lessons: 48,
    },
    {
      id: '2',
      title: "Data Science & Analytics",
      description: "Master data analysis, visualization, and machine learning with Python and industry tools",
      thumbnail: dataScienceThumbnail,
      duration: "10 weeks",
      difficulty: "Advanced" as const,
      lessons: 42,
    },
    {
      id: '3',
      title: "Introduction to AI & Machine Learning",
      description: "Understand AI fundamentals and build your first machine learning models",
      thumbnail: aiThumbnail,
      duration: "8 weeks",
      difficulty: "Beginner" as const,
      lessons: 36,
    },
    {
      id: '4',
      title: "Advanced Web Development",
      description: "Deep dive into advanced React patterns, performance optimization, and architecture",
      thumbnail: webDevThumbnail,
      duration: "14 weeks",
      difficulty: "Advanced" as const,
      lessons: 52,
    },
    {
      id: '5',
      title: "Python for Beginners",
      description: "Start your programming journey with Python fundamentals and practical projects",
      thumbnail: dataScienceThumbnail,
      duration: "6 weeks",
      difficulty: "Beginner" as const,
      lessons: 24,
    },
    {
      id: '6',
      title: "Machine Learning Engineering",
      description: "Build and deploy production-ready ML systems with best practices",
      thumbnail: aiThumbnail,
      duration: "16 weeks",
      difficulty: "Advanced" as const,
      lessons: 64,
    },
  ];

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficulty === "all" || course.difficulty === difficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Courses</h1>
          <p className="text-muted-foreground">Explore our comprehensive course catalog</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-courses"
            />
          </div>
          
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-difficulty">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              onClick={() => console.log(`Course clicked: ${course.title}`)}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
