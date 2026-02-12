import { useState, useCallback } from "react";
import { IconArrowRight, IconArrowLeft, IconLoader2, IconCheck, IconAlertTriangle, IconLink } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";

interface TableColumnConfig {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "image" | "link" | "boolean";
}

interface TableConfig {
  columns: TableColumnConfig[];
  title?: string;
}

export interface DynamicTableConfig {
  endpoint: string;
  data_path?: string;
  columns: TableColumnConfig[];
  title?: string;
  action?: {
    label: string;
    href: string;
  };
}

interface TableBuilderWizardProps {
  onComplete: (config: DynamicTableConfig) => void;
  onCancel?: () => void;
}

type WizardStep = "url" | "select-array" | "consistency" | "columns-prompt" | "ai-processing" | "action" | "done";

interface StepState {
  url: string;
  rawData: unknown;
  arrayOptions: string[];
  selectedArrayPath: string;
  dataArray: Record<string, unknown>[];
  availableKeys: string[];
  columnsPrompt: string;
  tableConfig: TableConfig | null;
  addAction: boolean;
  actionLabel: string;
  actionHref: string;
}

function extractArrayProperties(data: unknown): string[] {
  if (typeof data !== "object" || data === null || Array.isArray(data)) return [];
  const result: string[] = [];
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
      result.push(key);
    }
  }
  return result;
}

function getKeysFromArray(arr: Record<string, unknown>[]): string[] {
  if (arr.length === 0) return [];
  return Object.keys(arr[0]);
}

function checkConsistency(arr: Record<string, unknown>[]): { consistent: boolean; keys: string[] } {
  if (arr.length < 2) return { consistent: true, keys: getKeysFromArray(arr) };
  const firstKeys = Object.keys(arr[0]).slice(0, 3);
  const secondItem = arr[1];
  const missing = firstKeys.filter((k) => !(k in secondItem));
  return {
    consistent: missing.length === 0,
    keys: getKeysFromArray(arr),
  };
}

export function TableBuilderWizard({ onComplete, onCancel }: TableBuilderWizardProps) {
  const [step, setStep] = useState<WizardStep>("url");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<StepState>({
    url: "",
    rawData: null,
    arrayOptions: [],
    selectedArrayPath: "",
    dataArray: [],
    availableKeys: [],
    columnsPrompt: "",
    tableConfig: null,
    addAction: false,
    actionLabel: "View",
    actionHref: "",
  });

  const updateState = useCallback((updates: Partial<StepState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleFetchUrl = useCallback(async () => {
    if (!state.url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(state.url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        if (data.length === 0 || typeof data[0] !== "object") {
          setError("The endpoint returned an empty array or non-object items.");
          setLoading(false);
          return;
        }
        const consistency = checkConsistency(data as Record<string, unknown>[]);
        updateState({
          rawData: data,
          dataArray: data as Record<string, unknown>[],
          availableKeys: consistency.keys,
        });
        if (!consistency.consistent) {
          setStep("consistency");
        } else {
          setStep("columns-prompt");
        }
      } else if (typeof data === "object" && data !== null) {
        const arrayProps = extractArrayProperties(data);
        if (arrayProps.length === 0) {
          setError("The response doesn't contain any array properties with object items.");
          setLoading(false);
          return;
        }
        if (arrayProps.length === 1) {
          const arr = (data as Record<string, unknown>)[arrayProps[0]] as Record<string, unknown>[];
          const consistency = checkConsistency(arr);
          updateState({
            rawData: data,
            selectedArrayPath: arrayProps[0],
            dataArray: arr,
            availableKeys: consistency.keys,
          });
          if (!consistency.consistent) {
            setStep("consistency");
          } else {
            setStep("columns-prompt");
          }
        } else {
          updateState({
            rawData: data,
            arrayOptions: arrayProps,
          });
          setStep("select-array");
        }
      } else {
        setError("The endpoint did not return an object or array.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data from URL");
    } finally {
      setLoading(false);
    }
  }, [state.url, updateState]);

  const handleSelectArray = useCallback(
    (key: string) => {
      const data = state.rawData as Record<string, unknown>;
      const arr = data[key] as Record<string, unknown>[];
      const consistency = checkConsistency(arr);
      updateState({
        selectedArrayPath: key,
        dataArray: arr,
        availableKeys: consistency.keys,
      });
      if (!consistency.consistent) {
        setStep("consistency");
      } else {
        setStep("columns-prompt");
      }
    },
    [state.rawData, updateState]
  );

  const handleGenerateColumns = useCallback(async () => {
    if (!state.columnsPrompt.trim()) {
      setError("Please describe the columns you want");
      return;
    }

    setStep("ai-processing");
    setError(null);

    try {
      const response = await apiRequest("POST", "/api/ai/generate-table-from-payload", {
        sampleData: state.dataArray.slice(0, 5),
        availableKeys: state.availableKeys,
        userPrompt: state.columnsPrompt,
      });
      const config = await response.json();
      updateState({ tableConfig: config });
      setStep("action");
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI failed to generate table configuration");
      setStep("columns-prompt");
    }
  }, [state.columnsPrompt, state.dataArray, state.availableKeys, updateState]);

  const handleFinish = useCallback(() => {
    if (!state.tableConfig) return;
    const config: DynamicTableConfig = {
      endpoint: state.url,
      data_path: state.selectedArrayPath || undefined,
      columns: state.tableConfig.columns,
      title: state.tableConfig.title,
    };
    if (state.addAction && state.actionHref.trim()) {
      config.action = {
        label: state.actionLabel || "View",
        href: state.actionHref,
      };
    }
    onComplete(config);
  }, [state, onComplete]);

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <StepIndicator current={step} />

        {step === "url" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1" data-testid="text-wizard-title">
                Where is your data?
              </h3>
              <p className="text-sm text-muted-foreground">
                Enter the URL of the API endpoint that returns the data you want to display in a table.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endpoint-url">API Endpoint URL</Label>
              <Input
                id="endpoint-url"
                placeholder="https://api.example.com/data"
                value={state.url}
                onChange={(e) => updateState({ url: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleFetchUrl()}
                data-testid="input-endpoint-url"
              />
            </div>
            {error && <ErrorMessage message={error} />}
            <div className="flex justify-end gap-2">
              {onCancel && (
                <Button variant="outline" onClick={onCancel} data-testid="button-cancel">
                  Cancel
                </Button>
              )}
              <Button onClick={handleFetchUrl} disabled={loading || !state.url.trim()} data-testid="button-fetch-url">
                {loading ? <IconLoader2 className="w-4 h-4 animate-spin" /> : <IconArrowRight className="w-4 h-4" />}
                <span className="ml-1">Next</span>
              </Button>
            </div>
          </div>
        )}

        {step === "select-array" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1" data-testid="text-select-array-title">
                Which data do you want to use?
              </h3>
              <p className="text-sm text-muted-foreground">
                We found multiple array properties in the response. Please select which one contains the data for your table.
              </p>
            </div>
            <div className="grid gap-2">
              {state.arrayOptions.map((key) => {
                const arr = (state.rawData as Record<string, unknown>)[key] as unknown[];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectArray(key)}
                    className="flex items-center justify-between p-3 rounded-md border text-left hover-elevate"
                    data-testid={`button-select-array-${key}`}
                  >
                    <div>
                      <span className="font-medium text-foreground">{key}</span>
                      <span className="text-xs text-muted-foreground ml-2">({arr.length} items)</span>
                    </div>
                    <IconArrowRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
            <div className="flex justify-start">
              <Button variant="outline" onClick={() => setStep("url")} data-testid="button-back-url">
                <IconArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </div>
          </div>
        )}

        {step === "consistency" && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-md">
              <IconAlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground" data-testid="text-consistency-error">
                  Inconsistent data
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We detected that the data rows have inconsistent columns. Each row must have the same properties for the table to work correctly.
                </p>
              </div>
            </div>
            <div className="flex justify-start gap-2">
              <Button variant="outline" onClick={() => setStep("url")} data-testid="button-back-start">
                <IconArrowLeft className="w-4 h-4 mr-1" />
                Start over
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep("columns-prompt")}
                data-testid="button-continue-anyway"
              >
                Continue anyway
                <IconArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {step === "columns-prompt" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1" data-testid="text-columns-title">
                Configure your columns
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                We detected the following columns in your data:
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {state.availableKeys.map((key) => (
                  <Badge key={key} variant="secondary" data-testid={`badge-column-${key}`}>
                    {key}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Describe which columns you want to display and in what order. For example: "4 columns: first the weekday, then the name, then the email, and finally the age"
              </p>
            </div>
            <Textarea
              placeholder="Describe the columns you want..."
              value={state.columnsPrompt}
              onChange={(e) => updateState({ columnsPrompt: e.target.value })}
              className="min-h-[80px]"
              data-testid="input-columns-prompt"
            />
            {error && <ErrorMessage message={error} />}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (state.arrayOptions.length > 1) setStep("select-array");
                  else setStep("url");
                }}
                data-testid="button-back-columns"
              >
                <IconArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                onClick={handleGenerateColumns}
                disabled={!state.columnsPrompt.trim()}
                data-testid="button-generate-columns"
              >
                <IconArrowRight className="w-4 h-4 mr-1" />
                Generate table
              </Button>
            </div>
          </div>
        )}

        {step === "ai-processing" && (
          <div className="flex flex-col items-center py-8 gap-4">
            <IconLoader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground" data-testid="text-ai-processing">
              AI is configuring your table columns...
            </p>
          </div>
        )}

        {step === "action" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1" data-testid="text-action-title">
                Add row actions?
              </h3>
              <p className="text-sm text-muted-foreground">
                Would you like to add an action button to each row? This can link to a detail page or external URL.
              </p>
            </div>

            {state.tableConfig && (
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Preview of generated columns:</p>
                <div className="flex flex-wrap gap-1.5">
                  {state.tableConfig.columns.map((col) => (
                    <Badge key={col.key} variant="outline" data-testid={`badge-generated-${col.key}`}>
                      {col.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant={state.addAction ? "default" : "outline"}
                  onClick={() => updateState({ addAction: true })}
                  data-testid="button-add-action-yes"
                >
                  Yes, add actions
                </Button>
                <Button
                  variant={!state.addAction ? "default" : "outline"}
                  onClick={() => updateState({ addAction: false })}
                  data-testid="button-add-action-no"
                >
                  No, skip
                </Button>
              </div>

              {state.addAction && (
                <div className="space-y-2 pl-1">
                  <div className="space-y-1">
                    <Label htmlFor="action-label">Button label</Label>
                    <Input
                      id="action-label"
                      placeholder="View"
                      value={state.actionLabel}
                      onChange={(e) => updateState({ actionLabel: e.target.value })}
                      data-testid="input-action-label"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="action-href">Link URL</Label>
                    <div className="flex items-center gap-2">
                      <IconLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <Input
                        id="action-href"
                        placeholder="https://example.com/detail/{id}"
                        value={state.actionHref}
                        onChange={(e) => updateState({ actionHref: e.target.value })}
                        data-testid="input-action-href"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Use {"{columnName}"} to insert row values in the URL.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {error && <ErrorMessage message={error} />}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep("columns-prompt")}
                data-testid="button-back-action"
              >
                <IconArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button onClick={handleFinish} data-testid="button-finish">
                <IconCheck className="w-4 h-4 mr-1" />
                Create table
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function StepIndicator({ current }: { current: WizardStep }) {
  const steps: { key: WizardStep[]; label: string }[] = [
    { key: ["url"], label: "Data source" },
    { key: ["select-array", "consistency"], label: "Validate" },
    { key: ["columns-prompt", "ai-processing"], label: "Columns" },
    { key: ["action", "done"], label: "Actions" },
  ];

  const currentIdx = steps.findIndex((s) => s.key.includes(current));

  return (
    <div className="flex items-center gap-2" data-testid="step-indicator">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
              i < currentIdx
                ? "bg-primary text-primary-foreground"
                : i === currentIdx
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {i < currentIdx ? <IconCheck className="w-3 h-3" /> : i + 1}
          </div>
          <span
            className={`text-xs ${
              i === currentIdx ? "text-foreground font-medium" : "text-muted-foreground"
            } hidden sm:inline`}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && <div className="w-6 h-px bg-border hidden sm:block" />}
        </div>
      ))}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md text-sm" data-testid="text-error-message">
      <IconAlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
      <span className="text-destructive">{message}</span>
    </div>
  );
}

export default TableBuilderWizard;
