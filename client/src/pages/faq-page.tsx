import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { isDebugModeActive } from "@/hooks/useDebugAuth";
import Header from "@/components/Header";
import {
  centralizedFaqs,
  AVAILABLE_RELATED_FEATURES,
  type FaqItem,
  type RelatedFeature,
} from "@/data/faqs";

interface GroupedFaqs {
  feature: RelatedFeature;
  label: string;
  faqs: FaqItem[];
}

const featureLabels: Record<string, Record<RelatedFeature, string>> = {
  en: {
    "online-platform": "Online Platform",
    "mentors-and-teachers": "Mentors and Teachers",
    "price": "Pricing",
    "career-support": "Career Support",
    "content-and-syllabus": "Content and Syllabus",
    "job-guarantee": "Job Guarantee",
    "full-stack": "Full Stack Development",
    "cybersecurity": "Cybersecurity",
    "data-science": "Data Science",
    "applied-ai": "Applied AI",
    "ai-engineering": "AI Engineering",
    "outcomes": "Outcomes",
    "scholarships": "Scholarships",
    "rigobot": "Rigobot",
    "learnpack": "LearnPack",
    "certification": "Certification",
  },
  es: {
    "online-platform": "Plataforma Online",
    "mentors-and-teachers": "Mentores y Profesores",
    "price": "Precios",
    "career-support": "Soporte de Carrera",
    "content-and-syllabus": "Contenido y Syllabus",
    "job-guarantee": "Garantía de Empleo",
    "full-stack": "Desarrollo Full Stack",
    "cybersecurity": "Ciberseguridad",
    "data-science": "Ciencia de Datos",
    "applied-ai": "IA Aplicada",
    "ai-engineering": "Ingeniería de IA",
    "outcomes": "Resultados",
    "scholarships": "Becas",
    "rigobot": "Rigobot",
    "learnpack": "LearnPack",
    "certification": "Certificación",
  },
};

const pageContent = {
  en: {
    breadcrumb: "Coding Bootcamp FAQs",
    title: "Frequently Asked Questions",
    subtitle: "Do you have any questions? We may have already answered it in this section. If your question is not there, we invite you to contact us.",
    sectionTitle: (label: string) => `Frequently Asked Questions about ${label}`,
    editWarning: "Changes to FAQs here will affect all pages across the site that display these questions.",
  },
  es: {
    breadcrumb: "Preguntas Frecuentes Bootcamp",
    title: "Preguntas Frecuentes",
    subtitle: "¿Tienes alguna pregunta? Es posible que ya la hayamos respondido en esta sección. Si tu pregunta no está aquí, te invitamos a contactarnos.",
    sectionTitle: (label: string) => `Preguntas Frecuentes sobre ${label}`,
    editWarning: "Los cambios a las FAQs aquí afectarán todas las páginas del sitio que muestran estas preguntas.",
  },
};

export default function FAQPage() {
  const { i18n } = useTranslation();
  const locale = i18n.language?.startsWith("es") ? "es" : "en";
  const isDebugMode = isDebugModeActive();
  
  const content = pageContent[locale];
  const labels = featureLabels[locale];
  
  const groupedFaqs = useMemo(() => {
    const faqData = centralizedFaqs[locale] || centralizedFaqs.en;
    const groups: GroupedFaqs[] = [];
    const usedFaqIndices = new Set<number>();
    
    for (const feature of AVAILABLE_RELATED_FEATURES) {
      const faqs: FaqItem[] = [];
      
      faqData.faqs.forEach((faq, index) => {
        if (usedFaqIndices.has(index)) return;
        
        const faqFeatures = faq.related_features || [];
        if (faqFeatures.includes(feature)) {
          faqs.push(faq);
          usedFaqIndices.add(index);
        }
      });
      
      if (faqs.length > 0) {
        faqs.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
        
        groups.push({
          feature,
          label: labels[feature] || feature,
          faqs,
        });
      }
    }
    
    const uncategorizedFaqs = faqData.faqs.filter((_, index) => !usedFaqIndices.has(index));
    if (uncategorizedFaqs.length > 0) {
      groups.push({
        feature: "online-platform" as RelatedFeature,
        label: locale === "es" ? "General" : "General",
        faqs: uncategorizedFaqs,
      });
    }
    
    return groups;
  }, [locale, labels]);
  
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background" data-testid="page-faq">
        <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <p className="text-sm text-muted-foreground mb-2" data-testid="text-faq-breadcrumb">
            {content.breadcrumb}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-faq-title">
            {content.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-faq-subtitle">
            {content.subtitle}
          </p>
        </div>
        
        {isDebugMode && (
          <div 
            className="mb-8 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3"
            data-testid="alert-faq-edit-warning"
          >
            <IconAlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {content.editWarning}
            </p>
          </div>
        )}
        
        <div className="space-y-12">
          {groupedFaqs.map((group) => (
            <section key={group.feature} data-testid={`section-faq-${group.feature}`}>
              <h2 
                className="text-xl font-semibold text-foreground text-center mb-6"
                data-testid={`text-faq-group-${group.feature}`}
              >
                {content.sectionTitle(group.label)}
              </h2>
              
              <div className="bg-background rounded-card border overflow-hidden">
                <Accordion type="single" collapsible>
                  {group.faqs.map((faq, index) => (
                    <AccordionItem
                      key={`${group.feature}-${index}`}
                      value={`${group.feature}-${index}`}
                      className="border-0 border-b last:border-b-0 px-6"
                      data-testid={`accordion-faq-${group.feature}-${index}`}
                    >
                      <AccordionTrigger
                        className="text-left font-medium text-foreground hover:no-underline py-4 text-sm uppercase tracking-wide"
                        data-testid={`button-faq-${group.feature}-${index}`}
                      >
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent
                        className="text-muted-foreground pb-4 leading-relaxed whitespace-pre-line"
                        data-testid={`text-faq-answer-${group.feature}-${index}`}
                      >
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>
          ))}
        </div>
        </div>
      </div>
    </>
  );
}
