import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LearningPathCard from "@/components/LearningPathCard";
import CourseCard from "@/components/CourseCard";
import { useLocation } from "wouter";
import careerIcon from "@assets/generated_images/Career_role_icon_080fe87b.png";
import skillIcon from "@assets/generated_images/Skill_learning_icon_b1295d22.png";
import toolIcon from "@assets/generated_images/Tool_mastery_icon_2e46cd62.png";
import webDevThumbnail from "@assets/generated_images/Web_development_course_thumbnail_fd09be69.png";
import dataScienceThumbnail from "@assets/generated_images/Data_science_course_thumbnail_c63194fb.png";
import aiThumbnail from "@assets/generated_images/AI_course_thumbnail_0a0401e7.png";

export default function Home() {
  const [, setLocation] = useLocation();

  const learningPaths = [
    {
      title: "I want to become a Developer",
      description: "Follow a structured path to become a professional software developer",
      icon: careerIcon,
    },
    {
      title: "I want to learn a Skill",
      description: "Master specific technical skills to advance your career",
      icon: skillIcon,
    },
    {
      title: "I want to master a Tool",
      description: "Become proficient in industry-leading tools and platforms",
      icon: toolIcon,
    },
  ];

  const featuredCourses = [
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
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Choose Your Learning Path</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select the path that aligns with your career goals and start your transformation today
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {learningPaths.map((path) => (
            <LearningPathCard
              key={path.title}
              {...path}
              onClick={() => {
                console.log(`Selected path: ${path.title}`);
                setLocation('/courses');
              }}
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Courses</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start with our most popular courses designed by industry experts
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {featuredCourses.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              onClick={() => {
                console.log(`Course clicked: ${course.title}`);
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
