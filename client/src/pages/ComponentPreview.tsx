import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import jsYaml from "js-yaml";
import { SectionRenderer } from "@/components/SectionRenderer";
import type { Section } from "@shared/schema";
import { IconRefresh } from "@tabler/icons-react";

export default function ComponentPreview() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  
  const componentType = searchParams.get("type");
  const version = searchParams.get("version") || "v1.0";
  const exampleName = searchParams.get("example");
  
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!componentType || !exampleName) {
      setError("Missing type or example parameter");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    fetch(`/api/component-registry/${componentType}/${version}/examples`)
      .then(res => res.json())
      .then(data => {
        const examples = data.examples || [];
        const example = examples.find((ex: { name: string }) => ex.name === exampleName);
        
        if (!example) {
          setError(`Example "${exampleName}" not found`);
          return;
        }

        try {
          const parsed = jsYaml.load(example.yaml);
          if (Array.isArray(parsed)) {
            setSections(parsed as Section[]);
          } else if (parsed && typeof parsed === 'object') {
            setSections([parsed as Section]);
          }
        } catch (e) {
          setError("Failed to parse example YAML");
        }
      })
      .catch(() => setError("Failed to load examples"))
      .finally(() => setIsLoading(false));
  }, [componentType, version, exampleName]);

  useEffect(() => {
    const isDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-background">
        <IconRefresh className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-background text-muted-foreground text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-background">
      {sections.length > 0 ? (
        <SectionRenderer sections={sections} />
      ) : (
        <div className="flex items-center justify-center min-h-[200px] text-muted-foreground text-sm">
          No content to display
        </div>
      )}
    </div>
  );
}
