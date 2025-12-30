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
  row: "top" | "bottom";
}

const topRowTechnologies: TechNode[] = [
  { id: "python", name: "Python", icon: "python", tooltip: "Core programming language for AI development", row: "top" },
  { id: "vscode", name: "VS Code", icon: "vscode", tooltip: "AI-enhanced code editor with Copilot", row: "top" },
  { id: "jupyter", name: "Jupyter", icon: "jupyter", tooltip: "Interactive notebooks for data exploration", row: "top" },
  { id: "github", name: "GitHub", icon: "github", tooltip: "Version control & collaborative development", row: "top" },
  { id: "openai", name: "OpenAI", icon: "openai", tooltip: "Master prompt engineering & API integration", row: "top" },
];

const bottomRowTechnologies: TechNode[] = [
  { id: "langchain", name: "LangChain", icon: "langchain", tooltip: "Build powerful AI applications with chain-of-thought", row: "bottom" },
  { id: "huggingface", name: "Hugging Face", icon: "huggingface", tooltip: "Access thousands of pre-trained ML models", row: "bottom" },
  { id: "react", name: "React", icon: "react", tooltip: "Build modern AI-powered user interfaces", row: "bottom" },
  { id: "nodejs", name: "Node.js", icon: "nodejs", tooltip: "Backend runtime for AI application servers", row: "bottom" },
  { id: "rigobot", name: "Rigobot", icon: "rigobot", tooltip: "Your personal AI mentor for 24/7 coding support", row: "bottom" },
];

function TechIcon({ icon, className }: { icon: TechNode["icon"]; className?: string }) {
  const iconClass = cn("w-5 h-5 md:w-6 md:h-6", className);
  
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
          className="w-5 h-5 md:w-6 md:h-6 object-contain"
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
  onHover
}: { 
  tech: TechNode; 
  index: number;
  isVisible: boolean;
  hoveredNode: string | null;
  onHover: (id: string | null) => void;
}) {
  const isHovered = hoveredNode === tech.id;
  const delay = tech.row === "top" ? index * 100 : (index + 5) * 100 + 200;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center cursor-pointer transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
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
          "w-10 h-10 md:w-12 md:h-12",
          isHovered
            ? "border-primary/60 scale-110"
            : "border-primary/20"
        )}
        style={{
          boxShadow: isHovered
            ? "0 0 16px hsl(var(--primary) / 0.25), 0 2px 8px rgba(0,0,0,0.08)"
            : "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <TechIcon 
          icon={tech.icon} 
          className={cn(
            "transition-colors duration-300",
            isHovered ? "text-primary" : "text-primary/60"
          )} 
        />
      </div>
      <span
        className={cn(
          "mt-1.5 text-[9px] md:text-[10px] font-medium text-center transition-colors duration-300 whitespace-nowrap",
          isHovered ? "text-primary" : "text-muted-foreground"
        )}
      >
        {tech.name}
      </span>

      {isHovered && (
        <div
          className={cn(
            "absolute z-20 px-3 py-2 text-xs rounded-lg shadow-lg whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-200",
            "bg-background border border-primary/20 text-foreground",
            tech.row === "top" ? "top-full mt-1" : "bottom-full mb-1"
          )}
          style={{ maxWidth: "180px", whiteSpace: "normal", textAlign: "center" }}
          data-testid={`tooltip-${tech.id}`}
        >
          {tech.tooltip}
          <div 
            className={cn(
              "absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent",
              tech.row === "top" 
                ? "bottom-full border-b-4 border-b-primary/20" 
                : "top-full border-t-4 border-t-primary/20"
            )} 
          />
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
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        preserveAspectRatio="none"
        style={{ zIndex: 0 }}
      >
        <defs>
          <linearGradient id="lineGradientHorizontal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative flex flex-col items-center gap-3 md:gap-4 py-4">
        <div className="flex items-center justify-center gap-4 md:gap-8 lg:gap-12 w-full px-2">
          {topRowTechnologies.map((tech, index) => (
            <TechNodeComponent
              key={tech.id}
              tech={tech}
              index={index}
              isVisible={isVisible}
              hoveredNode={hoveredNode}
              onHover={setHoveredNode}
            />
          ))}
        </div>

        <div 
          className={cn(
            "flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full transition-all duration-500",
            "bg-primary/5 border border-primary/20",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
          style={{ 
            transitionDelay: "300ms",
          }}
        >
          <IconNetwork className="w-4 h-4 md:w-5 md:h-5 text-primary/70" />
          <span 
            className="text-xs md:text-sm font-semibold text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            AI Engineering
          </span>
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-8 lg:gap-12 w-full px-2">
          {bottomRowTechnologies.map((tech, index) => (
            <TechNodeComponent
              key={tech.id}
              tech={tech}
              index={index}
              isVisible={isVisible}
              hoveredNode={hoveredNode}
              onHover={setHoveredNode}
            />
          ))}
        </div>
      </div>

      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" 
        style={{ zIndex: -1 }}
      >
        <defs>
          <linearGradient id="connectionLine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="url(#connectionLine)" strokeWidth="1" />
      </svg>
    </div>
  );
}

export default AIWorkflowDiagram;
