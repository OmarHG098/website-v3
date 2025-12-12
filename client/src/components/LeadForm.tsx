import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSession, useLocation as useSessionLocation, useUTM } from "@/contexts/SessionContext";
import { apiRequest } from "@/lib/queryClient";
import { IconLoader2, IconCheck } from "@tabler/icons-react";

interface FieldConfig {
  visible?: boolean;
  required?: boolean;
  default?: string;
}

interface LeadFormData {
  variant?: "stacked" | "inline";
  title?: string;
  subtitle?: string;
  submit_label?: string;
  tags?: string;
  automations?: string;
  fields?: {
    email?: FieldConfig;
    first_name?: FieldConfig;
    last_name?: FieldConfig;
    phone?: FieldConfig;
    program?: FieldConfig;
    region?: FieldConfig;
    location?: FieldConfig;
    coupon?: FieldConfig;
    comment?: FieldConfig;
  };
  success?: {
    url?: string;
    message?: string;
  };
  terms_url?: string;
  privacy_url?: string;
}

interface LeadFormProps {
  data: LeadFormData;
  programContext?: string;
}

interface FormOptions {
  programs: Array<{ slug: string; title: string }>;
  locations: Array<{ slug: string; name: string; city: string; country: string; region: string }>;
  regions: Array<{ slug: string; label: string }>;
}

interface FormValues {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  program: string;
  region: string;
  location: string;
  coupon: string;
  comment: string;
  sms_consent: boolean;
  consent_whatsapp: boolean;
}

export function LeadForm({ data, programContext }: LeadFormProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "es" ? "es" : "en";
  const { session } = useSession();
  const sessionLocation = useSessionLocation();
  const utm = useUTM();
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const variant = data.variant || "stacked";
  const fields = data.fields || {};

  const getFieldConfig = (fieldName: keyof NonNullable<LeadFormData["fields"]>): FieldConfig => {
    const defaults: Record<string, FieldConfig> = {
      email: { visible: true, required: true },
      first_name: { visible: true, required: false },
      last_name: { visible: false, required: false },
      phone: { visible: true, required: false },
      program: { visible: true, required: true, default: "auto" },
      region: { visible: false, required: false, default: "auto" },
      location: { visible: true, required: false, default: "auto" },
      coupon: { visible: false, required: false, default: "auto" },
      comment: { visible: false, required: false },
    };
    return { ...defaults[fieldName], ...fields[fieldName] };
  };

  const { data: formOptions } = useQuery<FormOptions>({
    queryKey: ["/api/form-options", locale],
  });

  const resolveDefault = (fieldName: string, configDefault?: string): string => {
    if (!configDefault || configDefault !== "auto") {
      return configDefault || "";
    }
    
    switch (fieldName) {
      case "program":
        return programContext || "";
      case "location":
        return sessionLocation?.slug || "";
      case "region":
        return sessionLocation?.region || "";
      case "coupon":
        return utm.coupon || "";
      default:
        return "";
    }
  };

  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      first_name: resolveDefault("first_name", getFieldConfig("first_name").default),
      last_name: resolveDefault("last_name", getFieldConfig("last_name").default),
      phone: "",
      program: resolveDefault("program", getFieldConfig("program").default),
      region: resolveDefault("region", getFieldConfig("region").default),
      location: resolveDefault("location", getFieldConfig("location").default),
      coupon: resolveDefault("coupon", getFieldConfig("coupon").default),
      comment: "",
      sms_consent: false,
      consent_whatsapp: false,
    },
  });

  useEffect(() => {
    if (sessionLocation && !form.getValues("location")) {
      form.setValue("location", sessionLocation.slug);
    }
    if (sessionLocation?.region && !form.getValues("region")) {
      form.setValue("region", sessionLocation.region);
    }
    if (utm.coupon && !form.getValues("coupon")) {
      form.setValue("coupon", utm.coupon);
    }
    if (programContext && !form.getValues("program")) {
      form.setValue("program", programContext);
    }
  }, [sessionLocation, utm, programContext, form]);

  const submitMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        ...values,
        // Always include auto-detected values for hidden fields
        location: values.location || sessionLocation?.slug || resolveDefault("location", getFieldConfig("location").default),
        region: values.region || sessionLocation?.region || resolveDefault("region", getFieldConfig("region").default),
        coupon: values.coupon || utm.coupon || resolveDefault("coupon", getFieldConfig("coupon").default),
        program: values.program || programContext || resolveDefault("program", getFieldConfig("program").default),
        // Session data
        language: session.language,
        browser_lang: session.browserLang,
        latitude: session.geo?.latitude?.toString(),
        longitude: session.geo?.longitude?.toString(),
        city: session.geo?.city,
        country: session.geo?.country,
        // UTM tracking
        utm_url: window.location.href,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        utm_content: utm.utm_content,
        utm_term: utm.utm_term,
        utm_placement: utm.utm_placement,
        utm_plan: utm.utm_plan,
        // Normalized PPC tracking ID
        ppc_tracking_id: utm.ppc_tracking_id,
        // Referral
        referral: utm.referral || utm.ref,
        // Form configuration
        tags: data.tags || "website-lead",
        automations: data.automations || "strong",
      };
      
      return apiRequest("POST", "/api/leads", payload);
    },
    onSuccess: () => {
      if (data.success?.url) {
        window.location.href = data.success.url;
      } else {
        setIsSuccess(true);
        setSuccessMessage(data.success?.message || (locale === "es" 
          ? "¡Gracias! Te contactaremos pronto." 
          : "Thanks! We'll contact you soon."));
      }
    },
    onError: (error: Error) => {
      console.error("Lead submission error:", error);
    },
  });

  const onSubmit = (values: FormValues) => {
    submitMutation.mutate(values);
  };

  const filteredLocations = formOptions?.locations.filter(loc => {
    const selectedRegion = form.watch("region");
    if (!selectedRegion || !getFieldConfig("region").visible) return true;
    return loc.region === selectedRegion;
  }) || [];

  if (isSuccess) {
    return (
      <section className="py-12 bg-muted/30" data-testid="section-lead-form-success">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <IconCheck className="w-8 h-8 text-primary" />
          </div>
          <p className="text-lg text-foreground" data-testid="text-success-message">
            {successMessage}
          </p>
        </div>
      </section>
    );
  }

  const isStacked = variant === "stacked";

  return (
    <section 
      className="py-12 bg-muted/30"
      data-testid="section-lead-form"
    >
      <div className={`mx-auto px-4 ${isStacked ? "max-w-lg" : "max-w-4xl"}`}>
        {data.title && (
          <h2 
            className="text-2xl md:text-3xl font-bold mb-2 text-center text-foreground"
            data-testid="text-form-title"
          >
            {data.title}
          </h2>
        )}
        {data.subtitle && (
          <p 
            className="text-muted-foreground text-center mb-8"
            data-testid="text-form-subtitle"
          >
            {data.subtitle}
          </p>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className={isStacked ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
              {getFieldConfig("email").visible && (
                <FormField
                  control={form.control}
                  name="email"
                  rules={{ 
                    required: getFieldConfig("email").required ? (locale === "es" ? "Correo requerido" : "Email is required") : false,
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: locale === "es" ? "Correo inválido" : "Invalid email address"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{locale === "es" ? "Correo electrónico" : "Email"} *</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder={locale === "es" ? "tu@email.com" : "you@email.com"} 
                          {...field} 
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {getFieldConfig("first_name").visible && (
                <FormField
                  control={form.control}
                  name="first_name"
                  rules={{ required: getFieldConfig("first_name").required ? (locale === "es" ? "Nombre requerido" : "First name is required") : false }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {locale === "es" ? "Nombre" : "First Name"}
                        {getFieldConfig("first_name").required && " *"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-first-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {getFieldConfig("last_name").visible && (
                <FormField
                  control={form.control}
                  name="last_name"
                  rules={{ required: getFieldConfig("last_name").required ? (locale === "es" ? "Apellido requerido" : "Last name is required") : false }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {locale === "es" ? "Apellido" : "Last Name"}
                        {getFieldConfig("last_name").required && " *"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-last-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {getFieldConfig("phone").visible && (
                <FormField
                  control={form.control}
                  name="phone"
                  rules={{ required: getFieldConfig("phone").required ? (locale === "es" ? "Teléfono requerido" : "Phone is required") : false }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {locale === "es" ? "Teléfono" : "Phone"}
                        {getFieldConfig("phone").required && " *"}
                      </FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} data-testid="input-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {getFieldConfig("program").visible && (
                <FormField
                  control={form.control}
                  name="program"
                  rules={{ required: getFieldConfig("program").required ? (locale === "es" ? "Programa requerido" : "Program is required") : false }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {locale === "es" ? "Programa" : "Program"}
                        {getFieldConfig("program").required && " *"}
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-program">
                            <SelectValue placeholder={locale === "es" ? "Selecciona un programa" : "Select a program"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formOptions?.programs.map((program) => (
                            <SelectItem key={program.slug} value={program.slug}>
                              {program.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {getFieldConfig("region").visible && (
                <FormField
                  control={form.control}
                  name="region"
                  rules={{ required: getFieldConfig("region").required ? (locale === "es" ? "Región requerida" : "Region is required") : false }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {locale === "es" ? "Región" : "Region"}
                        {getFieldConfig("region").required && " *"}
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-region">
                            <SelectValue placeholder={locale === "es" ? "Selecciona una región" : "Select a region"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formOptions?.regions.map((region) => (
                            <SelectItem key={region.slug} value={region.slug}>
                              {region.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {getFieldConfig("location").visible && (
                <FormField
                  control={form.control}
                  name="location"
                  rules={{ required: getFieldConfig("location").required ? (locale === "es" ? "Campus requerido" : "Campus is required") : false }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {locale === "es" ? "Campus" : "Campus Location"}
                        {getFieldConfig("location").required && " *"}
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-location">
                            <SelectValue placeholder={locale === "es" ? "Selecciona un campus" : "Select a campus"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formOptions?.regions.map((region) => {
                            const regionLocations = filteredLocations.filter(loc => loc.region === region.slug);
                            if (regionLocations.length === 0) return null;
                            return (
                              <SelectGroup key={region.slug}>
                                <SelectLabel>{region.label}</SelectLabel>
                                {regionLocations.map((loc) => (
                                  <SelectItem key={loc.slug} value={loc.slug}>
                                    {loc.name} - {loc.country}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {getFieldConfig("coupon").visible && (
                <FormField
                  control={form.control}
                  name="coupon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{locale === "es" ? "Código de cupón" : "Coupon Code"}</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-coupon" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {getFieldConfig("comment").visible && (
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{locale === "es" ? "Comentarios" : "Comments"}</FormLabel>
                    <FormControl>
                      <Textarea 
                        className="min-h-[100px]" 
                        {...field} 
                        data-testid="textarea-comment"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="sms_consent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-sms-consent"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <Label className="text-sm text-muted-foreground cursor-pointer" htmlFor="sms_consent">
                        {locale === "es" 
                          ? "Acepto recibir mensajes SMS/texto sobre talleres, eventos, cursos y otros materiales de marketing. Pueden aplicarse tarifas de mensajes y datos. Responde STOP para cancelar, HELP para ayuda. Puedes recibir hasta 4-6 mensajes de texto por mes. Nunca compartiremos tu información de contacto y puedes cancelar fácilmente en cualquier momento."
                          : "I agree to receive SMS/text messages about workshops, events, courses, and other marketing materials. Message and data rates may apply. Reply STOP to unsubscribe, HELP for help. You may receive up to 4–6 text messages per month. We will never share your contact information, and you can easily opt out at any moment."
                        }
                      </Label>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consent_whatsapp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-consent-whatsapp"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <Label className="text-sm text-muted-foreground cursor-pointer" htmlFor="consent_whatsapp">
                        {locale === "es"
                          ? "Acepto recibir información a través de correo electrónico, WhatsApp y/u otros canales sobre talleres, eventos, cursos y otros materiales de marketing. Nunca compartiremos tu información de contacto y puedes cancelar fácilmente en cualquier momento."
                          : "I agree to receive information through email, WhatsApp and/or other channels about workshops, events, courses, and other marketing materials. We'll never share your contact information, and you can easily opt out at any moment."
                        }
                      </Label>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={submitMutation.isPending}
              data-testid="button-submit"
            >
              {submitMutation.isPending ? (
                <>
                  <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                  {locale === "es" ? "Enviando..." : "Submitting..."}
                </>
              ) : (
                data.submit_label || (locale === "es" ? "Obtener información" : "Get Information")
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center" data-testid="text-terms">
              {locale === "es" ? "Al registrarte, aceptas los " : "By signing up, you agree to the "}
              <a 
                href={data.terms_url || "/terms"} 
                className="underline hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-terms"
              >
                {locale === "es" ? "Términos y Condiciones" : "Terms and Conditions"}
              </a>
              {locale === "es" ? " y la " : " and "}
              <a 
                href={data.privacy_url || "/privacy"} 
                className="underline hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-privacy"
              >
                {locale === "es" ? "Política de Privacidad" : "Privacy Policy"}
              </a>
            </p>
          </form>
        </Form>
      </div>
    </section>
  );
}
