import Header from "@/components/Header";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import webDevThumbnail from "@assets/generated_images/Web_development_course_thumbnail_fd09be69.png";
import dataScienceThumbnail from "@assets/generated_images/Data_science_course_thumbnail_c63194fb.png";
import aiThumbnail from "@assets/generated_images/AI_course_thumbnail_0a0401e7.png";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  lessons: number;
  link?: string;
}

interface PageContent {
  hero_title: string;
  hero_subtitle: string;
  search_placeholder: string;
  difficulty_label: string;
  difficulty_all: string;
  difficulty_beginner: string;
  difficulty_intermediate: string;
  difficulty_advanced: string;
  no_results: string;
}

interface CareerProgramsPageData {
  slug: string;
  title: string;
  meta: {
    page_title: string;
    description: string;
  };
  page_content: PageContent;
  courses: Course[];
}

const thumbnailMap: Record<string, string> = {
  "1": webDevThumbnail,       // Full Stack Development
  "2": dataScienceThumbnail,  // Data Science & ML
  "3": aiThumbnail,           // Cybersecurity
  "4": aiThumbnail,           // AI Engineering
  "5": aiThumbnail,           // AI for Professionals
};

export default function CareerPrograms() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [, setLocation] = useLocation();
  const { i18n } = useTranslation();
  
  const [matchEn] = useRoute("/en/career-programs");
  const [matchEs] = useRoute("/es/programas-de-carrera");
  
  const locale = matchEn ? "en" : matchEs ? "es" : (i18n.language === "es" ? "es" : "en");

  const { data: pageData, isLoading } = useQuery<CareerProgramsPageData>({
    queryKey: ["/api/pages", "career-programs", locale],
    queryFn: async () => {
      const response = await fetch(`/api/pages/career-programs?locale=${locale}`);
      if (!response.ok) {
        throw new Error("Page not found");
      }
      return response.json();
    },
  });

  const getProgramUrl = (slug: string) => {
    return locale === "es" ? `/es/programas-de-carrera/${slug}` : `/en/career-programs/${slug}`;
  };

  const content = pageData?.page_content;
  const courses = pageData?.courses || [];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficulty === "all" || course.difficulty === difficulty || 
                              course.difficulty === content?.difficulty_beginner ||
                              course.difficulty === content?.difficulty_intermediate ||
                              course.difficulty === content?.difficulty_advanced;
    
    if (difficulty === "all") return matchesSearch;
    if (difficulty === "Beginner" && (course.difficulty === "Beginner" || course.difficulty === "Principiante")) return matchesSearch;
    if (difficulty === "Intermediate" && (course.difficulty === "Intermediate" || course.difficulty === "Intermedio")) return matchesSearch;
    if (difficulty === "Advanced" && (course.difficulty === "Advanced" || course.difficulty === "Avanzado")) return matchesSearch;
    
    return matchesSearch && course.difficulty === difficulty;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded w-1/3"></div>
            <div className="h-6 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">
            {content?.hero_title || "All Courses"}
          </h1>
          <p className="text-muted-foreground" data-testid="text-page-subtitle">
            {content?.hero_subtitle || "Explore our comprehensive course catalog"}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={content?.search_placeholder || "Search courses..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-courses"
            />
          </div>
          
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-difficulty">
              <SelectValue placeholder={content?.difficulty_label || "Difficulty"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{content?.difficulty_all || "All Levels"}</SelectItem>
              <SelectItem value="Beginner">{content?.difficulty_beginner || "Beginner"}</SelectItem>
              <SelectItem value="Intermediate">{content?.difficulty_intermediate || "Intermediate"}</SelectItem>
              <SelectItem value="Advanced">{content?.difficulty_advanced || "Advanced"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              description={course.description}
              thumbnail={thumbnailMap[course.id] || webDevThumbnail}
              duration={course.duration}
              difficulty={course.difficulty as "Beginner" | "Intermediate" | "Advanced"}
              lessons={course.lessons}
              onClick={() => {
                if (course.link) {
                  setLocation(getProgramUrl(course.link));
                }
              }}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground" data-testid="text-no-results">
              {content?.no_results || "No courses found matching your criteria."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
