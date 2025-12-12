import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IconArrowLeft, IconArrowRight, IconSearch, IconRoute, IconExternalLink } from "@tabler/icons-react";
import { Link } from "wouter";
import { isDebugModeActive } from "@/hooks/useDebugAuth";

interface Redirect {
  from: string;
  to: string;
  type: string;
}

export default function PrivateRedirects() {
  const [search, setSearch] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    setIsAuthorized(isDebugModeActive());
  }, []);

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
          <div className="space-y-6">
            {Object.entries(groupedByType).map(([type, typeRedirects]) => (
              <Card key={type}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Badge variant="secondary">{type}</Badge>
                      <span className="text-muted-foreground font-normal text-sm">
                        {typeRedirects.length} redirect{typeRedirects.length !== 1 ? 's' : ''}
                      </span>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="border rounded-lg divide-y overflow-hidden">
                    {typeRedirects.map((redirect, index) => (
                      <div
                        key={`${redirect.from}-${index}`}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/50 transition-colors"
                        data-testid={`redirect-row-${index}`}
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
                            data-testid={`link-redirect-target-${index}`}
                          >
                            <IconExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
