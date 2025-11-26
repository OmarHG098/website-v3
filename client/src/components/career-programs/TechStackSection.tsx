import { SiHtml5, SiCss3, SiJavascript, SiPython, SiReact, SiNodedotjs, SiTypescript, SiPostgresql, SiMongodb, SiDocker, SiGit, SiAmazonwebservices } from "react-icons/si";
import type { TechStackSection as TechStackSectionType } from "@shared/schema";

interface TechStackSectionProps {
  data: TechStackSectionType;
}

const techIcons: Record<string, JSX.Element> = {
  "HTML5": <SiHtml5 className="w-12 h-12 text-orange-500" />,
  "CSS3": <SiCss3 className="w-12 h-12 text-blue-500" />,
  "JavaScript": <SiJavascript className="w-12 h-12 text-yellow-400" />,
  "Python": <SiPython className="w-12 h-12 text-blue-400" />,
  "React": <SiReact className="w-12 h-12 text-cyan-400" />,
  "Node.js": <SiNodedotjs className="w-12 h-12 text-green-500" />,
  "TypeScript": <SiTypescript className="w-12 h-12 text-blue-600" />,
  "PostgreSQL": <SiPostgresql className="w-12 h-12 text-blue-700" />,
  "MongoDB": <SiMongodb className="w-12 h-12 text-green-600" />,
  "Docker": <SiDocker className="w-12 h-12 text-blue-500" />,
  "Git": <SiGit className="w-12 h-12 text-orange-600" />,
  "AWS": <SiAmazonwebservices className="w-12 h-12 text-orange-400" />,
};

export function TechStackSection({ data }: TechStackSectionProps) {
  return (
    <section 
      className="py-16 bg-background"
      data-testid="section-tech-stack"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
            data-testid="text-tech-title"
          >
            {data.title}
          </h2>
          {data.subtitle && (
            <p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              data-testid="text-tech-subtitle"
            >
              {data.subtitle}
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {data.technologies.map((tech, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center gap-2"
              data-testid={`tech-icon-${index}`}
            >
              {techIcons[tech] || (
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium">{tech}</span>
                </div>
              )}
              <span className="text-sm text-muted-foreground">{tech}</span>
            </div>
          ))}
        </div>
        
        {data.extras_text && (
          <p 
            className="text-center text-muted-foreground"
            data-testid="text-tech-extras"
          >
            {data.extras_text}
          </p>
        )}
      </div>
    </section>
  );
}
