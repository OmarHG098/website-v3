import { useState, useEffect, useRef, useCallback } from "react";
import { useSearch, useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  IconCode, 
  IconEye, 
  IconArrowLeft, 
  IconArrowRight, 
  IconList, 
  IconRefresh, 
  IconAlertTriangle,
  IconPlus,
  IconFolder,
  IconInfoCircle
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Header from "@/components/Header";
import { SectionRenderer } from "@/components/career-programs/SectionRenderer";
import type { Section } from "@shared/schema";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import jsYaml from "js-yaml";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    
    return () => {
      document.head.removeChild(meta);
    };
  }, []);
}

interface ComponentSchema {
  name: string;
  version: string;
  component: string;
  file: string;
  description: string;
  when_to_use: string;
  props: Record<string, unknown>;
}

interface ComponentExample {
  name: string;
  description: string;
  yaml: string;
  variant?: string;
}

interface ComponentVersion {
  version: string;
  schema: ComponentSchema;
  examples: ComponentExample[];
}

interface ComponentInfo {
  type: string;
  versions: ComponentVersion[];
  latestVersion: string;
}

interface RegistryOverview {
  components: Array<{
    type: string;
    name: string;
    description: string;
    latestVersion: string;
    versions: string[];
  }>;
}

function generateDefaultYaml(componentType: string, schema: ComponentSchema): string {
  const example: Record<string, unknown> = { type: componentType };
  
  if (schema.props) {
    for (const [key, prop] of Object.entries(schema.props)) {
      const propDef = prop as { example?: unknown; required?: boolean; type?: string };
      if (propDef.example !== undefined) {
        example[key] = propDef.example;
      } else if (propDef.required && propDef.type === 'string') {
        example[key] = `Example ${key}`;
      }
    }
  }
  
  return `- ${jsYaml.dump(example, { indent: 2, lineWidth: 80 }).trim().split('\n').join('\n  ')}`;
}

interface ComponentCardProps {
  componentType: string;
  componentInfo: ComponentInfo;
  globalYamlState: boolean | null;
  globalPreviewState: boolean | null;
  isFocused?: boolean;
  cardRef?: React.RefObject<HTMLDivElement>;
}

function ComponentCard({ 
  componentType, 
  componentInfo, 
  globalYamlState, 
  globalPreviewState, 
  isFocused, 
  cardRef 
}: ComponentCardProps) {
  const { toast } = useToast();
  const [selectedVersion, setSelectedVersion] = useState(componentInfo.latestVersion);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [showYaml, setShowYaml] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [showAddExampleModal, setShowAddExampleModal] = useState(false);
  const [yamlContent, setYamlContent] = useState('');
  const [parsedData, setParsedData] = useState<Section | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  const currentVersionData = componentInfo.versions.find(v => v.version === selectedVersion);
  const schema = currentVersionData?.schema;
  const examples = currentVersionData?.examples || [];

  const createVersionMutation = useMutation({
    mutationFn: async (baseVersion: string) => {
      const result = await apiRequest('POST', `/api/component-registry/${componentType}/create-version`, {
        baseVersion,
      });
      return result as unknown as { success: boolean; newVersion: string };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/component-registry'] });
      queryClient.invalidateQueries({ queryKey: ['/api/component-registry', componentType] });
      if (data.newVersion) {
        setSelectedVersion(data.newVersion);
        setSelectedExample(null);
      }
      toast({
        title: "Version created",
        description: `Created new version ${data.newVersion} for ${componentType}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create version",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (examples.length > 0 && !selectedExample) {
      setSelectedExample(examples[0].name);
    } else if (schema && !selectedExample && examples.length === 0) {
      const defaultYaml = generateDefaultYaml(componentType, schema);
      setYamlContent(defaultYaml);
      try {
        const parsed = jsYaml.load(defaultYaml);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setParsedData(parsed[0] as Section);
        }
      } catch {
        // Ignore parse errors on initial load
      }
    }
  }, [schema, componentType, selectedExample, examples]);

  useEffect(() => {
    if (selectedExample && examples.length > 0) {
      const example = examples.find(e => e.name === selectedExample);
      if (example) {
        setYamlContent(example.yaml);
        try {
          const parsed = jsYaml.load(example.yaml);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setParsedData(parsed[0] as Section);
          } else if (parsed && typeof parsed === 'object') {
            setParsedData(parsed as Section);
          }
          setParseError(null);
        } catch (err) {
          if (err instanceof Error) {
            setParseError(err.message);
          }
        }
      }
    }
  }, [selectedExample, examples]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (globalYamlState !== null) {
      setShowYaml(globalYamlState);
    }
  }, [globalYamlState]);

  useEffect(() => {
    if (globalPreviewState !== null) {
      setShowPreview(globalPreviewState);
    }
  }, [globalPreviewState]);

  const handleYamlChange = useCallback((value: string) => {
    setYamlContent(value);
    try {
      const parsed = jsYaml.load(value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setParsedData(parsed[0] as Section);
        setParseError(null);
      } else if (parsed && typeof parsed === 'object') {
        setParsedData(parsed as Section);
        setParseError(null);
      }
    } catch (err) {
      if (err instanceof Error) {
        setParseError(err.message);
      }
    }
  }, []);

  const handleReset = useCallback(() => {
    if (selectedExample && examples.length > 0) {
      const example = examples.find(e => e.name === selectedExample);
      if (example) {
        setYamlContent(example.yaml);
        try {
          const parsed = jsYaml.load(example.yaml);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setParsedData(parsed[0] as Section);
          }
        } catch {
          // Ignore
        }
      }
    } else if (schema) {
      const defaultYaml = generateDefaultYaml(componentType, schema);
      setYamlContent(defaultYaml);
      try {
        const parsed = jsYaml.load(defaultYaml);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setParsedData(parsed[0] as Section);
        }
      } catch {
        // Ignore
      }
    }
    setParseError(null);
  }, [selectedExample, examples, schema, componentType]);

  const handleVersionChange = (version: string) => {
    if (version === '__add_new__') {
      createVersionMutation.mutate(selectedVersion);
    } else {
      setSelectedVersion(version);
      setSelectedExample(null);
    }
  };

  const handleExampleChange = (example: string) => {
    if (example === '__add_new__') {
      setShowAddExampleModal(true);
    } else if (example === '__default__') {
      setSelectedExample(null);
    } else {
      setSelectedExample(example);
    }
  };

  const examplePath = `marketing-content/component-registry/${componentType}/${selectedVersion}/examples/`;

  if (!schema) {
    return null;
  }

  return (
    <>
      <Card 
        ref={cardRef}
        className={`mb-8 transition-all duration-500 ${isFocused ? 'ring-2 ring-primary ring-offset-2' : ''}`} 
        data-testid={`component-card-${componentType}`}
      >
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <CardTitle className="text-xl">{schema.name}</CardTitle>
                <Badge variant="secondary">{componentType}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{schema.description}</p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Version:</span>
                <Select value={selectedVersion} onValueChange={handleVersionChange}>
                  <SelectTrigger className="w-32" data-testid={`select-version-${componentType}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {componentInfo.versions.map(v => (
                      <SelectItem key={v.version} value={v.version}>
                        {v.version}
                      </SelectItem>
                    ))}
                    <SelectItem value="__add_new__" className="text-primary">
                      <div className="flex items-center gap-1">
                        <IconPlus className="w-3 h-3" />
                        Add new version
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Example:</span>
                <Select 
                  value={selectedExample || (examples.length > 0 ? examples[0].name : '__default__')} 
                  onValueChange={handleExampleChange}
                >
                  <SelectTrigger className="w-48" data-testid={`select-example-${componentType}`}>
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent className="min-w-[280px]">
                    {examples.length === 0 && (
                      <SelectItem value="__default__">Default (from schema)</SelectItem>
                    )}
                    {(() => {
                      // Group examples by variant
                      const grouped = examples.reduce((acc, ex) => {
                        const variant = ex.variant || 'default';
                        if (!acc[variant]) acc[variant] = [];
                        acc[variant].push(ex);
                        return acc;
                      }, {} as Record<string, typeof examples>);
                      
                      const variantOrder = ['singleColumn', 'showcase', 'twoColumn', 'default'];
                      const sortedVariants = Object.keys(grouped).sort((a, b) => {
                        const aIdx = variantOrder.indexOf(a);
                        const bIdx = variantOrder.indexOf(b);
                        return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
                      });
                      
                      const variantColors: Record<string, string> = {
                        singleColumn: 'bg-primary/10 text-primary border-primary/20',
                        showcase: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
                        twoColumn: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
                        default: 'bg-muted text-muted-foreground border-border',
                      };
                      
                      const variantLabels: Record<string, string> = {
                        singleColumn: 'Single Column',
                        showcase: 'Showcase',
                        twoColumn: 'Two Column',
                        default: 'Default',
                      };
                      
                      return sortedVariants.map(variant => (
                        <SelectGroup key={variant}>
                          <SelectLabel className="flex items-center gap-2 pl-2 py-2 border-b border-border/50 mb-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs px-2 py-0.5 font-medium ${variantColors[variant] || variantColors.default}`}
                            >
                              {variantLabels[variant] || variant}
                            </Badge>
                          </SelectLabel>
                          {grouped[variant].map(ex => (
                            <SelectItem key={ex.name} value={ex.name} className="pl-4">
                              <span className="flex items-center gap-2">
                                {ex.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ));
                    })()}
                    <SelectItem value="__add_new__" className="text-primary mt-2 border-t border-border/50 pt-2">
                      <div className="flex items-center gap-1">
                        <IconPlus className="w-3 h-3" />
                        Add new example
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {(() => {
                  const currentExample = examples.find(ex => ex.name === selectedExample);
                  if (!currentExample?.description) return null;
                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          data-testid={`button-example-info-${componentType}`}
                        >
                          <IconInfoCircle className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 text-sm">
                        <p className="font-medium mb-1">{currentExample.name}</p>
                        <p className="text-muted-foreground">{currentExample.description}</p>
                      </PopoverContent>
                    </Popover>
                  );
                })()}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    queryClient.invalidateQueries({ queryKey: ['/api/component-registry', componentType] });
                  }}
                  title="Reload examples"
                  data-testid={`button-reload-examples-${componentType}`}
                >
                  <IconRefresh className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Collapsible open={showYaml}>
            <CollapsibleContent>
              <div className="mb-4 rounded-lg overflow-hidden border border-border">
                <div className="flex items-center justify-between px-3 py-2 bg-muted border-b border-border">
                  <span className="text-xs font-medium text-muted-foreground">YAML Editor</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-6 px-2 text-xs"
                    data-testid={`button-reset-yaml-${componentType}`}
                  >
                    <IconRefresh className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                </div>
                <CodeMirror
                  value={yamlContent}
                  height="auto"
                  minHeight="100px"
                  maxHeight="400px"
                  extensions={[yaml()]}
                  theme={isDarkMode ? oneDark : undefined}
                  onChange={handleYamlChange}
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    highlightActiveLine: true,
                  }}
                  className="text-sm"
                  data-testid={`editor-yaml-${componentType}`}
                />
                {parseError && (
                  <div className="flex items-start gap-2 px-3 py-2 bg-destructive/10 border-t border-destructive/20 text-destructive text-xs">
                    <IconAlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="font-mono">{parseError}</span>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={showPreview}>
            <CollapsibleContent>
              <div className="border rounded-lg overflow-hidden bg-background">
                <div className="p-0">
                  {parsedData && <SectionRenderer sections={[parsedData]} />}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      <Dialog open={showAddExampleModal} onOpenChange={setShowAddExampleModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconFolder className="w-5 h-5" />
              Add New Example for {schema?.name || componentType}
            </DialogTitle>
            <DialogDescription>
              Create a new YAML example file demonstrating a specific use case.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Step 1: Create File</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Create a new <code className="px-1 bg-muted rounded">.yml</code> file in:
              </p>
              <code className="block p-3 bg-muted rounded-lg text-sm break-all">
                {examplePath}
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                Use descriptive names like <code className="px-1 bg-muted/50 rounded">minimal.yml</code>, <code className="px-1 bg-muted/50 rounded">with-all-features.yml</code>, or <code className="px-1 bg-muted/50 rounded">spanish-content.yml</code>
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Step 2: File Structure</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Each example file must have <code className="px-1 bg-muted rounded">name</code>, <code className="px-1 bg-muted rounded">description</code>, and <code className="px-1 bg-muted rounded">yaml</code> fields:
              </p>
              <pre className="p-3 bg-muted rounded-lg text-sm overflow-x-auto">
{`name: "Descriptive Example Name"
description: "When and why to use this variant"
yaml: |
  - type: ${componentType}
    version: "${selectedVersion}"
${schema?.props ? Object.entries(schema.props).slice(0, 4).map(([key, prop]) => {
  const p = prop as { type?: string; example?: unknown };
  const example = p.example !== undefined ? 
    (typeof p.example === 'string' ? `"${p.example}"` : JSON.stringify(p.example)) : 
    (p.type === 'string' ? '"..."' : '...');
  return `    ${key}: ${example}`;
}).join('\n') : '    # props here'}`}
              </pre>
            </div>
            
            {schema?.props && Object.keys(schema.props).length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Available Props</h4>
                <div className="max-h-32 overflow-y-auto p-2 bg-muted/50 rounded-lg">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(schema.props).map(([key, prop]) => {
                      const p = prop as { required?: boolean };
                      return (
                        <Badge 
                          key={key} 
                          variant={p.required ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {key}{p.required ? '*' : ''}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">* = required</p>
              </div>
            )}
            
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                After creating the file, refresh this page to see your new example in the dropdown.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function ComponentShowcase() {
  useNoIndex();
  
  const { componentType } = useParams<{ componentType?: string }>();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const focusedComponent = searchParams.get('focus');
  
  const [globalYamlState, setGlobalYamlState] = useState<boolean | null>(null);
  const [globalPreviewState, setGlobalPreviewState] = useState<boolean | null>(null);
  const [yamlExpanded, setYamlExpanded] = useState(false);
  const [previewExpanded, setPreviewExpanded] = useState(true);
  const [yamlTrigger, setYamlTrigger] = useState(0);
  const [previewTrigger, setPreviewTrigger] = useState(0);
  const [highlightedComponent, setHighlightedComponent] = useState<string | null>(focusedComponent);
  
  const cardRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});

  const { data: registry, isLoading: registryLoading } = useQuery<RegistryOverview>({
    queryKey: ['/api/component-registry'],
  });

  const { data: singleComponent, isLoading: singleLoading } = useQuery<ComponentInfo>({
    queryKey: ['/api/component-registry', componentType],
    enabled: !!componentType,
  });

  const components = registry?.components || [];
  
  components.forEach(comp => {
    if (!cardRefs.current[comp.type]) {
      cardRefs.current[comp.type] = { current: null } as React.RefObject<HTMLDivElement>;
    }
  });
  
  useEffect(() => {
    if (focusedComponent && cardRefs.current[focusedComponent]?.current) {
      setTimeout(() => {
        cardRefs.current[focusedComponent]?.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
      
      setTimeout(() => {
        setHighlightedComponent(null);
      }, 3000);
    }
  }, [focusedComponent]);

  const toggleAllYaml = () => {
    const newState = !yamlExpanded;
    setYamlExpanded(newState);
    setGlobalYamlState(newState);
    setYamlTrigger(prev => prev + 1);
  };

  const toggleAllPreview = () => {
    const newState = !previewExpanded;
    setPreviewExpanded(newState);
    setGlobalPreviewState(newState);
    setPreviewTrigger(prev => prev + 1);
  };

  // Single component view
  if (componentType) {
    if (singleLoading) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-muted-foreground">Loading component...</p>
            </div>
          </main>
        </div>
      );
    }

    if (!singleComponent) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Component Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The component "{componentType}" does not exist.
              </p>
              <Link href="/component-showcase">
                <Button variant="outline" data-testid="link-back-to-showcase">
                  <IconList className="w-4 h-4 mr-2" />
                  View All Components
                </Button>
              </Link>
            </div>
          </main>
        </div>
      );
    }

    const currentIndex = components.findIndex(c => c.type === componentType);
    const prevComponent = currentIndex > 0 ? components[currentIndex - 1] : null;
    const nextComponent = currentIndex < components.length - 1 ? components[currentIndex + 1] : null;

    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <ComponentCard 
              key={componentType} 
              componentType={componentType}
              componentInfo={singleComponent}
              globalYamlState={true}
              globalPreviewState={true}
              isFocused={false}
              cardRef={cardRefs.current[componentType]}
            />
          </div>

          <div className="max-w-4xl mx-auto mt-8 flex items-center justify-between">
            {prevComponent ? (
              <Link href={`/component-showcase/${prevComponent.type}`}>
                <Button variant="outline" data-testid="link-prev-component">
                  <IconArrowLeft className="w-4 h-4 mr-2" />
                  {prevComponent.name}
                </Button>
              </Link>
            ) : (
              <div />
            )}
            
            {nextComponent ? (
              <Link href={`/component-showcase/${nextComponent.type}`}>
                <Button variant="outline" data-testid="link-next-component">
                  {nextComponent.name}
                  <IconArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </main>
      </div>
    );
  }

  // All components view
  if (registryLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground">Loading components...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-showcase-title">
            Component Showcase
          </h1>
          <p className="text-muted-foreground mb-6">
            This page displays all available section components for career program pages. 
            Each component shows the YAML configuration and a live preview.
          </p>
          
          <div className="flex items-center gap-4 mb-8 p-4 bg-muted rounded-lg flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <p className="font-medium">Components Registry</p>
              <p className="text-sm text-muted-foreground">
                See <code className="bg-background px-1 rounded">marketing-content/component-registry/</code> for schemas and examples
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={yamlExpanded ? "default" : "outline"}
                onClick={toggleAllYaml}
                data-testid="button-toggle-all-yaml"
              >
                <IconCode className="w-4 h-4 mr-1" />
                {yamlExpanded ? "Hide All YAML" : "Show All YAML"}
              </Button>
              <Button
                variant={previewExpanded ? "default" : "outline"}
                onClick={toggleAllPreview}
                data-testid="button-toggle-all-preview"
              >
                <IconEye className="w-4 h-4 mr-1" />
                {previewExpanded ? "Hide All Previews" : "Show All Previews"}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <AllComponentsLoader 
            components={components}
            globalYamlState={globalYamlState}
            globalPreviewState={globalPreviewState}
            yamlTrigger={yamlTrigger}
            previewTrigger={previewTrigger}
            highlightedComponent={highlightedComponent}
            cardRefs={cardRefs}
          />
        </div>
      </main>
    </div>
  );
}

interface AllComponentsLoaderProps {
  components: RegistryOverview['components'];
  globalYamlState: boolean | null;
  globalPreviewState: boolean | null;
  yamlTrigger: number;
  previewTrigger: number;
  highlightedComponent: string | null;
  cardRefs: React.MutableRefObject<Record<string, React.RefObject<HTMLDivElement>>>;
}

function AllComponentsLoader({ 
  components, 
  globalYamlState, 
  globalPreviewState, 
  yamlTrigger, 
  previewTrigger,
  highlightedComponent,
  cardRefs 
}: AllComponentsLoaderProps) {
  return (
    <>
      {components.map((comp) => (
        <ComponentCardLoader
          key={`${comp.type}-${yamlTrigger}-${previewTrigger}`}
          componentType={comp.type}
          globalYamlState={globalYamlState}
          globalPreviewState={globalPreviewState}
          isFocused={highlightedComponent === comp.type}
          cardRef={cardRefs.current[comp.type]}
        />
      ))}
    </>
  );
}

interface ComponentCardLoaderProps {
  componentType: string;
  globalYamlState: boolean | null;
  globalPreviewState: boolean | null;
  isFocused: boolean;
  cardRef?: React.RefObject<HTMLDivElement>;
}

function ComponentCardLoader({ 
  componentType, 
  globalYamlState, 
  globalPreviewState, 
  isFocused,
  cardRef 
}: ComponentCardLoaderProps) {
  const { data: componentInfo, isLoading } = useQuery<ComponentInfo>({
    queryKey: ['/api/component-registry', componentType],
  });

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-72 bg-muted animate-pulse rounded mt-2" />
        </CardHeader>
      </Card>
    );
  }

  if (!componentInfo) {
    return null;
  }

  return (
    <ComponentCard
      componentType={componentType}
      componentInfo={componentInfo}
      globalYamlState={globalYamlState}
      globalPreviewState={globalPreviewState}
      isFocused={isFocused}
      cardRef={cardRef}
    />
  );
}
