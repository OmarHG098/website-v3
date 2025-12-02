import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  className?: string;
  vertical?: boolean;
}

export default function VideoPlayer({ videoId, title, className = "", vertical = false }: VideoPlayerProps) {
  if (vertical) {
    return (
      <div 
        className={`rounded-lg overflow-hidden shadow-lg ${className}`}
        style={{ aspectRatio: '9/16' }}
        data-testid="video-player"
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

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
