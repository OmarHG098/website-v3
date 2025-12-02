import { useState, useEffect, useRef, useCallback } from "react";
import { useSearch, useParams, Link } from "wouter";
import { IconChevronDown, IconCode, IconEye, IconArrowLeft, IconArrowRight, IconList, IconRefresh, IconAlertTriangle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import Header from "@/components/Header";
import { SectionRenderer } from "@/components/career-programs/SectionRenderer";
import type { Section } from "@shared/schema";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import jsYaml from "js-yaml";

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

interface ComponentSample {
  type: string;
  name: string;
  description: string;
  yaml: string;
  data: Section;
}

const componentSamples: ComponentSample[] = [
  {
    type: "hero",
    name: "Hero Section",
    description: "Main banner with title, subtitle, badge, and call-to-action buttons",
    yaml: `- type: hero
  badge: "Career Program"
  title: "Full Stack Development with AI"
  subtitle: "Learn at your own pace with AI-powered tools..."
  cta_buttons:
    - text: "Start Learning Now"
      url: "/signup"
      variant: "primary"
      icon: "Rocket"
    - text: "Download Syllabus"
      url: "/syllabus"
      variant: "outline"
      icon: "Download"`,
    data: {
      type: "hero",
      badge: "Career Program",
      title: "Full Stack Development with AI",
      subtitle: "Learn at your own pace with AI-powered tools, unlimited mentorship, and a global community.",
      cta_buttons: [
        { text: "Start Learning Now", url: "/signup", variant: "primary", icon: "Rocket" },
        { text: "Download Syllabus", url: "/syllabus", variant: "outline", icon: "Download" },
      ],
    },
  },
  {
    type: "program_overview",
    name: "Program Overview",
    description: "Grid of cards highlighting key program characteristics",
    yaml: `- type: program_overview
  title: "Program Overview"
  subtitle: "Everything you need to become a professional developer"
  cards:
    - icon: "DeviceLaptop"
      title: "Self-Paced Learning"
      description: "Learn on your own schedule with 24/7 access"
    - icon: "Code"
      title: "No Prerequisites"
      description: "Start from scratch - we teach fundamentals first"
    - icon: "Rocket"
      title: "Beginner Friendly"
      description: "Designed for complete beginners"`,
    data: {
      type: "program_overview",
      title: "Program Overview",
      subtitle: "Everything you need to become a professional developer",
      cards: [
        { icon: "DeviceLaptop", title: "Self-Paced Learning", description: "Learn on your own schedule with 24/7 access to all materials" },
        { icon: "Code", title: "No Prerequisites", description: "Start from scratch - we teach you the fundamentals first" },
        { icon: "Rocket", title: "Beginner Friendly", description: "Designed for complete beginners with no prior experience" },
      ],
    },
  },
  {
    type: "ai_learning",
    name: "AI Learning Section",
    description: "Showcases AI-powered learning tools with an interactive chat example",
    yaml: `- type: ai_learning
  badge: "AI-Powered"
  title: "Learn Faster with AI Support"
  description: "Our AI tools provide instant feedback..."
  features:
    - icon: "Brain"
      title: "Rigobot AI Tutor"
      description: "Your personal AI coding assistant..."
    - icon: "Code"
      title: "LearnPack Software"
      description: "Interactive exercises with instant feedback"
  chat_example:
    bot_name: "Rigobot"
    bot_status: "AI Tutor - Online"
    user_message: "I'm stuck on this React component..."
    bot_response: "I see the issue! Your useEffect is missing..."`,
    data: {
      type: "ai_learning",
      badge: "AI-Powered",
      title: "Learn Faster with AI Support",
      description: "Our proprietary AI tools provide instant feedback, personalized guidance, and real-time code review.",
      features: [
        { icon: "Brain", title: "Rigobot AI Tutor", description: "Your personal AI coding assistant that reviews your code and provides instant feedback 24/7." },
        { icon: "Code", title: "LearnPack Software", description: "Our custom learning platform with interactive exercises and automated tests." },
      ],
      chat_example: {
        bot_name: "Rigobot",
        bot_status: "AI Tutor - Online",
        user_message: "I'm stuck on this React component. Can you help?",
        bot_response: "I see the issue! Your useEffect is missing a dependency. Let me show you how to fix it...",
      },
    },
  },
  {
    type: "mentorship",
    name: "Mentorship Section",
    description: "Grid of cards showing mentorship and support options",
    yaml: `- type: mentorship
  title: "Mentorship & Support"
  subtitle: "You're never alone in your learning journey"
  cards:
    - icon: "CalendarEvent"
      title: "Monthly Sessions"
      description: "Regular mentorship sessions with experts"
    - icon: "Headset"
      title: "1-on-1 Sessions"
      description: "Private 45-minute sessions with mentors"
    - icon: "Users"
      title: "Active Community"
      description: "Daily live workshops and peer collaboration"`,
    data: {
      type: "mentorship",
      title: "Mentorship & Support",
      subtitle: "You're never alone in your learning journey. Get help when you need it.",
      cards: [
        { icon: "CalendarEvent", title: "Monthly Sessions", description: "Regular mentorship sessions with expert developers to guide your progress." },
        { icon: "Headset", title: "1-on-1 Sessions", description: "Schedule private 45-minute sessions with mentors for personalized help." },
        { icon: "Users", title: "Active Community", description: "Join thousands of learners with daily live workshops and peer collaboration." },
      ],
    },
  },
  {
    type: "features_checklist",
    name: "Features Checklist",
    description: "Grid of checkmark items highlighting program benefits",
    yaml: `- type: features_checklist
  title: "What You Get"
  items:
    - text: "Learn at your own pace"
    - text: "AI reviews your code instantly"
    - text: "Monthly mentorship sessions"
    - text: "Active learning community"
    - text: "Optional live workshops"
    - text: "4Geeks certificate"`,
    data: {
      type: "features_checklist",
      title: "What You Get",
      items: [
        { text: "Learn at your own pace" },
        { text: "AI reviews your code instantly" },
        { text: "Monthly mentorship sessions" },
        { text: "Active learning community" },
        { text: "Optional live workshops" },
        { text: "4Geeks certificate" },
      ],
    },
  },
  {
    type: "tech_stack",
    name: "Tech Stack Section",
    description: "Grid of technology icons showing what students will learn",
    yaml: `- type: tech_stack
  title: "Technologies You'll Master"
  subtitle: "Learn the most in-demand technologies"
  technologies:
    - "HTML5"
    - "CSS3"
    - "JavaScript"
    - "Python"
    - "React"
    - "Node.js"
  extras_text: "+ APIs, Git, SQL, REST, and AI tools"`,
    data: {
      type: "tech_stack",
      title: "Technologies You'll Master",
      subtitle: "Learn the most in-demand technologies used by professional developers worldwide",
      technologies: ["HTML5", "CSS3", "JavaScript", "Python", "React", "Node.js"],
      extras_text: "+ APIs, Git, SQL, REST, and AI-powered development tools like Cursor & Copilot",
    },
  },
  {
    type: "certificate",
    name: "Certificate Section",
    description: "Highlights the certificate and career network benefits",
    yaml: `- type: certificate
  title: "Certificate & Career Network"
  description: "Receive a globally recognized certificate..."
  benefits:
    - text: "Recognized by international institutions"
    - text: "Access to 5,000+ hiring partners"
    - text: "Lifetime career support"
  card:
    title: "Full Stack Developer"
    subtitle: "4Geeks Academy Certificate"`,
    data: {
      type: "certificate",
      title: "Certificate & Career Network",
      description: "Upon completion, receive a globally recognized certificate that opens doors to professional opportunities worldwide.",
      benefits: [
        { text: "Recognized by international institutions" },
        { text: "Access to 5,000+ hiring partners" },
        { text: "Lifetime career support" },
      ],
      card: {
        title: "Full Stack Developer",
        subtitle: "4Geeks Academy Certificate",
      },
    },
  },
  {
    type: "faq",
    name: "FAQ Section",
    description: "Collapsible accordion with frequently asked questions",
    yaml: `- type: faq
  title: "Frequently Asked Questions"
  items:
    - question: "Are there fixed class times?"
      answer: "No, the self-paced bootcamp is designed for..."
    - question: "Do I need prior coding experience?"
      answer: "No prior experience is required..."
    - question: "Is the certificate recognized?"
      answer: "Yes! Our certificate is recognized worldwide..."`,
    data: {
      type: "faq",
      title: "Frequently Asked Questions",
      items: [
        { question: "Are there fixed class times?", answer: "No, the self-paced bootcamp is designed for learning at your own pace. You can access all materials 24/7." },
        { question: "Do I need prior coding experience?", answer: "No prior experience is required. Our bootcamp starts with the fundamentals and teaches you everything from scratch." },
        { question: "Is the certificate recognized by employers?", answer: "Yes! Our certificate is recognized by employers worldwide. We're licensed by the Florida Department of Education." },
      ],
    },
  },
  {
    type: "credibility",
    name: "Credibility Section",
    description: "Stats cards and featured logos showing social proof",
    yaml: `- type: credibility
  title: "Trusted by Thousands"
  stats:
    - value: "4,000+"
      label: "Graduates"
    - value: "84%"
      label: "Job Placement Rate"
    - value: "4.9/5"
      label: "Student Rating"
    - value: "30+"
      label: "Countries"
  featured_in:
    label: "Featured In"
    logos:
      - "Forbes"
      - "Newsweek"
      - "Course Report"
      - "SwitchUp"`,
    data: {
      type: "credibility",
      title: "Trusted by Thousands",
      stats: [
        { value: "4,000+", label: "Graduates" },
        { value: "84%", label: "Job Placement Rate" },
        { value: "4.9/5", label: "Student Rating" },
        { value: "30+", label: "Countries" },
      ],
      featured_in: {
        label: "Featured In",
        logos: ["Forbes", "Newsweek", "Course Report", "SwitchUp"],
      },
    },
  },
  {
    type: "footer_cta",
    name: "Footer CTA Section",
    description: "Full-width call-to-action section with primary background",
    yaml: `- type: footer_cta
  title: "Ready to Start Your Tech Career?"
  subtitle: "Join thousands of graduates who have transformed..."
  buttons:
    - text: "Start Learning Now"
      url: "/signup"
      variant: "secondary"
    - text: "Talk to an Advisor"
      url: "/contact"
      variant: "outline"`,
    data: {
      type: "footer_cta",
      title: "Ready to Start Your Tech Career?",
      subtitle: "Join thousands of graduates who have transformed their careers with 4Geeks.",
      buttons: [
        { text: "Start Learning Now", url: "/signup", variant: "secondary" },
        { text: "Talk to an Advisor", url: "/contact", variant: "outline" },
      ],
    },
  },
  {
    type: "footer",
    name: "Footer Section",
    description: "Simple footer with copyright notice",
    yaml: `- type: footer
  copyright_text: "2024 4Geeks. All rights reserved."`,
    data: {
      type: "footer",
      copyright_text: "2024 4Geeks. All rights reserved.",
    },
  },
];

interface ComponentCardProps {
  sample: ComponentSample;
  globalYamlState: boolean | null;
  globalPreviewState: boolean | null;
  isFocused?: boolean;
  cardRef?: React.RefObject<HTMLDivElement>;
}

function ComponentCard({ sample, globalYamlState, globalPreviewState, isFocused, cardRef }: ComponentCardProps) {
  const [showYaml, setShowYaml] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [yamlContent, setYamlContent] = useState(sample.yaml);
  const [parsedData, setParsedData] = useState<Section>(sample.data);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

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
    setYamlContent(sample.yaml);
    setParsedData(sample.data);
    setParseError(null);
  }, [sample.yaml, sample.data]);

  return (
    <Card 
      ref={cardRef}
      className={`mb-8 transition-all duration-500 ${isFocused ? 'ring-2 ring-primary ring-offset-2' : ''}`} 
      data-testid={`component-card-${sample.type}`}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <CardTitle className="text-xl">{sample.name}</CardTitle>
            <Badge variant="secondary">{sample.type}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{sample.description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showYaml ? "default" : "outline"}
            size="sm"
            onClick={() => setShowYaml(!showYaml)}
            data-testid={`button-yaml-${sample.type}`}
          >
            <IconCode className="w-4 h-4 mr-1" />
            YAML
          </Button>
          <Button
            variant={showPreview ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            data-testid={`button-preview-${sample.type}`}
          >
            <IconEye className="w-4 h-4 mr-1" />
            Preview
          </Button>
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
                  data-testid={`button-reset-yaml-${sample.type}`}
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
                data-testid={`editor-yaml-${sample.type}`}
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
                <SectionRenderer sections={[parsedData]} />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
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
  
  componentSamples.forEach(sample => {
    if (!cardRefs.current[sample.type]) {
      cardRefs.current[sample.type] = { current: null } as React.RefObject<HTMLDivElement>;
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
    const currentIndex = componentSamples.findIndex(s => s.type === componentType);
    const sample = componentSamples[currentIndex];
    
    if (!sample) {
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

    const prevComponent = currentIndex > 0 ? componentSamples[currentIndex - 1] : null;
    const nextComponent = currentIndex < componentSamples.length - 1 ? componentSamples[currentIndex + 1] : null;

    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/component-showcase">
                <Button variant="ghost" size="sm" data-testid="link-back-to-all">
                  <IconArrowLeft className="w-4 h-4 mr-1" />
                  All Components
                </Button>
              </Link>
              <span className="text-muted-foreground text-sm">
                {currentIndex + 1} of {componentSamples.length}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-2" data-testid="text-component-title">
              {sample.name}
            </h1>
            <p className="text-muted-foreground mb-6">
              {sample.description}
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <ComponentCard 
              key={sample.type} 
              sample={sample} 
              globalYamlState={true}
              globalPreviewState={true}
              isFocused={false}
              cardRef={cardRefs.current[sample.type]}
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
                See <code className="bg-background px-1 rounded">marketing-content/components-registry.yml</code> for full documentation
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
          {componentSamples.map((sample) => (
            <ComponentCard 
              key={`${sample.type}-${yamlTrigger}-${previewTrigger}`} 
              sample={sample} 
              globalYamlState={globalYamlState}
              globalPreviewState={globalPreviewState}
              isFocused={highlightedComponent === sample.type}
              cardRef={cardRefs.current[sample.type]}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
