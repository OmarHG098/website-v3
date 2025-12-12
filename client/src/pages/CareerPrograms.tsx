import Header from "@/components/Header";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import webDevThumbnail from "@assets/generated_images/Web_development_course_thumbnail_fd09be69.png";
import dataScienceThumbnail from "@assets/generated_images/Data_science_course_thumbnail_c63194fb.png";
import aiThumbnail from "@assets/generated_images/AI_course_thumbnail_0a0401e7.png";

export default function CareerPrograms() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [, setLocation] = useLocation();
  const { i18n } = useTranslation();

  const getProgramUrl = (slug: string) => {
    return i18n.language === "es" ? `/es/programas-de-carrera/${slug}` : `/en/career-programs/${slug}`;
  };

  const allCourses = [
    {
      id: '1',
      title: "Full Stack Web Development",
      description: "Learn to build modern web applications from scratch using React, Node.js, and databases",
      thumbnail: webDevThumbnail,
      duration: "12 weeks",
      difficulty: "Intermediate" as const,
      lessons: 48,
      link: "full-stack",
    },
    {
      id: '2',
      title: "Data Science & Machine Learning",
      description: "Master data analysis, visualization, and machine learning with Python, TensorFlow, and industry tools. Build predictive models for real-world applications.",
      thumbnail: dataScienceThumbnail,
      duration: "16 weeks",
      difficulty: "Advanced" as const,
      lessons: 64,
      link: "data-science-ml",
    },
    {
      id: '3',
      title: "Cybersecurity",
      description: "Defend systems and respond to real-world cyber threats. Learn penetration testing, incident response, and security tools like Nessus, Nmap, Wireshark, and Metasploit.",
      thumbnail: aiThumbnail,
      duration: "16 weeks",
      difficulty: "Intermediate" as const,
      lessons: 48,
      link: "cybersecurity",
    },
    {
      id: '4',
      title: "Introduction to AI & Machine Learning",
      description: "Understand AI fundamentals and build your first machine learning models",
      thumbnail: aiThumbnail,
      duration: "8 weeks",
      difficulty: "Beginner" as const,
      lessons: 36,
    },
    {
      id: '5',
      title: "Advanced Web Development",
      description: "Deep dive into advanced React patterns, performance optimization, and architecture",
      thumbnail: webDevThumbnail,
      duration: "14 weeks",
      difficulty: "Advanced" as const,
      lessons: 52,
    },
    {
      id: '6',
      title: "Python for Beginners",
      description: "Start your programming journey with Python fundamentals and practical projects",
      thumbnail: dataScienceThumbnail,
      duration: "6 weeks",
      difficulty: "Beginner" as const,
      lessons: 24,
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
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
              onClick={() => {
                if (course.link) {
                  setLocation(getProgramUrl(course.link));
                } else {
                  console.log(`Course clicked: ${course.title}`);
                }
              }}
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
