import { useState, useMemo, useEffect, useRef } from "react";

interface SystemCoreDiagramProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  angle: number;
}

export function SystemCoreDiagram({ className = "" }: SystemCoreDiagramProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [layerOffsets, setLayerOffsets] = useState([0, 0, 0, 0, 0]);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Initialize particles
  useEffect(() => {
    const initialParticles: Particle[] = Array.from({ length: 24 }, () => ({
      x: 20 + Math.random() * 60,
      y: 15 + Math.random() * 70,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.2,
      speed: Math.random() * 0.008 + 0.003,
      angle: Math.random() * Math.PI * 2,
    }));
    setParticles(initialParticles);
  }, []);

  // Animation loop for parallax and particles
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const animate = () => {
      timeRef.current += 0.016;
      
      // Update layer parallax offsets (very slow)
      setLayerOffsets([
        Math.sin(timeRef.current * 0.15) * 0.8,
        Math.sin(timeRef.current * 0.12 + 1) * 0.6,
        Math.sin(timeRef.current * 0.18 + 2) * 0.5,
        Math.sin(timeRef.current * 0.1 + 3) * 0.7,
        Math.sin(timeRef.current * 0.14 + 4) * 0.4,
      ]);
      
      // Update particles (slow drift)
      setParticles(prev => prev.map(p => {
        let newX = p.x + Math.cos(p.angle) * p.speed;
        let newY = p.y + Math.sin(p.angle) * p.speed;
        
        // Wrap around bounds
        if (newX < 15) newX = 85;
        if (newX > 85) newX = 15;
        if (newY < 10) newY = 90;
        if (newY > 90) newY = 10;
        
        return { ...p, x: newX, y: newY };
      }));
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [prefersReducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  // Generate hexagon path
  const getHexagonPath = (cx: number, cy: number, size: number, offsetX: number = 0, offsetY: number = 0) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const x = cx + offsetX + Math.cos(angle) * size;
      const y = cy + offsetY + Math.sin(angle) * size;
      points.push(`${x},${y}`);
    }
    return `M${points.join(" L")} Z`;
  };

  // Calculate distance from mouse for particle brightness
  const getParticleBrightness = (px: number, py: number) => {
    if (!isHovered) return 1;
    const dist = Math.sqrt(Math.pow(px - mousePos.x, 2) + Math.pow(py - mousePos.y, 2));
    return Math.max(0.5, Math.min(2, 1 + (30 - dist) / 30));
  };

  const layers = [
    { size: 28, opacity: isHovered ? 0.5 : 0.35, strokeWidth: 0.8 },
    { size: 24, opacity: isHovered ? 0.6 : 0.4, strokeWidth: 0.7 },
    { size: 20, opacity: isHovered ? 0.7 : 0.5, strokeWidth: 0.6 },
    { size: 16, opacity: isHovered ? 0.8 : 0.6, strokeWidth: 0.5 },
    { size: 12, opacity: isHovered ? 0.9 : 0.7, strokeWidth: 0.4 },
  ];

  return (
    <div 
      className={`relative ${className}`} 
      data-testid="system-core-diagram"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-square max-w-[260px] mx-auto">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Subtle background grid lines */}
          <g opacity="0.06">
            {Array.from({ length: 7 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="10"
                y1={20 + i * 10}
                x2="90"
                y2={20 + i * 10}
                stroke="hsl(var(--primary))"
                strokeWidth="0.3"
              />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={20 + i * 10}
                y1="10"
                x2={20 + i * 10}
                y2="90"
                stroke="hsl(var(--primary))"
                strokeWidth="0.3"
              />
            ))}
          </g>

          {/* Floating signal particles */}
          {particles.map((p, i) => {
            const brightness = getParticleBrightness(p.x, p.y);
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={p.size}
                fill="hsl(var(--primary))"
                opacity={p.opacity * brightness * (isHovered ? 1.3 : 1)}
                className={!prefersReducedMotion ? "transition-opacity duration-300" : ""}
              />
            );
          })}

          {/* Layered hexagon wireframes with parallax */}
          <g filter={isHovered ? "url(#coreGlow)" : ""}>
            {layers.map((layer, i) => (
              <path
                key={i}
                d={getHexagonPath(
                  50,
                  50,
                  layer.size,
                  prefersReducedMotion ? 0 : layerOffsets[i] * (i % 2 === 0 ? 1 : -1),
                  prefersReducedMotion ? 0 : layerOffsets[i] * 0.5 * (i % 2 === 0 ? -1 : 1)
                )}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth={layer.strokeWidth}
                opacity={layer.opacity}
                className={!prefersReducedMotion ? "transition-opacity duration-500" : ""}
              />
            ))}
          </g>

          {/* Inner geometric accent - offset rectangles */}
          <g opacity={isHovered ? 0.5 : 0.3}>
            <rect
              x={50 - 6 + (prefersReducedMotion ? 0 : layerOffsets[0] * 0.3)}
              y={50 - 4 + (prefersReducedMotion ? 0 : layerOffsets[1] * 0.2)}
              width="12"
              height="8"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.4"
              className={!prefersReducedMotion ? "transition-opacity duration-500" : ""}
            />
            <rect
              x={50 - 4 + (prefersReducedMotion ? 0 : layerOffsets[2] * -0.2)}
              y={50 - 3 + (prefersReducedMotion ? 0 : layerOffsets[3] * -0.15)}
              width="8"
              height="6"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.3"
              className={!prefersReducedMotion ? "transition-opacity duration-500" : ""}
            />
          </g>

          {/* Center dot */}
          <circle
            cx="50"
            cy="50"
            r="2"
            fill="hsl(var(--primary))"
            opacity={isHovered ? 0.9 : 0.6}
            className={!prefersReducedMotion ? "transition-opacity duration-300" : ""}
          />
        </svg>
      </div>

      {/* Label below */}
      <div className="mt-3 text-center">
        <span 
          className="text-xs tracking-widest uppercase text-muted-foreground/70 font-medium"
          style={{ letterSpacing: "0.15em" }}
        >
          AI Engineering
        </span>
      </div>
    </div>
  );
}
