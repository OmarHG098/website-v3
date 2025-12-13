import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { IconPhoto, IconSearch, IconArrowLeft, IconCopy, IconCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import type { ImageRegistry } from "@shared/schema";

export default function MediaGallery() {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: registry, isLoading, error } = useQuery<ImageRegistry>({
    queryKey: ["/api/image-registry"],
  });

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredImages = registry?.images
    ? Object.entries(registry.images).filter(([id, img]) => {
        const searchLower = search.toLowerCase();
        return (
          id.toLowerCase().includes(searchLower) ||
          img.alt.toLowerCase().includes(searchLower) ||
          img.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      })
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <IconArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <IconPhoto className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Media Gallery</h1>
              <p className="text-sm text-muted-foreground">
                Images from the centralized image registry
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, alt text, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
              <p className="mt-4 text-muted-foreground">Loading images...</p>
            </div>
          </div>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive" data-testid="text-error">
                Failed to load image registry
              </p>
            </CardContent>
          </Card>
        )}

        {registry && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Presets</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(registry.presets).map(([name, preset]) => (
                  <Badge
                    key={name}
                    variant="secondary"
                    className="cursor-default"
                    data-testid={`badge-preset-${name}`}
                  >
                    {name}
                    {preset.aspect_ratio && (
                      <span className="ml-1 opacity-70">({preset.aspect_ratio})</span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredImages.map(([id, img]) => (
                <Card key={id} className="overflow-hidden" data-testid={`card-image-${id}`}>
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.parentElement?.classList.add("flex", "items-center", "justify-center");
                        const placeholder = document.createElement("div");
                        placeholder.className = "text-muted-foreground text-sm";
                        placeholder.textContent = "Image not found";
                        target.parentElement?.appendChild(placeholder);
                      }}
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-sm font-mono truncate" data-testid={`text-image-id-${id}`}>
                        {id}
                      </CardTitle>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 flex-shrink-0"
                        onClick={() => handleCopyId(id)}
                        data-testid={`button-copy-${id}`}
                      >
                        {copiedId === id ? (
                          <IconCheck className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <IconCopy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2" data-testid={`text-image-alt-${id}`}>
                      {img.alt}
                    </p>
                    {img.tags && img.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {img.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredImages.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <IconPhoto className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground" data-testid="text-no-results">
                  {search ? "No images match your search" : "No images in registry"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
