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
  IconCpu
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
      return <IconCpu className={iconClass} />;
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
  row
}: { 
  tech: TechNode; 
  index: number;
  isVisible: boolean;
  hoveredNode: string | null;
  onHover: (id: string | null) => void;
  row: "top" | "bottom";
}) {
  const isHovered = hoveredNode === tech.id;
  const baseDelay = row === "top" ? 0 : 400;
  const delay = baseDelay + index * 60;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center cursor-pointer transition-all duration-300 flex-1",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
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
          "flex items-center justify-center bg-background border transition-all duration-300",
          "w-10 h-8 md:w-12 md:h-9 rounded-xl",
          isHovered
            ? "border-primary/40 scale-110"
            : "border-primary/15"
        )}
        style={{
          boxShadow: isHovered
            ? "0 0 16px hsl(var(--primary) / 0.15), 0 2px 8px rgba(0,0,0,0.05)"
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
          "mt-1 text-[7px] md:text-[8px] font-medium text-center transition-colors duration-300 whitespace-nowrap",
          isHovered ? "text-primary" : "text-muted-foreground/60"
        )}
      >
        {tech.name}
      </span>

      {isHovered && (
        <div
          className={cn(
            "absolute z-30 px-2.5 py-1.5 text-[10px] rounded-lg shadow-md whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-150",
            "bg-background/95 backdrop-blur-sm border border-primary/10 text-foreground",
            row === "top" ? "top-full mt-2" : "bottom-full mb-2"
          )}
          style={{ maxWidth: "150px", whiteSpace: "normal", textAlign: "center" }}
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
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isVisible]);

  const nodePositions = {
    top: topRowTechnologies.map((_, i) => ({
      x: (i + 0.5) / topRowTechnologies.length * 100,
      y: 12
    })),
    bottom: bottomRowTechnologies.map((_, i) => ({
      x: (i + 0.5) / bottomRowTechnologies.length * 100,
      y: 88
    })),
    center: { x: 50, y: 50 }
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full", className)} 
      data-testid="ai-workflow-diagram"
    >
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        style={{ zIndex: 0 }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGradientV" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A0D0FF" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#A0D0FF" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#A0D0FF" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        
        {nodePositions.top.map((pos, i) => (
          <line 
            key={`top-line-${i}`}
            x1={`${pos.x}%`} 
            y1={`${pos.y + 12}%`} 
            x2={`${nodePositions.center.x}%`} 
            y2={`${nodePositions.center.y - 8}%`} 
            stroke="#A0D0FF"
            strokeOpacity="0.25"
            strokeWidth="1"
            className={cn(
              "transition-opacity duration-500",
              isVisible ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDelay: `${i * 60 + 100}ms` }}
          />
        ))}
        
        {nodePositions.bottom.map((pos, i) => (
          <line 
            key={`bottom-line-${i}`}
            x1={`${pos.x}%`} 
            y1={`${pos.y - 12}%`} 
            x2={`${nodePositions.center.x}%`} 
            y2={`${nodePositions.center.y + 8}%`} 
            stroke="#A0D0FF"
            strokeOpacity="0.25"
            strokeWidth="1"
            className={cn(
              "transition-opacity duration-500",
              isVisible ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDelay: `${i * 60 + 500}ms` }}
          />
        ))}
      </svg>

      <div className="relative flex flex-col items-stretch gap-3 md:gap-4 py-2">
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
            />
          ))}
        </div>

        <div className="flex items-center justify-center w-full py-2 md:py-3">
          <div 
            className={cn(
              "flex items-center justify-center gap-2 md:gap-2.5 px-5 md:px-6 py-2 md:py-2.5 transition-all duration-500",
              "bg-primary/6 border border-primary/20 rounded-2xl",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            )}
            style={{ 
              transitionDelay: "200ms",
            }}
          >
            <IconCpu className="w-4 h-4 md:w-5 md:h-5 text-primary/60" />
            <span 
              className="text-xs md:text-sm font-semibold text-primary/80"
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIWorkflowDiagram;
