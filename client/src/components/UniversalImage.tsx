import { useState, useRef, useEffect } from "react";
import type { ImageRef, ImageEntry, ImagePreset } from "@shared/schema";
import SolidCard from "./SolidCard";

interface ImageRegistryData {
  presets: Record<string, ImagePreset>;
  images: Record<string, ImageEntry>;
}

let registryCache: ImageRegistryData | null = null;
let registryPromise: Promise<ImageRegistryData> | null = null;

async function loadRegistry(): Promise<ImageRegistryData> {
  if (registryCache) return registryCache;
  if (registryPromise) return registryPromise;
  
  registryPromise = fetch("/api/image-registry")
    .then(res => res.json())
    .then(data => {
      registryCache = data;
      return data;
    });
  
  return registryPromise;
}

export function useImageRegistry() {
  const [registry, setRegistry] = useState<ImageRegistryData | null>(registryCache);
  const [loading, setLoading] = useState(!registryCache);

  useEffect(() => {
    if (!registryCache) {
      loadRegistry().then(data => {
        setRegistry(data);
        setLoading(false);
      });
    }
  }, []);

  return { registry, loading };
}

interface UniversalImageProps extends ImageRef {
  loading?: "lazy" | "eager";
  onLoad?: () => void;
  onError?: () => void;
  useSolidCard?: boolean;
  bordered?: boolean;
}

const ASPECT_RATIOS: Record<string, number> = {
  "16:9": 16 / 9,
  "9:16": 9 / 16,
  "4:3": 4 / 3,
  "3:4": 3 / 4,
  "1:1": 1,
  "21:9": 21 / 9,
};

export function UniversalImage({
  id,
  preset = "full",
  alt: altOverride,
  className = "",
  loading = "lazy",
  onLoad,
  onError,
  useSolidCard = false,
  bordered = false,
}: UniversalImageProps) {
  const { registry, loading: registryLoading } = useImageRegistry();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (registryLoading || !registry) {
    return (
      <div 
        className={`bg-muted animate-pulse ${className}`}
        data-testid={`img-skeleton-${id}`}
      />
    );
  }

  const imageEntry = registry.images[id];
  if (!imageEntry) {
    console.warn(`Image not found in registry: ${id}`);
    return (
      <div 
        className={`bg-muted flex items-center justify-center text-muted-foreground text-sm ${className}`}
        data-testid={`img-not-found-${id}`}
      >
        Image not found
      </div>
    );
  }

  const presetConfig = registry.presets[preset];
  const aspectRatio = presetConfig?.aspect_ratio 
    ? ASPECT_RATIOS[presetConfig.aspect_ratio] 
    : undefined;

  const finalAlt = altOverride || imageEntry.alt;
  const src = imageEntry.src;

  const containerStyle: React.CSSProperties = aspectRatio
    ? { aspectRatio: aspectRatio.toString() }
    : {};

  if (hasError) {
    return (
      <div 
        className={`bg-muted flex items-center justify-center text-muted-foreground text-sm ${className}`}
        style={containerStyle}
        data-testid={`img-error-${id}`}
      >
        Failed to load
      </div>
    );
  }

  const borderClasses = bordered ? "border-2 border-black rounded-lg" : "";
  
  const imageContent = (
    <div 
      className={`relative overflow-hidden ${borderClasses} ${useSolidCard ? '' : className}`}
      style={containerStyle}
      data-testid={`img-container-${id}`}
    >
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          data-testid={`img-loading-${id}`}
        />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={finalAlt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        data-testid={`img-${id}`}
      />
    </div>
  );

  if (useSolidCard) {
    return (
      <SolidCard className={`!p-0 !min-h-0 overflow-hidden ${className}`}>
        {imageContent}
      </SolidCard>
    );
  }

  return imageContent;
}

export function getImageUrl(id: string): string | null {
  if (!registryCache) return null;
  const entry = registryCache.images[id];
  return entry?.src || null;
}

export function getImageAlt(id: string): string | null {
  if (!registryCache) return null;
  const entry = registryCache.images[id];
  return entry?.alt || null;
}

export default UniversalImage;
