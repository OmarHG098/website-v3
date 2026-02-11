import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IconArrowLeft, IconArrowRight, IconSearch, IconRoute, IconExternalLink, IconChevronRight, IconShieldCheck, IconRefresh, IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";
import { Link } from "wouter";
import { isDebugModeActive } from "@/hooks/useDebugAuth";
import { apiRequest } from "@/lib/queryClient";

interface Redirect {
  from: string;
  to: string;
  type: string;
}

interface ValidationIssue {
  type: "error" | "warning";
  code: string;
  message: string;
  file?: string;
  suggestion?: string;
}

interface ValidationResult {
  name: string;
  description: string;
  status: "passed" | "failed" | "warning";
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  duration: number;
}

export default function PrivateRedirects() {
  const [search, setSearch] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    setIsAuthorized(isDebugModeActive());
  }, []);

  const runValidation = useCallback(async () => {
    setIsValidating(true);
    try {
      const res = await apiRequest("POST", "/api/validation/run/redirects");
      const data = await res.json();
      setValidationResult(data);
      if (data.status === "failed" || data.status === "warning") {
        setShowValidation(true);
      }
    } catch {
      setValidationResult(null);
    } finally {
      setIsValidating(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      runValidation();
    }
  }, [isAuthorized, runValidation]);

  const { data: redirectsData, isLoading } = useQuery<{ redirects: Redirect[] }>({
    queryKey: ['/api/debug/redirects'],
    enabled: isAuthorized,
  });

  const redirects = redirectsData?.redirects || [];

  const filteredRedirects = redirects.filter((r) =>
    r.from.toLowerCase().includes(search.toLowerCase()) ||
    r.to.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase())
  );

  const groupedByType = filteredRedirects.reduce((acc, redirect) => {
    if (!acc[redirect.type]) {
      acc[redirect.type] = [];
    }
    acc[redirect.type].push(redirect);
    return acc;
  }, {} as Record<string, Redirect[]>);

  const totalIssues = validationResult
    ? validationResult.errors.length + validationResult.warnings.length
    : 0;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              This page requires debug mode. Add <code className="bg-muted px-1 rounded">?debug=true</code> to the URL.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button variant="outline" data-testid="link-back-home">
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" data-testid="link-back-home">
                  <IconArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <IconRoute className="w-5 h-5" />
                  URL Redirects
                </h1>
                <p className="text-sm text-muted-foreground">
                  {redirects.length} 301 redirect{redirects.length !== 1 ? 's' : ''} configured
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                {validationResult && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowValidation(!showValidation)}
                    data-testid="button-toggle-validation"
                  >
                    {validationResult.status === "passed" ? (
                      <Badge variant="secondary" className="gap-1">
                        <IconCircleCheck className="h-3.5 w-3.5" />
                        Passed
                      </Badge>
                    ) : validationResult.status === "warning" ? (
                      <Badge variant="outline" className="gap-1">
                        <IconAlertTriangle className="h-3.5 w-3.5" />
                        {totalIssues} warning{totalIssues !== 1 ? 's' : ''}
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <IconAlertTriangle className="h-3.5 w-3.5" />
                        {totalIssues} issue{totalIssues !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runValidation}
                  disabled={isValidating}
                  data-testid="button-run-validation"
                >
                  {isValidating ? (
                    <div className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2" />
                  ) : (
                    <IconRefresh className="h-3.5 w-3.5 mr-2" />
                  )}
                  {isValidating ? "Validating..." : "Re-validate"}
                </Button>
              </div>
              <div className="relative w-full sm:w-64">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search redirects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-redirects"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showValidation && validationResult && (
        <div className="border-b" style={{ background: "hsl(var(--muted-foreground) / 0.05)" }}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 mb-3">
              <IconShieldCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Validation Results</span>
              <span className="text-xs text-muted-foreground">({validationResult.duration}ms)</span>
            </div>
            {totalIssues === 0 ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md border text-sm">
                <IconCircleCheck className="h-4 w-4 flex-shrink-0" />
                All redirect checks passed. No conflicts, loops, or self-redirects found.
              </div>
            ) : (
            <div className="space-y-2">
              {validationResult.errors.map((issue, i) => (
                <div key={`err-${i}`} className="flex items-start gap-3 px-3 py-2 rounded-md border bg-destructive/5 border-destructive/20" data-testid={`validation-error-${i}`}>
                  <IconAlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="destructive" className="text-xs">{issue.code}</Badge>
                      {issue.file && <span className="text-xs text-muted-foreground truncate">{issue.file}</span>}
                    </div>
                    <p className="text-sm mt-1">{issue.message}</p>
                    {issue.suggestion && (
                      <p className="text-xs text-muted-foreground mt-1">{issue.suggestion}</p>
                    )}
                  </div>
                </div>
              ))}
              {validationResult.warnings.map((issue, i) => (
                <div key={`warn-${i}`} className="flex items-start gap-3 px-3 py-2 rounded-md border" style={{ background: "hsl(var(--muted-foreground) / 0.03)" }} data-testid={`validation-warning-${i}`}>
                  <IconAlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{issue.code}</Badge>
                      {issue.file && <span className="text-xs text-muted-foreground truncate">{issue.file}</span>}
                    </div>
                    <p className="text-sm mt-1">{issue.message}</p>
                    {issue.suggestion && (
                      <p className="text-xs text-muted-foreground mt-1">{issue.suggestion}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          </div>
        ) : filteredRedirects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              {search ? "No redirects match your search" : "No redirects configured"}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {Object.entries(groupedByType).map(([type, typeRedirects]) => {
              const isExpanded = expandedType === type;
              return (
                <div key={type}>
                  <button
                    onClick={() => setExpandedType(isExpanded ? null : type)}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-sm hover-elevate"
                    data-testid={`button-toggle-${type}`}
                  >
                    <IconChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    <Badge variant="secondary">{type}</Badge>
                    <span className="text-muted-foreground font-normal text-sm">
                      {typeRedirects.length} redirect{typeRedirects.length !== 1 ? 's' : ''}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-1 border rounded-lg divide-y overflow-hidden">
                      {typeRedirects.map((redirect, index) => (
                        <div
                          key={`${redirect.from}-${index}`}
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/50 transition-colors"
                          data-testid={`redirect-row-${type}-${index}`}
                        >
                          <div className="flex-1 min-w-0">
                            <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                              {redirect.from}
                            </code>
                          </div>
                          <IconArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0 flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded block truncate flex-1">
                              {redirect.to}
                            </code>
                            <a
                              href={redirect.to}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded hover:bg-muted flex-shrink-0"
                              title="Open target URL"
                              data-testid={`link-redirect-target-${type}-${index}`}
                            >
                              <IconExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
