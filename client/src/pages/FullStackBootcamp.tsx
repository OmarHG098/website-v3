import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  IconCheck,
  IconRocket,
  IconBrain,
  IconUsers,
  IconCertificate,
  IconCode,
  IconDeviceLaptop,
  IconMessageChatbot,
  IconCalendarEvent,
  IconHeadset,
  IconWorld,
  IconDownload,
} from "@tabler/icons-react";
import { SiHtml5, SiCss3, SiJavascript, SiPython, SiReact, SiNodedotjs } from "react-icons/si";

export default function FullStackBootcamp() {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();

  useEffect(() => {
    if (location.startsWith("/es/")) {
      i18n.changeLanguage("es");
    } else if (location.startsWith("/us/")) {
      i18n.changeLanguage("en");
    }
  }, [location, i18n]);

  const features = [
    { key: "selfPaced", icon: IconRocket },
    { key: "aiReview", icon: IconBrain },
    { key: "mentorship", icon: IconUsers },
    { key: "community", icon: IconMessageChatbot },
    { key: "workshops", icon: IconCalendarEvent },
    { key: "privateSessions", icon: IconHeadset },
    { key: "certificate", icon: IconCertificate },
    { key: "globalNetwork", icon: IconWorld },
  ];

  const techStack = [
    { name: "HTML5", icon: SiHtml5, color: "text-orange-500" },
    { name: "CSS3", icon: SiCss3, color: "text-blue-500" },
    { name: "JavaScript", icon: SiJavascript, color: "text-yellow-500" },
    { name: "Python", icon: SiPython, color: "text-blue-400" },
    { name: "React", icon: SiReact, color: "text-cyan-400" },
    { name: "Node.js", icon: SiNodedotjs, color: "text-green-500" },
  ];

  const programDetails = [
    { key: "format", icon: IconDeviceLaptop },
    { key: "prerequisites", icon: IconCode },
    { key: "level", icon: IconRocket },
  ];

  const faqItems = ["schedule", "motivation", "experience", "mentoring", "certificate"];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6" variant="secondary" data-testid="badge-bootcamp-type">
              {t("fullstack.hero.badge")}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
              {t("fullstack.hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
              {t("fullstack.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" data-testid="button-apply">
                <IconRocket className="w-5 h-5 mr-2" />
                {t("fullstack.hero.ctaApply")}
              </Button>
              <Button size="lg" variant="outline" data-testid="button-download-syllabus">
                <IconDownload className="w-5 h-5 mr-2" />
                {t("fullstack.hero.ctaSyllabus")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Program Overview Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-program-title">
              {t("fullstack.program.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("fullstack.program.subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {programDetails.map((detail) => {
              const IconComponent = detail.icon;
              return (
                <Card key={detail.key} className="text-center" data-testid={`card-program-${detail.key}`}>
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">
                      {t(`fullstack.program.${detail.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(`fullstack.program.${detail.key}.description`)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI-Powered Learning Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <Badge className="mb-4" variant="outline">
                {t("fullstack.ai.badge")}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-ai-title">
                {t("fullstack.ai.title")}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t("fullstack.ai.description")}
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <IconBrain className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{t("fullstack.ai.rigobot.title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("fullstack.ai.rigobot.description")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <IconCode className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{t("fullstack.ai.learnpack.title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("fullstack.ai.learnpack.description")}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <IconMessageChatbot className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">Rigobot</p>
                      <p className="text-xs text-muted-foreground">{t("fullstack.ai.rigobot.status")}</p>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-4 space-y-3">
                    <div className="bg-muted rounded-lg p-3 text-sm">
                      {t("fullstack.ai.rigobot.example1")}
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3 text-sm ml-8">
                      {t("fullstack.ai.rigobot.example2")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mentorship & Support Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-mentorship-title">
              {t("fullstack.mentorship.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("fullstack.mentorship.subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card data-testid="card-mentorship-monthly">
              <CardContent className="pt-6">
                <IconCalendarEvent className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{t("fullstack.mentorship.monthly.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("fullstack.mentorship.monthly.description")}</p>
              </CardContent>
            </Card>
            <Card data-testid="card-mentorship-private">
              <CardContent className="pt-6">
                <IconHeadset className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{t("fullstack.mentorship.private.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("fullstack.mentorship.private.description")}</p>
              </CardContent>
            </Card>
            <Card data-testid="card-mentorship-community">
              <CardContent className="pt-6">
                <IconUsers className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{t("fullstack.mentorship.community.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("fullstack.mentorship.community.description")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features Checklist Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-features-title">
              {t("fullstack.features.title")}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.key}
                  className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover-elevate"
                  data-testid={`feature-${feature.key}`}
                >
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <IconCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">{t(`fullstack.features.${feature.key}`)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-curriculum-title">
              {t("fullstack.curriculum.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("fullstack.curriculum.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 max-w-4xl mx-auto">
            {techStack.map((tech) => {
              const IconComponent = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="flex flex-col items-center gap-3 p-4"
                  data-testid={`tech-${tech.name.toLowerCase()}`}
                >
                  <div className="w-16 h-16 rounded-xl bg-background shadow-sm flex items-center justify-center">
                    <IconComponent className={`w-8 h-8 ${tech.color}`} />
                  </div>
                  <span className="text-sm font-medium">{tech.name}</span>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              {t("fullstack.curriculum.extras")}
            </p>
          </div>
        </div>
      </section>

      {/* Certificate & Career Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-certificate-title">
                  {t("fullstack.certificate.title")}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t("fullstack.certificate.description")}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <IconCheck className="w-5 h-5 text-green-600" />
                    <span>{t("fullstack.certificate.benefit1")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <IconCheck className="w-5 h-5 text-green-600" />
                    <span>{t("fullstack.certificate.benefit2")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <IconCheck className="w-5 h-5 text-green-600" />
                    <span>{t("fullstack.certificate.benefit3")}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Card className="w-full max-w-sm p-6 text-center bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardContent className="p-0">
                    <IconCertificate className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">{t("fullstack.certificate.cardTitle")}</h3>
                    <p className="text-sm text-muted-foreground">{t("fullstack.certificate.cardSubtitle")}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-faq-title">
              {t("fullstack.faq.title")}
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={item} value={item} data-testid={`faq-item-${item}`}>
                  <AccordionTrigger className="text-left">
                    {t(`fullstack.faq.${item}.question`)}
                  </AccordionTrigger>
                  <AccordionContent>
                    {t(`fullstack.faq.${item}.answer`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Credibility Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-credibility-title">
              {t("fullstack.credibility.title")}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="text-center p-6" data-testid="stat-graduates">
              <CardContent className="p-0">
                <p className="text-3xl font-bold text-primary mb-1">4,000+</p>
                <p className="text-sm text-muted-foreground">{t("fullstack.credibility.graduates")}</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6" data-testid="stat-placement">
              <CardContent className="p-0">
                <p className="text-3xl font-bold text-primary mb-1">84%</p>
                <p className="text-sm text-muted-foreground">{t("fullstack.credibility.placement")}</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6" data-testid="stat-rating">
              <CardContent className="p-0">
                <p className="text-3xl font-bold text-primary mb-1">4.9/5</p>
                <p className="text-sm text-muted-foreground">{t("fullstack.credibility.rating")}</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6" data-testid="stat-countries">
              <CardContent className="p-0">
                <p className="text-3xl font-bold text-primary mb-1">20+</p>
                <p className="text-sm text-muted-foreground">{t("fullstack.credibility.countries")}</p>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("fullstack.credibility.featuredIn")}</p>
              <div className="flex items-center gap-6 text-muted-foreground">
                <span className="font-bold text-lg">Forbes</span>
                <span className="font-bold text-lg">Newsweek</span>
                <span className="font-bold text-lg">Course Report</span>
                <span className="font-bold text-lg">SwitchUp</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-title">
              {t("fullstack.cta.title")}
            </h2>
            <p className="text-lg mb-8 opacity-90">
              {t("fullstack.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" data-testid="button-cta-start">
                {t("fullstack.cta.button")}
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-cta-contact">
                {t("fullstack.cta.contact")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 4Geeks. {t("fullstack.footer.rights")}</p>
        </div>
      </footer>
    </div>
  );
}
