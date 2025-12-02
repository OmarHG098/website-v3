import ResponsiveEmbed from 'react-responsive-embed';
import SolidCard from './SolidCard';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  className?: string;
  ratio?: string;
}

export default function VideoPlayer({ videoId, title, className = "", ratio = "16:9" }: VideoPlayerProps) {
  return (
    <SolidCard className={`!p-0 !min-h-0 overflow-hidden ${className}`}>
      <div data-testid="video-player">
        <ResponsiveEmbed
          src={`https://www.youtube.com/embed/${videoId}`}
          ratio={ratio}
          title={title}
        />
      </div>
    </SolidCard>
  );
}