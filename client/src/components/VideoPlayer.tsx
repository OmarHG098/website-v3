import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  className?: string;
}

export default function VideoPlayer({ videoId, title, className = "" }: VideoPlayerProps) {
  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-lg ${className}`}
      data-testid="video-player"
    >
      <LiteYouTubeEmbed
        id={videoId}
        title={title}
        poster="maxresdefault"
        webp
      />
    </div>
  );
}
