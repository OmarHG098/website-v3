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
  row,
  arcOffset = 0
}: { 
  tech: TechNode; 
  index: number;
  isVisible: boolean;
  hoveredNode: string | null;
  onHover: (id: string | null) => void;
  row: "top" | "bottom";
  arcOffset?: number;
}) {
  const isHovered = hoveredNode === tech.id;
  const baseDelay = row === "top" ? 0 : 400;
  const delay = baseDelay + index * 60;
  
  const verticalOffset = row === "top" 
    ? arcOffset * 1.5 
    : -arcOffset * 1.5;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center cursor-pointer transition-all duration-300 flex-1",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={{ 
        transitionDelay: `${delay}ms`,
        transform: isVisible 
          ? `translateY(${verticalOffset}px)` 
          : `translateY(${verticalOffset + 8}px)`,
      }}
      onMouseEnter={() => onHover(tech.id)}
      onMouseLeave={() => onHover(null)}
      data-testid={`node-${tech.id}`}
    >
      <div
        className={cn(
          "flex items-center justify-center bg-transparent transition-all duration-300",
          "w-10 h-8 md:w-12 md:h-9 rounded-xl",
          isHovered
            ? "border-[1.5px] border-[#3B82F6] scale-110"
            : "border border-[#A0D0FF]"
        )}
        style={{
          boxShadow: isHovered
            ? "0 6px 16px rgba(59, 130, 246, 0.18)"
            : "none",
        }}
      >
        <TechIcon 
          icon={tech.icon} 
          className={cn(
            "transition-colors duration-300",
            isHovered ? "text-[#3B82F6]" : "text-[#60A5FA]"
          )} 
        />
      </div>
      <span
        className={cn(
          "mt-1 text-[7px] md:text-[8px] font-medium text-center transition-colors duration-300 whitespace-nowrap",
          isHovered ? "text-[#3B82F6]" : "text-[#60A5FA]/80"
        )}
      >
        {tech.name}
      </span>

      {isHovered && (
        <div
          className={cn(
            "absolute z-30 px-3 py-2 text-[10px] rounded-lg whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-150",
            "bg-white text-[#1E293B]",
            row === "top" ? "top-full mt-2" : "bottom-full mb-2"
          )}
          style={{ 
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

  const getArcOffset = (index: number, total: number) => {
    const center = (total - 1) / 2;
    const distance = Math.abs(index - center);
    const maxOffset = 3;
    return maxOffset * (distance / center);
  };

  const nodePositions = {
    top: topRowTechnologies.map((_, i) => ({
      x: (i + 0.5) / topRowTechnologies.length * 100,
      y: 16 + getArcOffset(i, topRowTechnologies.length)
    })),
    bottom: bottomRowTechnologies.map((_, i) => ({
      x: (i + 0.5) / bottomRowTechnologies.length * 100,
      y: 84 - getArcOffset(i, bottomRowTechnologies.length)
    })),
    center: { x: 50, y: 50 }
  };

  const isLineActive = (nodeId: string) => {
    if (hoveredNode === "center") return true;
    if (hoveredNode === nodeId) return true;
    return false;
  };

  const isCenterHovered = hoveredNode === "center";

  const generateCurvedPath = (startX: number, startY: number, endX: number, endY: number, isTop: boolean) => {
    const midY = (startY + endY) / 2;
    const curveOffset = isTop ? 8 : -8;
    const controlY = midY + curveOffset;
    return `M ${startX} ${startY} Q ${startX} ${controlY} ${endX} ${endY}`;
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
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {topRowTechnologies.map((tech, i) => {
          const pos = nodePositions.top[i];
          const active = isLineActive(tech.id);
          const pathD = generateCurvedPath(pos.x, pos.y + 6, nodePositions.center.x, nodePositions.center.y - 8, true);
          return (
            <path 
              key={`top-line-${i}`}
              d={pathD}
              fill="none"
              stroke={active ? "#2563EB" : "#A0D0FF"}
              strokeOpacity={active ? 0.95 : 0.45}
              strokeWidth={active ? 1.8 : 1.2}
              className="transition-all duration-300"
              style={{ 
                filter: active ? "url(#lineGlow)" : "none",
              }}
            />
          );
        })}
        
        {bottomRowTechnologies.map((tech, i) => {
          const pos = nodePositions.bottom[i];
          const active = isLineActive(tech.id);
          const pathD = generateCurvedPath(nodePositions.center.x, nodePositions.center.y + 8, pos.x, pos.y - 6, false);
          return (
            <path 
              key={`bottom-line-${i}`}
              d={pathD}
              fill="none"
              stroke={active ? "#2563EB" : "#A0D0FF"}
              strokeOpacity={active ? 0.95 : 0.45}
              strokeWidth={active ? 1.8 : 1.2}
              className="transition-all duration-300"
              style={{ 
                filter: active ? "url(#lineGlow)" : "none",
              }}
            />
          );
        })}
      </svg>

      <div className="relative flex flex-col items-stretch gap-3 md:gap-4 py-2">
        <div className="flex items-center justify-between w-full">
          {topRowTechnologies.map((tech, index) => (
            <TechNodeComponent
              key={tech.id}
              tech={tech}
              index={index}
              isVisible={isVisible}
              hoveredNode={hoveredNode}
              onHover={setHoveredNode}
              row="top"
              arcOffset={getArcOffset(index, topRowTechnologies.length)}
            />
          ))}
        </div>

        <div className="flex items-center justify-center w-full py-2 md:py-3">
          <div 
            className={cn(
              "flex items-center justify-center gap-2 md:gap-2.5 px-5 md:px-6 py-2 md:py-2.5 cursor-pointer transition-all duration-300",
              "rounded-2xl",
              isCenterHovered
                ? "border-[1.5px] border-[#3B82F6] scale-108"
                : "border border-[#A0D0FF]",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            )}
            style={{ 
              transitionDelay: "200ms",
              boxShadow: isCenterHovered
                ? "0 6px 16px rgba(59, 130, 246, 0.18)"
                : "none",
              backgroundColor: "rgba(248, 250, 252, 0.25)",
              backdropFilter: "blur(4px)"
            }}
            onMouseEnter={() => setHoveredNode("center")}
            onMouseLeave={() => setHoveredNode(null)}
            data-testid="node-center"
          >
            <IconCpu className={cn(
              "w-4 h-4 md:w-5 md:h-5 transition-colors duration-300",
              isCenterHovered ? "text-[#3B82F6]" : "text-[#60A5FA]"
            )} />
            <span 
              className={cn(
                "text-xs md:text-sm font-semibold transition-colors duration-300",
                isCenterHovered ? "text-[#3B82F6]" : "text-[#60A5FA]"
              )}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              AI Engineering
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between w-full">
          {bottomRowTechnologies.map((tech, index) => (
            <TechNodeComponent
              key={tech.id}
              tech={tech}
              index={index}
              isVisible={isVisible}
              hoveredNode={hoveredNode}
              onHover={setHoveredNode}
              row="bottom"
              arcOffset={getArcOffset(index, bottomRowTechnologies.length)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIWorkflowDiagram;
