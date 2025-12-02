import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as TablerIcons from "@tabler/icons-react";
import { IconRobot } from "@tabler/icons-react";
import type { AILearningSection as AILearningSectionType } from "@shared/schema";
import type { ComponentType } from "react";

interface AILearningSectionProps {
  data: AILearningSectionType;
}

export function AILearningSection({ data }: AILearningSectionProps) {
  const getIcon = (iconName: string) => {
    const icons = TablerIcons as unknown as Record<string, ComponentType<{ size?: number; className?: string }>>;
    const IconComponent = icons[`Icon${iconName}`];
    return IconComponent ? <IconComponent size={28} className="text-primary" /> : null;
  };

  return (
    <section 
      className="py-16 bg-muted/30"
      data-testid="section-ai-learning"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {data.badge && (
              <Badge 
                variant="secondary" 
                className="mb-4"
                data-testid="badge-ai-learning"
              >
                {data.badge}
              </Badge>
            )}
            
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              data-testid="text-ai-title"
            >
              {data.title}
            </h2>
            
            <p 
              className="text-lg text-muted-foreground mb-8"
              data-testid="text-ai-description"
            >
              {data.description}
            </p>
            
            <div className="space-y-6">
              {data.features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex gap-4"
                  data-testid={`feature-ai-${index}`}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getIcon(feature.icon)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {data.chat_example && (
            <Card 
              className="bg-background border shadow-lg"
              data-testid="card-chat-example"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <TablerIcons.IconRobot size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {data.chat_example.bot_name}
                    </p>
                    <p className="text-xs text-green-500">
                      {data.chat_example.bot_status}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
                      <p className="text-sm">{data.chat_example.user_message}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                      <p className="text-sm text-foreground">{data.chat_example.bot_response}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
