import StatsCard from '../StatsCard';
import { BookOpen } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="p-8 bg-background max-w-sm">
      <StatsCard 
        title="Courses Completed"
        value={12}
        icon={BookOpen}
        trend="+3 this month"
        trendUp={true}
      />
    </div>
  );
}
