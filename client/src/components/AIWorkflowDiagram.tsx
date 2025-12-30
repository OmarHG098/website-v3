import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  IconBrandPython,
  IconBrandReact,
  IconBrandNodejs,
  IconBrandGithub,
  IconBrandVscode,
  IconRobot,
  IconBrain,
  IconCode,
  IconDatabase,
  IconNetwork
} from "@tabler/icons-react";
import rigobotLogo from "@assets/rigobot-logo_1764707022198.webp";

interface TechNode {
  id: string;
  name: string;
  icon: "python" | "openai" | "rigobot" | "langchain" | "huggingface" | "github" | "react" | "nodejs" | "jupyter" | "vscode";
  tooltip: string;
}

const topRowTechnologies: TechNode[] = [
  { id: "python", name: "Python", icon: "python", tooltip: "Core programming language for AI development" },
  { id: "vscode", name: "VS Code", icon: "vscode", tooltip: "AI-enhanced code editor with Copilot" },
  { id: "jupyter", name: "Jupyter", icon: "jupyter", tooltip: "Interactive notebooks for data exploration" },
  { id: "github", name: "GitHub", icon: "github", tooltip: "Version control & collaborative development" },
  { id: "openai", name: "OpenAI", icon: "openai", tooltip: "Master prompt engineering & API integration" },
];

const bottomRowTechnologies: TechNode[] = [
  { id: "langchain", name: "LangChain", icon: "langchain", tooltip: "Build powerful AI applications with chain-of-thought" },
  { id: "huggingface", name: "Hugging Face", icon: "huggingface", tooltip: "Access thousands of pre-trained ML models" },
  { id: "react", name: "React", icon: "react", tooltip: "Build modern AI-powered user interfaces" },
  { id: "nodejs", name: "Node.js", icon: "nodejs", tooltip: "Backend runtime for AI application servers" },
  { id: "rigobot", name: "Rigobot", icon: "rigobot", tooltip: "Your personal AI mentor for 24/7 coding support" },
];

function TechIcon({ icon, className }: { icon: TechNode["icon"]; className?: string }) {
  const iconClass = cn("w-4 h-4 md:w-5 md:h-5", className);
  
  switch (icon) {
    case "python":
      return <IconBrandPython className={iconClass} />;
    case "openai":
      return <IconBrain className={iconClass} />;
    case "rigobot":
      return (
        <img 
          src={rigobotLogo} 
          alt="Rigobot" 
          className="w-4 h-4 md:w-5 md:h-5 object-contain"
        />
      );
    case "langchain":
      return <IconCode className={iconClass} />;
    case "huggingface":
      return <IconRobot className={iconClass} />;
    case "github":
      return <IconBrandGithub className={iconClass} />;
    case "react":
      return <IconBrandReact className={iconClass} />;
    case "nodejs":
      return <IconBrandNodejs className={iconClass} />;
    case "jupyter":
      return <IconDatabase className={iconClass} />;
    case "vscode":
      return <IconBrandVscode className={iconClass} />;
    default:
      return <IconNetwork className={iconClass} />;
  }
}

interface AIWorkflowDiagramProps {
  className?: string;
}

function TechNodeComponent({ 
  tech, 
  index, 
  isVisible,
  hoveredNode,
  onHover,
  row,
  totalInRow
}: { 
  tech: TechNode; 
  index: number;
  isVisible: boolean;
  hoveredNode: string | null;
  onHover: (id: string | null) => void;
  row: "top" | "bottom";
  totalInRow: number;
}) {
  const isHovered = hoveredNode === tech.id;
  const baseDelay = row === "top" ? 0 : 400;
  const delay = baseDelay + index * 80;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center cursor-pointer transition-all duration-300 flex-1",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      )}
      style={{ 
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={() => onHover(tech.id)}
      onMouseLeave={() => onHover(null)}
      data-testid={`node-${tech.id}`}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-background border transition-all duration-300",
          "w-9 h-9 md:w-10 md:h-10",
          isHovered
            ? "border-primary/50 scale-110"
            : "border-primary/15"
        )}
        style={{
          boxShadow: isHovered
            ? "0 0 12px hsl(var(--primary) / 0.2), 0 2px 6px rgba(0,0,0,0.06)"
            : "none",
        }}
      >
        <TechIcon 
          icon={tech.icon} 
          className={cn(
            "transition-colors duration-300",
            isHovered ? "text-primary" : "text-primary/50"
          )} 
        />
      </div>
      <span
        className={cn(
          "mt-1 text-[8px] md:text-[9px] font-medium text-center transition-colors duration-300 whitespace-nowrap",
          isHovered ? "text-primary" : "text-muted-foreground/70"
        )}
      >
        {tech.name}
      </span>

      {isHovered && (
        <div
          className={cn(
            "absolute z-30 px-2.5 py-1.5 text-[10px] md:text-xs rounded-md shadow-md whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-150",
            "bg-background/95 backdrop-blur-sm border border-primary/15 text-foreground",
            row === "top" ? "top-full mt-1.5" : "bottom-full mb-1.5"
          )}
          style={{ maxWidth: "160px", whiteSpace: "normal", textAlign: "center" }}
          data-testid={`tooltip-${tech.id}`}
        >
          {tech.tooltip}
        </div>
      )}
    </div>
  );
}

export function AIWorkflowDiagram({ className }: AIWorkflowDiagramProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full", className)} 
      data-testid="ai-workflow-diagram"
    >
      <div className="relative flex flex-col items-stretch gap-2 md:gap-3">
        <div className="flex items-end justify-between w-full">
          {topRowTechnologies.map((tech, index) => (
            <TechNodeComponent
              key={tech.id}
              tech={tech}
              index={index}
              isVisible={isVisible}
              hoveredNode={hoveredNode}
              onHover={setHoveredNode}
              row="top"
              totalInRow={topRowTechnologies.length}
            />
          ))}
        </div>

        <div className="relative flex items-center justify-center w-full py-1">
          <div 
            className="absolute left-0 right-0 top-1/2 h-px bg-primary/20"
            style={{ transform: "translateY(-50%)" }}
          />
          
          <div 
            className={cn(
              "relative z-10 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-all duration-500",
              "bg-primary/8 border border-primary/20",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            )}
            style={{ 
              transitionDelay: "250ms",
            }}
          >
            <IconNetwork className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary/60" />
            <span 
              className="text-[10px] md:text-xs font-semibold text-primary/80"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              AI Engineering
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between w-full">
          {bottomRowTechnologies.map((tech, index) => (
            <TechNodeComponent
              key={tech.id}
              tech={tech}
              index={index}
              isVisible={isVisible}
              hoveredNode={hoveredNode}
              onHover={setHoveredNode}
              row="bottom"
              totalInRow={bottomRowTechnologies.length}
            />
          ))}
        </div>
      </div>

      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        style={{ zIndex: 0 }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="verticalLineTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="verticalLineBottom" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        
        {[0, 1, 2, 3, 4].map((i) => {
          const xPercent = 10 + i * 20;
          return (
            <g key={`lines-${i}`}>
              <line 
                x1={`${xPercent}%`} 
                y1="28%" 
                x2={`${xPercent}%`} 
                y2="42%" 
                stroke="url(#verticalLineTop)" 
                strokeWidth="1"
                className={cn(
                  "transition-opacity duration-300",
                  isVisible ? "opacity-100" : "opacity-0"
                )}
                style={{ transitionDelay: `${i * 80}ms` }}
              />
              <line 
                x1={`${xPercent}%`} 
                y1="58%" 
                x2={`${xPercent}%`} 
                y2="72%" 
                stroke="url(#verticalLineBottom)" 
                strokeWidth="1"
                className={cn(
                  "transition-opacity duration-300",
                  isVisible ? "opacity-100" : "opacity-0"
                )}
                style={{ transitionDelay: `${400 + i * 80}ms` }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default AIWorkflowDiagram;
