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
  angle: number;
}

const technologies: TechNode[] = [
  { id: "python", name: "Python", icon: "python", tooltip: "Core programming language for AI development", angle: 162 },
  { id: "vscode", name: "VS Code", icon: "vscode", tooltip: "AI-enhanced code editor with Copilot", angle: 126 },
  { id: "jupyter", name: "Jupyter", icon: "jupyter", tooltip: "Interactive notebooks for data exploration", angle: 90 },
  { id: "github", name: "GitHub", icon: "github", tooltip: "Version control & collaborative development", angle: 54 },
  { id: "openai", name: "OpenAI", icon: "openai", tooltip: "Master prompt engineering & API integration", angle: 18 },
  { id: "langchain", name: "LangChain", icon: "langchain", tooltip: "Build powerful AI applications with chain-of-thought", angle: 342 },
  { id: "huggingface", name: "Hugging Face", icon: "huggingface", tooltip: "Access thousands of pre-trained ML models", angle: 306 },
  { id: "react", name: "React", icon: "react", tooltip: "Build modern AI-powered user interfaces", angle: 270 },
  { id: "nodejs", name: "Node.js", icon: "nodejs", tooltip: "Backend runtime for AI application servers", angle: 234 },
  { id: "rigobot", name: "Rigobot", icon: "rigobot", tooltip: "Your personal AI mentor for 24/7 coding support", angle: 198 },
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

export function AIWorkflowDiagram({ className }: AIWorkflowDiagramProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const centerX = 50;
  const centerY = 50;
  const radiusX = 42;
  const radiusY = 38;

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

  const getNodePosition = (angle: number) => {
    const radians = (angle - 90) * (Math.PI / 180);
    return {
      x: centerX + radiusX * Math.cos(radians),
      y: centerY + radiusY * Math.sin(radians),
    };
  };

  const generateCurvedPath = (nodeX: number, nodeY: number) => {
    const midX = (nodeX + centerX) / 2;
    const midY = (nodeY + centerY) / 2;
    const dx = nodeX - centerX;
    const dy = nodeY - centerY;
    const perpX = -dy * 0.12;
    const perpY = dx * 0.12;
    const controlX = midX + perpX;
    const controlY = midY + perpY;
    return `M ${centerX} ${centerY} Q ${controlX} ${controlY} ${nodeX} ${nodeY}`;
  };

  const isLineActive = (nodeId: string) => {
    if (hoveredNode === "center") return true;
    if (hoveredNode === nodeId) return true;
    return false;
  };

  const isCenterHovered = hoveredNode === "center";

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full", className)} 
      data-testid="ai-workflow-diagram"
      style={{ aspectRatio: "2.2 / 1" }}
    >
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {technologies.map((tech, i) => {
          const pos = getNodePosition(tech.angle);
          const active = isLineActive(tech.id);
          const pathD = generateCurvedPath(pos.x, pos.y);
          return (
            <path 
              key={`line-${tech.id}`}
              d={pathD}
              fill="none"
              stroke={active ? "#3B82F6" : "#A0D0FF"}
              strokeOpacity={active ? 0.95 : 0.45}
              strokeWidth={active ? 0.5 : 0.35}
              className={cn(
                "transition-all duration-300",
                isVisible ? "opacity-100" : "opacity-0"
              )}
              style={{ 
                filter: active ? "url(#lineGlow)" : "none",
                transitionDelay: `${i * 50 + 100}ms`
              }}
            />
          );
        })}

        <rect
          x={centerX - 12}
          y={centerY - 4.5}
          width={24}
          height={9}
          rx={4}
          ry={4}
          fill="rgba(248, 250, 252, 0.3)"
          stroke={isCenterHovered ? "#3B82F6" : "#A0D0FF"}
          strokeWidth={isCenterHovered ? 0.5 : 0.35}
          className={cn(
            "cursor-pointer transition-all duration-300",
            isVisible ? "opacity-100" : "opacity-0"
          )}
          style={{ 
            transitionDelay: "150ms",
            filter: isCenterHovered ? "drop-shadow(0 1px 3px rgba(59, 130, 246, 0.2))" : "none"
          }}
          onMouseEnter={() => setHoveredNode("center")}
          onMouseLeave={() => setHoveredNode(null)}
          data-testid="node-center"
        />
        <text
          x={centerX}
          y={centerY + 0.8}
          textAnchor="middle"
          dominantBaseline="middle"
          className={cn(
            "pointer-events-none transition-all duration-300 font-semibold",
            isCenterHovered ? "fill-[#3B82F6]" : "fill-[#60A5FA]"
          )}
          style={{ 
            fontSize: "3px",
            fontFamily: "var(--font-heading)"
          }}
        >
          AI Engineering
        </text>

        {technologies.map((tech, i) => {
          const pos = getNodePosition(tech.angle);
          const isHovered = hoveredNode === tech.id;
          const isTop = tech.angle >= 0 && tech.angle <= 180;
          
          return (
            <g 
              key={tech.id}
              className={cn(
                "cursor-pointer transition-all duration-300",
                isVisible ? "opacity-100" : "opacity-0"
              )}
              style={{ 
                transitionDelay: `${i * 50}ms`,
                transform: isHovered ? `translate(${pos.x}%, ${pos.y}%) scale(1.08)` : `translate(${pos.x}%, ${pos.y}%)`,
                transformOrigin: "center",
                transformBox: "fill-box"
              }}
              onMouseEnter={() => setHoveredNode(tech.id)}
              onMouseLeave={() => setHoveredNode(null)}
              data-testid={`node-${tech.id}`}
            >
              <rect
                x={pos.x - 5}
                y={pos.y - 3.5}
                width={10}
                height={7}
                rx={2.5}
                ry={2.5}
                fill="transparent"
                stroke={isHovered ? "#3B82F6" : "#A0D0FF"}
                strokeWidth={isHovered ? 0.45 : 0.3}
                style={{
                  filter: isHovered ? "drop-shadow(0 1px 2px rgba(59, 130, 246, 0.18))" : "none"
                }}
              />
              <text
                x={pos.x}
                y={pos.y + 6}
                textAnchor="middle"
                className={cn(
                  "pointer-events-none transition-colors duration-300",
                  isHovered ? "fill-[#3B82F6]" : "fill-[#60A5FA]/80"
                )}
                style={{ fontSize: "2.2px", fontWeight: 500 }}
              >
                {tech.name}
              </text>
            </g>
          );
        })}
      </svg>

      {technologies.map((tech, i) => {
        const pos = getNodePosition(tech.angle);
        const isHovered = hoveredNode === tech.id;
        
        return (
          <div
            key={`icon-${tech.id}`}
            className="absolute pointer-events-none flex items-center justify-center"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(-50%, -50%) ${isHovered ? "scale(1.08)" : "scale(1)"}`,
              width: "10%",
              height: "14%",
              transition: "transform 0.3s ease"
            }}
          >
            <TechIcon 
              icon={tech.icon} 
              className={cn(
                "transition-colors duration-300 w-3 h-3 md:w-4 md:h-4",
                isHovered ? "text-[#3B82F6]" : "text-[#60A5FA]"
              )} 
            />
          </div>
        );
      })}

      <div 
        className="absolute pointer-events-none flex items-center justify-center"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "24%",
          height: "18%"
        }}
      >
        <IconCpu className={cn(
          "w-3 h-3 md:w-4 md:h-4 transition-colors duration-300 mr-1",
          isCenterHovered ? "text-[#3B82F6]" : "text-[#60A5FA]"
        )} />
      </div>

      {technologies.map((tech) => {
        const pos = getNodePosition(tech.angle);
        const isHovered = hoveredNode === tech.id;
        const isTop = tech.angle >= 0 && tech.angle <= 180;
        
        if (!isHovered) return null;
        
        return (
          <div
            key={`tooltip-${tech.id}`}
            className={cn(
              "absolute z-30 px-3 py-2 text-[10px] rounded-lg whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-150",
              "bg-white text-[#1E293B]"
            )}
            style={{ 
              left: `${pos.x}%`,
              top: isTop ? `${pos.y + 8}%` : `${pos.y - 8}%`,
              transform: `translate(-50%, ${isTop ? "0" : "-100%"})`,
              maxWidth: "150px", 
              whiteSpace: "normal", 
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
              borderRadius: "8px"
            }}
            data-testid={`tooltip-${tech.id}`}
          >
            {tech.tooltip}
          </div>
        );
      })}
    </div>
  );
}

export default AIWorkflowDiagram;
