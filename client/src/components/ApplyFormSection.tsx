import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Country } from "react-phone-number-input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconCheck, IconMail, IconUser, IconSend } from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/contexts/SessionContext";
import { REGION_SLUGS, getRegionLabel, getRegionForLocation } from "@/lib/locations";

interface ApplyFormSectionData {
  type: "apply_form";
  version: string;
  hero: {
    title: string;
    subtitle: string;
    note?: string;
  };
  form: {
    program_label: string;
    program_placeholder: string;
    region_label?: string;
    region_placeholder?: string;
    location_label: string;
    location_placeholder: string;
    first_name_label: string;
    first_name_placeholder: string;
    last_name_label: string;
    last_name_placeholder: string;
    email_label: string;
    email_placeholder: string;
    phone_label: string;
    phone_placeholder: string;
    consent_marketing: string;
    consent_sms: string;
    submit_text: string;
    terms_text: string;
    terms_link_text: string;
    terms_link_url: string;
    privacy_text: string;
    privacy_link_text: string;
    privacy_link_url: string;
  };
  next_steps: {
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
    closing: string;
  };
}

interface ApplyFormSectionProps {
  data: ApplyFormSectionData;
  programs?: Array<{ id: string; name_en: string; name_es: string }>;
  locations?: Array<{ id: string; name_en: string; name_es: string; region?: string }>;
  locale?: string;
  preselectedProgram?: string;
  preselectedLocation?: string;
}

const applyFormSchema = z.object({
  program: z.string().min(1, "Please select a program"),
  location: z.string().min(1, "Please select a location"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  consentMarketing: z.boolean(),
  consentSms: z.boolean(),
});

type ApplyFormValues = z.infer<typeof applyFormSchema>;

export function ApplyFormSection({ 
  data, 
  programs = [], 
  locations = [],
  locale = "en",
  preselectedProgram,
  preselectedLocation
}: ApplyFormSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const { toast } = useToast();
  const { session } = useSession();

  const countryCode = session?.geo?.country_code || session?.location?.country_code || "US";
  const defaultCountry = countryCode as Country;
  const isUS = countryCode === "US";

  const locationIds = new Set(locations.map((l) => l.id));
  const resolvedLocation =
    (preselectedLocation && locationIds.has(preselectedLocation) ? preselectedLocation : null) ||
    (session?.location?.slug && locationIds.has(session.location.slug) ? session.location.slug : "") ;

  const rawResolvedRegion = resolvedLocation
    ? (locations.find(l => l.id === resolvedLocation)?.region || getRegionForLocation(resolvedLocation) || "")
    : "";
  const resolvedRegion = (REGION_SLUGS as readonly string[]).includes(rawResolvedRegion) ? rawResolvedRegion : "";

  const filteredLocations = selectedRegion
    ? locations.filter(l => l.region === selectedRegion || l.region === "online")
    : locations;

  const form = useForm<ApplyFormValues>({
    resolver: zodResolver(applyFormSchema),
    defaultValues: {
      program: preselectedProgram || "",
      location: resolvedLocation,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      consentMarketing: false,
      consentSms: false,
    },
  });

  useEffect(() => {
    if (resolvedRegion && !selectedRegion) {
      setSelectedRegion(resolvedRegion);
    }
  }, [resolvedRegion, selectedRegion]);

  useEffect(() => {
    if (resolvedLocation && !form.getValues("location")) {
      form.setValue("location", resolvedLocation);
    }
  }, [resolvedLocation, form]);

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    const currentLocation = form.getValues("location");
    if (currentLocation) {
      const loc = locations.find(l => l.id === currentLocation);
      if (loc && loc.region !== region && loc.region !== "online") {
        form.setValue("location", "");
      }
    }
  };

  const onSubmit = async (values: ApplyFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/apply/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          locale,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: locale === "es" ? "Solicitud enviada" : "Application submitted",
          description: locale === "es" 
            ? "Pronto recibirás noticias de nosotros." 
            : "You'll hear from us soon.",
        });
      } else {
        throw new Error("Failed to submit");
      }
    } catch {
      toast({
        title: locale === "es" ? "Error" : "Error",
        description: locale === "es" 
          ? "Algo salió mal. Por favor intenta de nuevo." 
          : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLocalizedName = (item: { name_en: string; name_es: string }) => {
    return locale === "es" ? item.name_es : item.name_en;
  };

  if (isSubmitted) {
    return (
      <section className="bg-background" data-testid="section-apply-form-success">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <IconCheck className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-success-title">
            {locale === "es" ? "¡Gracias por tu solicitud!" : "Thank you for your application!"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {locale === "es" 
              ? "Nuestro equipo de admisiones se pondrá en contacto contigo pronto." 
              : "Our admissions team will reach out to you soon."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background" data-testid="section-apply-form">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <Card className="border shadow-sm" data-testid="card-apply-form">
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="program"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">
                            {data.form.program_label}
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-program">
                                <SelectValue placeholder={data.form.program_placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {programs.map((program) => (
                                <SelectItem key={program.id} value={program.id} data-testid={`option-program-${program.id}`}>
                                  {getLocalizedName(program)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel className="text-foreground font-medium">
                        {data.form.region_label || (locale === "es" ? "Selecciona tu región" : "Select your region")}
                      </FormLabel>
                      <Select onValueChange={handleRegionChange} value={selectedRegion}>
                        <SelectTrigger data-testid="select-region" className="mt-2">
                          <SelectValue placeholder={data.form.region_placeholder || (locale === "es" ? "Selecciona una región" : "Select a region")} />
                        </SelectTrigger>
                        <SelectContent>
                          {REGION_SLUGS.map((region) => (
                            <SelectItem key={region} value={region} data-testid={`option-region-${region}`}>
                              {getRegionLabel(region, locale)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">
                            {data.form.location_label}
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-location">
                                <SelectValue placeholder={data.form.location_placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {filteredLocations.map((location) => (
                                <SelectItem key={location.id} value={location.id} data-testid={`option-location-${location.id}`}>
                                  {getLocalizedName(location)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">
                              {data.form.first_name_label}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  placeholder={data.form.first_name_placeholder}
                                  className="pl-10"
                                  data-testid="input-first-name"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">
                              {data.form.last_name_label}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                  {...field} 
                                  placeholder={data.form.last_name_placeholder}
                                  className="pl-10"
                                  data-testid="input-last-name"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">
                            {data.form.email_label}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input 
                                {...field} 
                                type="email"
                                placeholder={data.form.email_placeholder}
                                className="pl-10"
                                data-testid="input-email"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">
                            {data.form.phone_label}
                          </FormLabel>
                          <FormControl>
                            <PhoneInput
                              value={field.value}
                              onChange={field.onChange}
                              defaultCountry={defaultCountry}
                              placeholder={data.form.phone_placeholder}
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="consentMarketing"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="checkbox-consent-marketing"
                              />
                            </FormControl>
                            <FormLabel className="text-sm text-muted-foreground font-normal leading-relaxed cursor-pointer">
                              {data.form.consent_marketing}
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      {isUS && (
                        <FormField
                          control={form.control}
                          name="consentSms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-consent-sms"
                                />
                              </FormControl>
                              <FormLabel className="text-sm text-muted-foreground font-normal leading-relaxed cursor-pointer">
                                {data.form.consent_sms}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                      data-testid="button-submit-apply"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          {locale === "es" ? "Enviando..." : "Submitting..."}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <IconSend className="w-4 h-4" />
                          {data.form.submit_text}
                        </span>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      {data.form.terms_text}{" "}
                      <a 
                        href={data.form.terms_link_url} 
                        className="text-primary hover:underline"
                        data-testid="link-terms"
                      >
                        {data.form.terms_link_text}
                      </a>{" "}
                      {data.form.privacy_text}{" "}
                      <a 
                        href={data.form.privacy_link_url} 
                        className="text-primary hover:underline"
                        data-testid="link-privacy"
                      >
                        {data.form.privacy_link_text}
                      </a>
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:pt-20">
            <Card className="border-0 bg-muted/30" data-testid="card-next-steps">
              <CardContent className="p-6 md:p-8">
                <h2 
                  className="text-2xl font-bold text-foreground mb-6"
                  data-testid="text-next-steps-title"
                >
                  {data.next_steps.title}
                </h2>
                
                <div className="space-y-4">
                  {data.next_steps.items.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex gap-4"
                      data-testid={`next-step-${index}`}
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-foreground">
                          <span className="font-semibold">{item.title}:</span>{" "}
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <p 
                  className="mt-6 text-lg font-semibold text-primary"
                  data-testid="text-closing"
                >
                  {data.next_steps.closing}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ApplyFormSection;
