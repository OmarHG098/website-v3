import ProgressCard from '../ProgressCard';
import webDevThumbnail from "@assets/generated_images/Web_development_course_thumbnail_fd09be69.png";
import aiThumbnail from "@assets/generated_images/AI_course_thumbnail_0a0401e7.png";

export default function ProgressCardExample() {
  const courses = [
    {
      id: '1',
      title: 'Full Stack Web Development',
      progress: 65,
      thumbnail: webDevThumbnail,
    },
    {
      id: '2',
      title: 'Introduction to AI & Machine Learning',
      progress: 30,
      thumbnail: aiThumbnail,
    },
  ];

  return (
    <div className="p-8 bg-background max-w-md">
      <ProgressCard courses={courses} />
    </div>
  );
}
