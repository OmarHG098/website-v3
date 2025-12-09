import { Card } from "@/components/ui/card";
import Briefcase from "@/components/custom-icons/Briefcase";
import Graduation from "@/components/custom-icons/Graduation";
import GrowthChart from "@/components/custom-icons/GrowthChart";

export interface StatsSectionData {
  title: string;
  description: string;
}

interface StatsSectionProps {
  data: StatsSectionData;
}

const stats = [
  { value: "84%", label: "Job placement rate", icon: "briefcase" as const },
  { value: "3-6", valueSuffix: "months", label: "Average time to get hired", icon: "graduation" as const },
  { value: "55%", label: "Salary increase after graduation", icon: "growth" as const },
];

const iconMap = {
  briefcase: <Briefcase width="64" height="58" color="#0097CD" />,
  graduation: <Graduation width="64" height="54" />,
  growth: <GrowthChart width="64" height="67" />,
};

export default function StatsSection({ data }: StatsSectionProps) {
  return (
    <section 
      className="pb-16"
      data-testid="section-stats"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
            data-testid="text-stats-title"
          >
            {data.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {data.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} data-testid={`stat-item-${index}`} className="p-3 md:p-5 flex items-center gap-3 md:gap-5">
              <div className="flex-shrink-0 [&_svg]:w-10 [&_svg]:h-10 md:[&_svg]:w-16 md:[&_svg]:h-16">
                {iconMap[stat.icon]}
              </div>
              <div>
                <div className="text-xl md:text-4xl font-semibold text-foreground">
                  {stat.value}
                  {stat.valueSuffix && (
                    <span className="text-base md:text-2xl ml-1">
                      {stat.valueSuffix}
                    </span>
                  )}
                </div>
                <div className="text-sm md:text-base text-muted-foreground mt-0.5 md:mt-1">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
