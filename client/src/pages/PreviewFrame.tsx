import { useState, useEffect, useRef, useCallback } from "react";
import { SectionRenderer } from "@/components/SectionRenderer";
import type { Section } from "@shared/schema";

export default function PreviewFrame() {
  const [sections, setSections] = useState<Section[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const containerRef = useRef<HTMLDivElement>(null);

  const reportHeight = useCallback(() => {
    if (containerRef.current && window.parent !== window) {
      const height = containerRef.current.scrollHeight;
      window.parent.postMessage({ type: 'preview-height', height }, '*');
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'preview-update') {
        setSections(event.data.sections || []);
      }
      if (event.data?.type === 'theme-update') {
        setTheme(event.data.theme || 'light');
      }
    };

    window.addEventListener('message', handleMessage);

    if (window.parent !== window) {
      window.parent.postMessage({ type: 'preview-ready' }, '*');
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Report height after sections render
  useEffect(() => {
    if (sections.length > 0) {
      // Use multiple timeouts to catch height after images load
      const timeouts = [50, 200, 500, 1000].map(delay => 
        setTimeout(reportHeight, delay)
      );
      return () => timeouts.forEach(clearTimeout);
    }
  }, [sections, reportHeight]);

  // Also use ResizeObserver for dynamic content changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver(() => {
      reportHeight();
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [reportHeight]);

  return (
    <div ref={containerRef} className="bg-background">
      {sections.length > 0 ? (
        <SectionRenderer sections={sections} />
      ) : (
        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
          Loading preview...
        </div>
      )}
    </div>
  );
}
