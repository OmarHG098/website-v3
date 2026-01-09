import { useState, lazy, Suspense } from "react";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SolidCard from './SolidCard';

// @ts-expect-error - react-responsive-embed lacks TypeScript types
const ResponsiveEmbed = lazy(() => import('react-responsive-embed'));

export interface VideoConfig {
  url: string;
  ratio?: string;
  muted?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  preview_image_url?: string;
  with_shadow_border?: boolean;
}

interface UniversalVideoProps extends Omit<VideoConfig, 'with_shadow_border'> {
  className?: string;
  withShadowBorder?: boolean;
  useSolidCard?: boolean;
  bordered?: boolean;
}

const isLocalVideo = (url: string): boolean => {
  const localExtensions = [".mp4", ".webm", ".mov", ".ogg", ".m4v"];
  const lowerUrl = url.toLowerCase();
  return localExtensions.some(ext => lowerUrl.endsWith(ext)) || 
         (url.startsWith("/") && !url.includes("youtube") && !url.includes("vimeo"));
};

const isYouTubeUrl = (url: string): boolean => {
  return url.includes("youtube.com") || url.includes("youtu.be");
};

const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

const parseRatio = (ratio?: string): { paddingTop: string } => {
  if (!ratio) return { paddingTop: "56.25%" };
  const [w, h] = ratio.split(":").map(Number);
  if (w && h) {
    return { paddingTop: `${(h / w) * 100}%` };
  }
  return { paddingTop: "56.25%" };
};

export function UniversalVideo({
  url,
  ratio = "16:9",
  muted = true,
  autoplay = false,
  loop = true,
  preview_image_url,
  className = "",
  withShadowBorder = false,
  useSolidCard = false,
  bordered = false,
}: UniversalVideoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const aspectRatio = parseRatio(ratio);
  const borderClasses = bordered ? "border-2 border-muted-foreground/40 rounded-lg" : "";

  const isYouTube = isYouTubeUrl(url);
  const youtubeId = isYouTube ? extractYouTubeId(url) : null;
  
  const thumbnailUrl = preview_image_url || (youtubeId ? getYouTubeThumbnail(youtubeId) : null);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const renderPreview = () => {
    if (thumbnailUrl) {
      return (
        <div 
          className={`relative overflow-hidden rounded-lg cursor-pointer group ${borderClasses} ${className}`}
          style={aspectRatio}
          onClick={handleClick}
          data-testid="video-preview"
        >
          <img
            src={thumbnailUrl}
            alt="Video preview"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (youtubeId && thumbnailUrl.includes('maxresdefault')) {
                target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
              }
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <IconPlayerPlayFilled className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground ml-1" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`relative overflow-hidden rounded-lg cursor-pointer group bg-muted ${borderClasses} ${className}`}
        style={aspectRatio}
        onClick={handleClick}
        data-testid="video-placeholder"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <IconPlayerPlayFilled className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground ml-1" />
          </div>
          <p className="text-sm text-muted-foreground text-center px-4">
            Video preview not available
          </p>
        </div>
      </div>
    );
  };

  const renderVideoPlayer = () => {
    if (isYouTube && youtubeId) {
      return (
        <Suspense fallback={<div className="w-full aspect-video bg-muted animate-pulse rounded-lg" />}>
          <div className="w-full overflow-hidden rounded-lg" data-testid="video-modal-player">
            <ResponsiveEmbed
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              ratio={ratio}
              title="Video"
            />
          </div>
        </Suspense>
      );
    }

    if (isLocalVideo(url)) {
      return (
        <div 
          className="relative overflow-hidden rounded-lg w-full"
          style={aspectRatio}
          data-testid="video-modal-player"
        >
          <video
            src={url}
            autoPlay
            loop={loop}
            muted={muted}
            playsInline
            controls
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <Suspense fallback={<div className="w-full aspect-video bg-muted animate-pulse rounded-lg" />}>
        <div className="w-full overflow-hidden rounded-lg" data-testid="video-modal-player">
          <ResponsiveEmbed
            src={url}
            ratio={ratio}
            title="Video"
          />
        </div>
      </Suspense>
    );
  };

  const previewContent = renderPreview();

  const wrappedPreview = (withShadowBorder || useSolidCard) ? (
    <SolidCard className="!p-0 !min-h-0 overflow-hidden">
      {previewContent}
    </SolidCard>
  ) : previewContent;

  return (
    <>
      {wrappedPreview}
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 bg-black border-none">
          <div className="p-4">
            {isModalOpen && renderVideoPlayer()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UniversalVideo;
