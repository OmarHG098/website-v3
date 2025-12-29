import { useState
} from "react";
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
  IconCloud
} from "@tabler/icons-react";
import rigobotLogo from "@assets/rigobot-logo_1764707022198.webp";

interface TechNode {
  id: string;
  name: string;
  icon: "python" | "openai" | "rigobot" | "langchain" | "huggingface" | "github" | "react" | "nodejs" | "jupyter" | "vscode";
  tooltip: string;
  angle: number;
}

const technologies: TechNode[] = [
  { id: "python", name: "Python", icon: "python", tooltip: "Core programming language for AI development", angle: 0 },
  { id: "openai", name: "OpenAI", icon: "openai", tooltip: "Master prompt engineering & API integration", angle: 36 },
  { id: "rigobot", name: "Rigobot", icon: "rigobot", tooltip: "Your personal AI mentor for 24/7 coding support", angle: 72 },
  { id: "langchain", name: "LangChain", icon: "langchain", tooltip: "Build powerful AI applications with chain-of-thought", angle: 108 },
  { id: "huggingface", name: "Hugging Face", icon: "huggingface", tooltip: "Access thousands of pre-trained ML models", angle: 144 },
  { id: "github", name: "GitHub", icon: "github", tooltip: "Version control & collaborative development", angle: 180 },
  { id: "react", name: "React", icon: "react", tooltip: "Build modern AI-powered user interfaces", angle: 216 },
  { id: "nodejs", name: "Node.js", icon: "nodejs", tooltip: "Backend runtime for AI application servers", angle: 252 },
  { id: "jupyter", name: "Jupyter", icon: "jupyter", tooltip: "Interactive notebooks for data exploration", angle: 288 },
  { id: "vscode", name: "VS Code", icon: "vscode", tooltip: "AI-enhanced code editor with Copilot", angle: 324 },
];

function TechIcon({ icon, className }: { icon: TechNode["icon"]; className?: string }) {
  const iconClass = cn("w-6 h-6 md:w-8 md:h-8", className);
  
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
          className="w-6 h-6 md:w-8 md:h-8 object-contain"
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
      return <IconCloud className={iconClass} />;
  }
}

interface AIWorkflowDiagramProps {
  className?: string;
}

export function AIWorkflowDiagram({ className }: AIWorkflowDiagramProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const centerX = 200;
  const centerY = 200;
  const radius = 140;
  const nodeRadius = 36;

  const getNodePosition = (angle: number) => {
    const radians = (angle - 90) * (Math.PI / 180);
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY + radius * Math.sin(radians),
    };
  };

  const handleNodeHover = (nodeId: string | null, event?: React.MouseEvent) => {
    setHoveredNode(nodeId);
    if (event && nodeId) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
    }
  };

  return (
    <div className={cn("relative w-full max-w-lg mx-auto", className)} data-testid="ai-workflow-diagram">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-auto"
        style={{ maxHeight: "500px" }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="lineGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
          </radialGradient>
        </defs>

        {technologies.map((tech) => {
          const pos = getNodePosition(tech.angle);
          const isHovered = hoveredNode === tech.id;
          
          const midX = (centerX + pos.x) / 2;
          const midY = (centerY + pos.y) / 2;
          const perpX = -(pos.y - centerY) * 0.15;
          const perpY = (pos.x - centerX) * 0.15;
          const controlX = midX + perpX;
          const controlY = midY + perpY;

          return (
            <path
              key={`line-${tech.id}`}
              d={`M ${centerX} ${centerY} Q ${controlX} ${controlY} ${pos.x} ${pos.y}`}
              fill="none"
              stroke={isHovered ? "url(#lineGradientHover)" : "url(#lineGradient)"}
              strokeWidth={isHovered ? 3 : 1.5}
              className="transition-all duration-300"
              style={{
                filter: isHovered ? "url(#glow)" : "none",
              }}
            />
          );
        })}

        <circle
          cx={centerX}
          cy={centerY}
          r={55}
          fill="url(#centerGradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeOpacity="0.3"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={48}
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeOpacity="0.5"
        />
        
        <text
          x={centerX}
          y={centerY - 8}
          textAnchor="middle"
          className="fill-primary text-[11px] font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          AI Engineering
        </text>
        <text
          x={centerX}
          y={centerY + 8}
          textAnchor="middle"
          className="fill-primary text-[10px] font-medium"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Workflow
        </text>
      </svg>

      {technologies.map((tech) => {
        const pos = getNodePosition(tech.angle);
        const isHovered = hoveredNode === tech.id;
        
        const leftPercent = (pos.x / 400) * 100;
        const topPercent = (pos.y / 400) * 100;

        return (
          <div
            key={tech.id}
            className={cn(
              "absolute flex flex-col items-center cursor-pointer transition-all duration-300",
              isHovered && "z-10"
            )}
            style={{
              left: `${leftPercent}%`,
              top: `${topPercent}%`,
              transform: `translate(-50%, -50%) ${isHovered ? "scale(1.15)" : "scale(1)"}`,
            }}
            onMouseEnter={(e) => handleNodeHover(tech.id, e)}
            onMouseLeave={() => handleNodeHover(null)}
            data-testid={`node-${tech.id}`}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-full bg-background border-2 transition-all duration-300",
                "w-12 h-12 md:w-16 md:h-16",
                isHovered
                  ? "border-primary shadow-lg shadow-primary/30"
                  : "border-primary/30 hover:border-primary/50"
              )}
              style={{
                boxShadow: isHovered
                  ? "0 0 20px hsl(var(--primary) / 0.4), 0 4px 12px rgba(0,0,0,0.1)"
                  : "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <TechIcon icon={tech.icon} className={isHovered ? "text-primary" : "text-muted-foreground"} />
            </div>
            <span
              className={cn(
                "mt-1 text-[10px] md:text-xs font-medium text-center transition-colors duration-300 whitespace-nowrap",
                isHovered ? "text-primary" : "text-muted-foreground"
              )}
            >
              {tech.name}
            </span>

            {isHovered && (
              <div
                className="absolute bottom-full mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg shadow-xl whitespace-nowrap z-20 animate-in fade-in-0 zoom-in-95 duration-200"
                style={{ maxWidth: "200px", whiteSpace: "normal", textAlign: "center" }}
                data-testid={`tooltip-${tech.id}`}
              >
                {tech.tooltip}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AIWorkflowDiagram;
