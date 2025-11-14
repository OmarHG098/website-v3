import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import ProgressCard from "@/components/ProgressCard";
import { IconBook, IconClock, IconAward, IconTrendingUp } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import webDevThumbnail from "@assets/generated_images/Web_development_course_thumbnail_fd09be69.png";
import dataScienceThumbnail from "@assets/generated_images/Data_science_course_thumbnail_c63194fb.png";
import aiThumbnail from "@assets/generated_images/AI_course_thumbnail_0a0401e7.png";

export default function Dashboard() {
  const currentCourses = [
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
    {
      id: '3',
      title: 'Data Science & Analytics',
      progress: 15,
      thumbnail: dataScienceThumbnail,
    },
  ];

  const recentActivity = [
    {
      id: '1',
      course: 'Full Stack Web Development',
      activity: 'Completed: Building REST APIs',
      time: '2 hours ago',
      thumbnail: webDevThumbnail,
    },
    {
      id: '2',
      course: 'Introduction to AI & Machine Learning',
      activity: 'Started: Neural Networks Basics',
      time: '1 day ago',
      thumbnail: aiThumbnail,
    },
    {
      id: '3',
      course: 'Full Stack Web Development',
      activity: 'Completed: Database Design',
      time: '3 days ago',
      thumbnail: webDevThumbnail,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Track your learning progress and achievements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Courses Enrolled"
            value={3}
            icon={IconBook}
            trend="+1 this month"
            trendUp={true}
          />
          <StatsCard
            title="Hours Learned"
            value={48}
            icon={IconClock}
            trend="+12 this week"
            trendUp={true}
          />
          <StatsCard
            title="Courses Completed"
            value={5}
            icon={IconAward}
            trend="+2 this month"
            trendUp={true}
          />
          <StatsCard
            title="Learning Streak"
            value="12 days"
            icon={IconTrendingUp}
            trend="Keep it up!"
            trendUp={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProgressCard courses={currentCourses} />
          
          <Card data-testid="card-recent-activity">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3 pb-4 border-b last:border-0 last:pb-0">
                  <img 
                    src={item.thumbnail} 
                    alt={item.course}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.course}</p>
                    <p className="text-xs text-muted-foreground">{item.activity}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
