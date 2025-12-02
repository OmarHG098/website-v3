import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import SolidCard from './SolidCard';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  className?: string;
  aspectRatio?: string;
}

export default function VideoPlayer({ videoId, title, className = "", aspectRatio }: VideoPlayerProps) {
  return (
    <SolidCard className={`!p-0 !min-h-0 overflow-hidden ${className}`}>
      <div 
        data-testid="video-player"
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <LiteYouTubeEmbed
          id={videoId}
          title={title}
          poster="maxresdefault"
          webp
        />
      </div>
    </SolidCard>
  );
}
