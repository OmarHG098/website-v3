import type { HeroCourse as HeroCourseType } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconCheck, IconBook, IconCode, IconBriefcase, IconRobot, IconUsers, IconCalendar, IconPlayerPlay } from "@tabler/icons-react";

interface HeroCourseProps {
  data: HeroCourseType;
}

const iconMap: Record<string, typeof IconBook> = {
  book: IconBook,
  code: IconCode,
  briefcase: IconBriefcase,
  robot: IconRobot,
  users: IconUsers,
  calendar: IconCalendar,
  play: IconPlayerPlay,
};

export function HeroCourse({ data }: HeroCourseProps) {
  return (
    <section 
      className="py-12 md:py-16 bg-background"
      data-testid="section-hero"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="space-y-6">
            <h1 
              className="text-4xl md:text-5xl font-bold text-primary leading-tight"
              data-testid="text-hero-title"
            >
              {data.title}
            </h1>
            
            {data.subtitle && (
              <p 
                className="text-lg text-muted-foreground"
                data-testid="text-hero-subtitle"
              >
                {data.subtitle}
              </p>
            )}
            
            {data.students_enrolled && (
              <div className="flex items-center gap-3">
                {data.students_enrolled.avatars && data.students_enrolled.avatars.length > 0 && (
                  <div className="flex -space-x-2">
                    {data.students_enrolled.avatars.slice(0, 4).map((avatar, index) => (
                      <Avatar key={index} className="w-8 h-8 border-2 border-background">
                        <AvatarImage src={avatar} alt={`Student ${index + 1}`} />
                        <AvatarFallback className="text-xs">S{index + 1}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                )}
                <span className="text-sm text-muted-foreground">{data.students_enrolled.count}</span>
              </div>
            )}
            
            {data.bullet_points && data.bullet_points.length > 0 && (
              <ul className="space-y-3">
                {data.bullet_points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <IconCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            )}
            
            {data.tutors && data.tutors.length > 0 && (
              <div className="pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  {data.tutors_label || "Your tutors:"}
                </p>
                <div className="flex flex-wrap gap-4">
                  {data.tutors.map((tutor, index) => (
                    <div key={index} className="flex items-center gap-3 bg-muted rounded-lg px-3 py-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={tutor.image} alt={tutor.name} />
                        <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-primary">{tutor.name}</p>
                        <p className="text-xs text-muted-foreground">{tutor.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {data.description && (
              <p className="text-sm text-muted-foreground leading-relaxed pt-4">
                {data.description}
              </p>
            )}
          </div>
          
          {/* Right Column */}
          <div className="space-y-4">
            {/* Media */}
            <div className="relative rounded-lg overflow-hidden aspect-video">
              {data.media.type === "video" ? (
                <div className="relative w-full h-full bg-muted">
                  {data.media.thumbnail ? (
                    <>
                      <img 
                        src={data.media.thumbnail} 
                        alt={data.media.alt || "Video thumbnail"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <a 
                          href={data.media.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center hover:bg-primary transition-colors"
                        >
                          <IconPlayerPlay className="w-8 h-8 text-primary-foreground ml-1" />
                        </a>
                      </div>
                    </>
                  ) : (
                    <iframe
                      src={data.media.src}
                      title={data.media.alt || "Video"}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              ) : (
                <img 
                  src={data.media.src} 
                  alt={data.media.alt || "Hero image"}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {/* Signup Card */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">{data.signup_card.title}</h3>
              {data.signup_card.description && (
                <p className="text-sm text-muted-foreground mb-4">{data.signup_card.description}</p>
              )}
              
              <Button 
                className="w-full mb-3" 
                size="lg"
                variant={data.signup_card.cta_button.variant === "outline" ? "outline" : data.signup_card.cta_button.variant === "secondary" ? "secondary" : "default"}
                data-testid="button-hero-cta"
                asChild
              >
                <a href={data.signup_card.cta_button.url}>
                  {data.signup_card.cta_button.text}
                </a>
              </Button>
              
              {data.signup_card.login_link && (
                <p className="text-sm text-center text-muted-foreground mb-6">
                  Already have an account?{" "}
                  <a 
                    href={data.signup_card.login_link.url}
                    className="text-primary hover:underline"
                  >
                    {data.signup_card.login_link.text}
                  </a>
                </p>
              )}
              
              {data.signup_card.features && data.signup_card.features.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                  {data.signup_card.features.map((feature, index) => {
                    const IconComponent = iconMap[feature.icon] || IconBook;
                    return (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-4 h-4 text-muted-foreground" />
                          <span>{feature.text}</span>
                        </div>
                        {feature.count !== undefined && (
                          <span className="font-medium">{feature.count}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
