import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconArrowLeft,
  IconFlask,
  IconDeviceFloppy,
  IconRefresh,
  IconEye,
  IconChevronRight,
  IconUsers,
  IconPercentage,
  IconTarget,
  IconCalendar,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconLanguage,
  IconWorld,
  IconClock,
} from "@tabler/icons-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ExperimentConfig, ExperimentVariant, ExperimentTargeting } from "@shared/schema";

interface ExperimentWithStats extends ExperimentConfig {
  stats?: Record<string, number>;
}

interface ExperimentResponse {
  experiment: ExperimentWithStats;
  contentType: string;
  contentSlug: string;
  filePath: string;
}

const statusColors: Record<string, string> = {
  planned: "bg-muted text-muted-foreground",
  active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  paused: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  winner: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  archived: "bg-muted text-muted-foreground opacity-60",
};

const statusOptions = ["planned", "active", "paused", "winner", "archived"] as const;

function deslugify(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function ExperimentEditor() {
  const { contentType, contentSlug, experimentSlug } = useParams<{
    contentType: string;
    contentSlug: string;
    experimentSlug: string;
  }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState<{
    description: string;
    status: string;
    max_visitors: number | undefined;
    variants: ExperimentVariant[];
    targeting: ExperimentTargeting;
  } | null>(null);

  const { data, isLoading, error } = useQuery<ExperimentResponse>({
    queryKey: ["/api/experiments", contentType, contentSlug, experimentSlug],
    enabled: !!contentType && !!contentSlug && !!experimentSlug,
  });

  useMemo(() => {
    if (data?.experiment && !formData) {
      setFormData({
        description: data.experiment.description || "",
        status: data.experiment.status,
        max_visitors: data.experiment.max_visitors,
        variants: [...data.experiment.variants],
        targeting: { ...(data.experiment.targeting || {}) },
      });
      if (data.experiment.variants.length > 0 && !selectedVariant) {
        setSelectedVariant(data.experiment.variants[0].slug);
      }
    }
    return null;
  }, [data, formData, selectedVariant]);

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<ExperimentConfig>) => {
      return apiRequest(
        "PATCH",
        `/api/experiments/${contentType}/${contentSlug}/${experimentSlug}`,
        updates
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/experiments", contentType, contentSlug, experimentSlug],
      });
      setHasChanges(false);
      toast({
        title: "Experiment updated",
        description: "Changes have been saved successfully.",
      });
    },
    onError: (err) => {
      toast({
        title: "Failed to save",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!formData) return;
    updateMutation.mutate({
      description: formData.description,
      status: formData.status as ExperimentConfig["status"],
      max_visitors: formData.max_visitors,
      variants: formData.variants,
      targeting: formData.targeting,
    });
  };

  const updateFormData = <K extends keyof NonNullable<typeof formData>>(
    key: K,
    value: NonNullable<typeof formData>[K]
  ) => {
    if (!formData) return;
    setFormData({ ...formData, [key]: value });
    setHasChanges(true);
  };

  const updateVariantAllocation = (variantSlug: string, newAllocation: number) => {
    if (!formData) return;
    const variants = formData.variants.map((v) =>
      v.slug === variantSlug ? { ...v, allocation: newAllocation } : v
    );
    updateFormData("variants", variants);
  };

  const updateVariantVersion = (variantSlug: string, newVersion: number) => {
    if (!formData) return;
    const variants = formData.variants.map((v) =>
      v.slug === variantSlug ? { ...v, version: newVersion } : v
    );
    updateFormData("variants", variants);
  };

  const updateTargeting = <K extends keyof ExperimentTargeting>(
    key: K,
    value: ExperimentTargeting[K]
  ) => {
    if (!formData) return;
    updateFormData("targeting", { ...formData.targeting, [key]: value });
  };

  const totalAllocation = formData?.variants.reduce((sum, v) => sum + v.allocation, 0) || 0;
  const totalExposures = Object.values(data?.experiment?.stats || {}).reduce((a, b) => a + b, 0);

  const backUrl = useMemo(() => {
    if (contentType === "programs") {
      return `/en/career-programs/${contentSlug}`;
    } else if (contentType === "locations") {
      return `/en/location/${contentSlug}`;
    } else if (contentType === "landings") {
      return `/landing/${contentSlug}`;
    } else {
      return `/en/${contentSlug}`;
    }
  }, [contentType, contentSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <IconRefresh className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data?.experiment) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <IconFlask className="h-12 w-12 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Experiment not found</h1>
        <p className="text-muted-foreground">
          Could not find experiment "{experimentSlug}" for {contentType}/{contentSlug}
        </p>
        <Button onClick={() => navigate(backUrl)} variant="outline">
          <IconArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const experiment = data.experiment;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(backUrl)}
              data-testid="button-back"
            >
              <IconArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <IconFlask className="h-5 w-5 text-primary" />
              <div>
                <h1 className="font-semibold text-sm" data-testid="text-experiment-title">
                  {deslugify(experiment.slug)}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {deslugify(contentType || "")} / {deslugify(contentSlug || "")}
                </p>
              </div>
            </div>
            <Badge className={statusColors[formData?.status || experiment.status]}>
              {formData?.status || experiment.status}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border rounded-lg p-1">
              {formData?.variants.map((variant) => (
                <Button
                  key={variant.slug}
                  variant={selectedVariant === variant.slug ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedVariant(variant.slug)}
                  data-testid={`button-variant-${variant.slug}`}
                >
                  {deslugify(variant.slug)}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const previewUrl = `${backUrl}?force_variant=${selectedVariant}`;
                window.open(previewUrl, "_blank");
              }}
              disabled={!selectedVariant}
              data-testid="button-preview"
            >
              <IconEye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges || updateMutation.isPending}
              data-testid="button-save"
            >
              {updateMutation.isPending ? (
                <IconRefresh className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <IconDeviceFloppy className="h-4 w-4 mr-1" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">General Information</CardTitle>
                <CardDescription>Basic experiment settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={deslugify(experiment.slug)}
                    disabled
                    className="bg-muted"
                    data-testid="input-title"
                  />
                  <p className="text-xs text-muted-foreground">
                    Slug: <code className="bg-muted px-1 rounded">{experiment.slug}</code>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData?.description || ""}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    placeholder="Describe what this experiment tests..."
                    rows={3}
                    data-testid="input-description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData?.status || experiment.status}
                      onValueChange={(value) => updateFormData("status", value)}
                    >
                      <SelectTrigger id="status" data-testid="select-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_visitors">Max Visitors</Label>
                    <Input
                      id="max_visitors"
                      type="number"
                      value={formData?.max_visitors || ""}
                      onChange={(e) =>
                        updateFormData(
                          "max_visitors",
                          e.target.value ? parseInt(e.target.value, 10) : undefined
                        )
                      }
                      placeholder="Unlimited"
                      data-testid="input-max-visitors"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <IconPercentage className="h-4 w-4" />
                  Traffic Allocation
                </CardTitle>
                <CardDescription>
                  Distribute traffic between variants (total: {totalAllocation}%)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData?.variants.map((variant) => (
                  <div key={variant.slug} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        {deslugify(variant.slug)}
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          v{variant.version}
                        </code>
                      </Label>
                      <span className="text-sm font-medium">{variant.allocation}%</span>
                    </div>
                    <Slider
                      value={[variant.allocation]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={([value]) =>
                        updateVariantAllocation(variant.slug, value)
                      }
                      data-testid={`slider-allocation-${variant.slug}`}
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Exposures: {experiment.stats?.[variant.slug] || 0}
                      </span>
                      <Select
                        value={String(variant.version)}
                        onValueChange={(v) =>
                          updateVariantVersion(variant.slug, parseInt(v, 10))
                        }
                      >
                        <SelectTrigger className="w-24 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((v) => (
                            <SelectItem key={v} value={String(v)}>
                              Version {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
                {totalAllocation !== 100 && (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Warning: Total allocation is {totalAllocation}%, should be 100%
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <IconTarget className="h-4 w-4" />
                  Targeting Rules
                </CardTitle>
                <CardDescription>
                  Define which visitors are eligible for this experiment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <IconLanguage className="h-4 w-4" />
                      Languages
                    </Label>
                    <div className="flex gap-2">
                      {["en", "es"].map((lang) => (
                        <Button
                          key={lang}
                          variant={
                            formData?.targeting?.languages?.includes(lang)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            const current = formData?.targeting?.languages || [];
                            const updated = current.includes(lang)
                              ? current.filter((l) => l !== lang)
                              : [...current, lang];
                            updateTargeting("languages", updated.length ? updated : undefined);
                          }}
                          data-testid={`button-lang-${lang}`}
                        >
                          {lang.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <IconWorld className="h-4 w-4" />
                      Regions
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {["usa-canada", "latam", "europe"].map((region) => (
                        <Button
                          key={region}
                          variant={
                            formData?.targeting?.regions?.includes(region)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            const current = formData?.targeting?.regions || [];
                            const updated = current.includes(region)
                              ? current.filter((r) => r !== region)
                              : [...current, region];
                            updateTargeting("regions", updated.length ? updated : undefined);
                          }}
                          data-testid={`button-region-${region}`}
                        >
                          {deslugify(region)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <IconDeviceMobile className="h-4 w-4" />
                    Devices
                  </Label>
                  <div className="flex gap-2">
                    {(["mobile", "tablet", "desktop"] as const).map((device) => (
                      <Button
                        key={device}
                        variant={
                          formData?.targeting?.devices?.includes(device)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          const current = formData?.targeting?.devices || [];
                          const updated = current.includes(device)
                            ? current.filter((d) => d !== device)
                            : [...current, device];
                          updateTargeting(
                            "devices",
                            updated.length ? (updated as ("mobile" | "tablet" | "desktop")[]) : undefined
                          );
                        }}
                        data-testid={`button-device-${device}`}
                      >
                        {device === "mobile" && <IconDeviceMobile className="h-3 w-3 mr-1" />}
                        {device === "desktop" && <IconDeviceDesktop className="h-3 w-3 mr-1" />}
                        {device.charAt(0).toUpperCase() + device.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>UTM Sources</Label>
                    <Input
                      placeholder="google, facebook, ..."
                      value={formData?.targeting?.utm_sources?.join(", ") || ""}
                      onChange={(e) => {
                        const values = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        updateTargeting("utm_sources", values.length ? values : undefined);
                      }}
                      data-testid="input-utm-sources"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>UTM Campaigns</Label>
                    <Input
                      placeholder="campaign1, campaign2, ..."
                      value={formData?.targeting?.utm_campaigns?.join(", ") || ""}
                      onChange={(e) => {
                        const values = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        updateTargeting("utm_campaigns", values.length ? values : undefined);
                      }}
                      data-testid="input-utm-campaigns"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Countries (ISO codes)</Label>
                  <Input
                    placeholder="US, CA, MX, ..."
                    value={formData?.targeting?.countries?.join(", ") || ""}
                    onChange={(e) => {
                      const values = e.target.value
                        .split(",")
                        .map((s) => s.trim().toUpperCase())
                        .filter(Boolean);
                      updateTargeting("countries", values.length ? values : undefined);
                    }}
                    data-testid="input-countries"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <IconUsers className="h-4 w-4" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Exposures</span>
                  <span className="font-medium">{totalExposures}</span>
                </div>
                {formData?.max_visitors && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Max Visitors</span>
                    <span className="font-medium">{formData.max_visitors}</span>
                  </div>
                )}
                <Separator />
                {formData?.variants.map((variant) => {
                  const count = experiment.stats?.[variant.slug] || 0;
                  const percentage = totalExposures > 0 
                    ? ((count / totalExposures) * 100).toFixed(1) 
                    : "0";
                  return (
                    <div key={variant.slug} className="flex items-center justify-between">
                      <span className="text-sm">{deslugify(variant.slug)}</span>
                      <span className="text-sm text-muted-foreground">
                        {count} ({percentage}%)
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <IconCalendar className="h-4 w-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => {
                    if (formData?.status === "active") {
                      updateFormData("status", "paused");
                    } else {
                      updateFormData("status", "active");
                    }
                  }}
                  data-testid="button-toggle-status"
                >
                  {formData?.status === "active" ? "Pause Experiment" : "Activate Experiment"}
                  <IconChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  disabled={!selectedVariant}
                  onClick={() => {
                    if (selectedVariant) {
                      updateFormData("status", "winner");
                    }
                  }}
                  data-testid="button-declare-winner"
                >
                  Declare Winner
                  <IconChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">File Location</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-xs bg-muted px-2 py-1 rounded block break-all">
                  {data.filePath}
                </code>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
