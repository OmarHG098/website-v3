import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import SolidCard from './SolidCard';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  className?: string;
  vertical?: boolean;
}

export default function VideoPlayer({ videoId, title, className = "", vertical = false }: VideoPlayerProps) {

  if (vertical) {
    return (
      <SolidCard className={`!p-0 !min-h-0 overflow-hidden ${className}`}>
        <div 
          style={{ aspectRatio: '9/12' }}
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
      </SolidCard>
    );
  }

  return (
    <SolidCard className={`!p-0 !min-h-0 overflow-hidden ${className}`}>
      <div data-testid="video-player">
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
