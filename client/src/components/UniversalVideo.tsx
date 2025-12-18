import { useState } from "react";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
// @ts-expect-error - react-responsive-embed lacks TypeScript types
import ResponsiveEmbed from 'react-responsive-embed';
import SolidCard from './SolidCard';

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
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
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
}: UniversalVideoProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [showPreview, setShowPreview] = useState(!autoplay && !!preview_image_url);
  const aspectRatio = parseRatio(ratio);

  const handlePlay = () => {
    setShowPreview(false);
    setIsPlaying(true);
  };

  const renderVideo = () => {
    if (isYouTubeUrl(url)) {
      const videoId = extractYouTubeId(url);
      if (videoId) {
        return (
          <div 
            className={`overflow-hidden rounded-lg ${className}`}
            data-testid="video-container"
          >
            <ResponsiveEmbed
              src={`https://www.youtube.com/embed/${videoId}`}
              ratio={ratio}
              title="Video"
            />
          </div>
        );
      }
    }

    if (isLocalVideo(url)) {
      return (
        <div 
          className={`relative overflow-hidden rounded-lg shadow-lg ${className}`}
          style={aspectRatio}
          data-testid="video-container"
        >
          {showPreview ? (
            <div 
              className="absolute inset-0 cursor-pointer group"
              onClick={handlePlay}
              data-testid="video-preview"
            >
              <img
                src={preview_image_url}
                alt="Video preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <IconPlayerPlayFilled className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground ml-1" />
                </div>
              </div>
            </div>
          ) : (
            <video
              src={url}
              autoPlay={isPlaying || autoplay}
              loop={loop}
              muted={muted}
              playsInline
              controls={!autoplay}
              className="absolute inset-0 w-full h-full object-cover"
              data-testid="video-native"
            />
          )}
        </div>
      );
    }

    return (
      <div 
        className={`overflow-hidden rounded-lg ${className}`}
        data-testid="video-container"
      >
        <ResponsiveEmbed
          src={url}
          ratio={ratio}
          title="Video"
        />
      </div>
    );
  };

  if (withShadowBorder) {
    return (
      <SolidCard className="!p-0 !min-h-0 overflow-hidden">
        {renderVideo()}
      </SolidCard>
    );
  }

  return renderVideo();
}

export default UniversalVideo;
