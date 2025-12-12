import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  IconX, 
  IconRefresh,
  IconRocket,
  IconLayoutColumns,
  IconArrowRight,
  IconBrain,
  IconUsers,
  IconCreditCard,
  IconFolderCode,
  IconBook,
  IconSparkles,
  IconCertificate,
  IconBuildingSkyscraper,
  IconMessage,
  IconQuestionMark,
  IconLayoutBottombar,
  IconChartBar,
  IconTable,
  IconCheck,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDebugToken } from "@/hooks/useDebugAuth";

interface ComponentPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  insertIndex: number;
  contentType?: "program" | "landing" | "location" | "page";
  slug?: string;
  locale?: string;
  onSectionAdded?: () => void;
}

interface ComponentInfo {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface ExampleFile {
  name: string;
  slug: string;
  variant?: string;
  content: Record<string, unknown>;
}

const componentsList: ComponentInfo[] = [
  { type: "hero", label: "Hero", icon: IconRocket, description: "Main banner section" },
  { type: "two_column", label: "Two Column", icon: IconLayoutColumns, description: "Flexible two-column layout" },
  { type: "comparison_table", label: "Comparison Table", icon: IconTable, description: "Feature comparison with competitors" },
  { type: "features_grid", label: "Features Grid", icon: IconLayoutColumns, description: "Grid of cards - highlight or detailed variants" },
  { type: "numbered_steps", label: "Numbered Steps", icon: IconArrowRight, description: "Vertical timeline with numbered steps" },
  { type: "ai_learning", label: "AI Learning", icon: IconBrain, description: "AI tools showcase" },
  { type: "mentorship", label: "Mentorship", icon: IconUsers, description: "Support options" },
  { type: "pricing", label: "Pricing", icon: IconCreditCard, description: "Subscription pricing card" },
  { type: "projects", label: "Projects", icon: IconFolderCode, description: "Real-world project carousel" },
  { type: "project_showcase", label: "Project Showcase", icon: IconChartBar, description: "Graduate project with creators" },
  { type: "syllabus", label: "Syllabus", icon: IconBook, description: "Expandable curriculum modules" },
  { type: "why_learn_ai", label: "Why Learn AI", icon: IconSparkles, description: "AI motivation section" },
  { type: "certificate", label: "Certificate", icon: IconCertificate, description: "Certificate preview" },
  { type: "whos_hiring", label: "Who's Hiring", icon: IconBuildingSkyscraper, description: "Logo carousel of hiring companies" },
  { type: "testimonials", label: "Testimonials", icon: IconMessage, description: "Student reviews and success stories" },
  { type: "testimonials_slide", label: "Testimonials Slide", icon: IconMessage, description: "Sliding marquee testimonials with photos" },
  { type: "faq", label: "FAQ", icon: IconQuestionMark, description: "Accordion questions" },
  { type: "cta_banner", label: "CTA Banner", icon: IconArrowRight, description: "Call-to-action section" },
  { type: "footer", label: "Footer", icon: IconLayoutBottombar, description: "Copyright notice" },
  { type: "award_badges", label: "Award Badges", icon: IconCertificate, description: "Award logos with mobile carousel" },
];

const variantLabels: Record<string, string> = {
  singleColumn: "Single Column",
  showcase: "Showcase",
  productShowcase: "Product Showcase",
  simpleTwoColumn: "Two Column",
  default: "Default",
};

export default function ComponentPickerModal({
  isOpen,
  onClose,
  insertIndex,
  contentType,
  slug,
  locale,
  onSectionAdded,
}: ComponentPickerModalProps) {
  const [step, setStep] = useState<"select" | "configure">("select");
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null);
  const [versions, setVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [examples, setExamples] = useState<ExampleFile[]>([]);
  const [selectedExample, setSelectedExample] = useState<string>("");
  const [exampleContent, setExampleContent] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (selectedComponent) {
      setIsLoading(true);
      fetch(`/api/component-registry/${selectedComponent.type}/versions`)
        .then(res => res.json())
        .then(data => {
          const vers = data.versions || [];
          setVersions(vers);
          if (vers.length > 0) {
            setSelectedVersion(vers[vers.length - 1]);
          }
        })
        .catch(() => setVersions([]))
        .finally(() => setIsLoading(false));
    }
  }, [selectedComponent]);

  useEffect(() => {
    if (selectedComponent && selectedVersion) {
      setIsLoading(true);
      fetch(`/api/component-registry/${selectedComponent.type}/${selectedVersion}/examples`)
        .then(res => res.json())
        .then(data => {
          const exs = data.examples || [];
          setExamples(exs);
          if (exs.length > 0) {
            setSelectedExample(exs[0].slug);
          }
        })
        .catch(() => setExamples([]))
        .finally(() => setIsLoading(false));
    }
  }, [selectedComponent, selectedVersion]);

  useEffect(() => {
    if (selectedExample && examples.length > 0) {
      const example = examples.find(e => e.slug === selectedExample);
      if (example) {
        setExampleContent(example.content);
      }
    }
  }, [selectedExample, examples]);

  const handleSelectComponent = useCallback((component: ComponentInfo) => {
    setSelectedComponent(component);
    setStep("configure");
    setVersions([]);
    setExamples([]);
    setSelectedVersion("");
    setSelectedExample("");
    setExampleContent(null);
  }, []);

  const handleBack = useCallback(() => {
    setStep("select");
    setSelectedComponent(null);
    setVersions([]);
    setExamples([]);
    setSelectedVersion("");
    setSelectedExample("");
    setExampleContent(null);
  }, []);

  const handleAddSection = useCallback(async () => {
    if (!exampleContent || !selectedComponent || !contentType || !slug || !locale) {
      return;
    }

    setIsAdding(true);
    
    try {
      const sectionToAdd = {
        type: selectedComponent.type,
        version: selectedVersion,
        ...exampleContent,
      };

      const token = getDebugToken();
      const response = await fetch("/api/content/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Token ${token}` } : {}),
        },
        body: JSON.stringify({
          contentType: contentType === "program" ? "programs" : 
                       contentType === "landing" ? "landings" :
                       contentType === "location" ? "locations" : "pages",
          slug,
          locale,
          operations: [{
            type: "add_item",
            path: "sections",
            value: sectionToAdd,
            index: insertIndex,
          }],
        }),
      });

      if (response.ok) {
        onSectionAdded?.();
        onClose();
        window.location.reload();
      } else {
        console.error("Failed to add section");
      }
    } catch (error) {
      console.error("Error adding section:", error);
    } finally {
      setIsAdding(false);
    }
  }, [exampleContent, selectedComponent, selectedVersion, contentType, slug, locale, insertIndex, onSectionAdded, onClose]);

  const previewUrl = useMemo(() => {
    if (!selectedComponent || !selectedVersion || !selectedExample) {
      return null;
    }
    return `/component-showcase/${selectedComponent.type}?version=${selectedVersion}&example=${selectedExample}`;
  }, [selectedComponent, selectedVersion, selectedExample]);

  const groupedExamples = useMemo(() => {
    const grouped = examples.reduce((acc, ex) => {
      const variant = ex.variant || 'default';
      if (!acc[variant]) acc[variant] = [];
      acc[variant].push(ex);
      return acc;
    }, {} as Record<string, ExampleFile[]>);
    
    const variantOrder = ['singleColumn', 'showcase', 'productShowcase', 'simpleTwoColumn', 'default'];
    const sortedVariants = Object.keys(grouped).sort((a, b) => {
      const aIdx = variantOrder.indexOf(a);
      const bIdx = variantOrder.indexOf(b);
      if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
      if (aIdx === -1) return 1;
      if (bIdx === -1) return -1;
      return aIdx - bIdx;
    });
    
    return { grouped, sortedVariants };
  }, [examples]);

  const renderExampleSelector = () => {
    const { grouped, sortedVariants } = groupedExamples;
    
    if (sortedVariants.length === 0) {
      return null;
    }
    
    if (sortedVariants.length === 1 && sortedVariants[0] === 'default') {
      return grouped['default'].map(ex => (
        <SelectItem key={ex.slug} value={ex.slug}>{ex.name}</SelectItem>
      ));
    }
    
    return sortedVariants.map(variant => (
      <SelectGroup key={variant}>
        <SelectLabel className="text-xs text-muted-foreground uppercase tracking-wide">
          {variantLabels[variant] || variant}
        </SelectLabel>
        {grouped[variant].map(ex => (
          <SelectItem key={ex.slug} value={ex.slug}>{ex.name}</SelectItem>
        ))}
      </SelectGroup>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>
              {step === "select" ? "Choose a Component" : `Configure ${selectedComponent?.label}`}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <IconX className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="sr-only">
            {step === "select" ? "Select a component type to add to the page" : "Configure the component version and example"}
          </DialogDescription>
        </DialogHeader>
        
        {step === "select" ? (
          <ScrollArea className="flex-1 p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {componentsList.map((component) => {
                const Icon = component.icon;
                return (
                  <button
                    key={component.type}
                    onClick={() => handleSelectComponent(component)}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left"
                    data-testid={`component-option-${component.type}`}
                  >
                    <div className="p-3 rounded-full bg-muted">
                      <Icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{component.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{component.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b flex items-center gap-4 flex-shrink-0 flex-wrap">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                Back
              </Button>
              
              <div className="flex items-center gap-4 flex-1 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Version:</span>
                  <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                    <SelectTrigger className="w-24" data-testid="select-version">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {versions.map((v) => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Example:</span>
                  <Select value={selectedExample} onValueChange={setSelectedExample}>
                    <SelectTrigger className="w-64" data-testid="select-example">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {renderExampleSelector()}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={handleAddSection}
                disabled={!exampleContent || isAdding}
                data-testid="button-add-component"
              >
                {isAdding ? (
                  <>
                    <IconRefresh className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <IconCheck className="h-4 w-4 mr-2" />
                    Add Section
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex-1 overflow-hidden bg-muted/30">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <IconRefresh className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : previewUrl ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-0"
                  title="Component Preview"
                  data-testid="component-preview-iframe"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a version and example to preview
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
