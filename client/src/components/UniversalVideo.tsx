import { useState, lazy, Suspense } from "react";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { Card } from "@/components/ui/card";

const ReactPlayer = lazy(() => import("react-player"));

export interface VideoConfig {
  url: string;
  ratio?: string;
  muted?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  preview_image_url?: string;
  with_card?: boolean;
}

interface UniversalVideoProps extends Omit<VideoConfig, 'with_card'> {
  className?: string;
  withCard?: boolean;
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
  withCard = false,
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
            className={`relative overflow-hidden rounded-lg ${className}`}
            style={aspectRatio}
            data-testid="video-container"
          >
            <div className="absolute inset-0">
              <LiteYouTubeEmbed
                id={videoId}
                title="Video"
                poster="maxresdefault"
                wrapperClass="yt-lite h-full"
                playerClass="lty-playbtn"
              />
            </div>
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
          <Suspense fallback={
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <ReactPlayer
              url={url}
              playing={isPlaying}
              loop={loop}
              muted={muted}
              controls
              width="100%"
              height="100%"
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          </Suspense>
        )}
      </div>
    );
  };

  if (withCard) {
    return (
      <Card className="overflow-hidden">
        {renderVideo()}
      </Card>
    );
  }

  return renderVideo();
}

export default UniversalVideo;
