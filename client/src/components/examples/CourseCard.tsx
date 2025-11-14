import CourseCard from '../CourseCard';
import webDevThumbnail from "@assets/generated_images/Web_development_course_thumbnail_fd09be69.png";

export default function CourseCardExample() {
  return (
    <div className="p-8 bg-background max-w-sm">
      <CourseCard 
        title="Full Stack Web Development"
        description="Learn to build modern web applications from scratch using React, Node.js, and databases"
        thumbnail={webDevThumbnail}
        duration="12 weeks"
        difficulty="Intermediate"
        progress={45}
        lessons={48}
        onClick={() => console.log('Course clicked')}
      />
    </div>
  );
}
