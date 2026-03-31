import { useNavigate } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { Video } from '@/lib/types';

const pastelBgs = ['bg-pastel-blue', 'bg-pastel-mint', 'bg-pastel-pink', 'bg-pastel-lavender', 'bg-pastel-yellow'];

export function VideoCard({ video, index }: { video: Video; index: number }) {
  const navigate = useNavigate();
  const bg = pastelBgs[index % pastelBgs.length];

  return (
    <button
      onClick={() => navigate(`/watch/${video.youtubeVideoId}`)}
      className={`group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-[1.03] ${bg} text-left w-full`}
    >
      <AspectRatio ratio={16 / 9}>
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </AspectRatio>
      <div className="p-3">
        <h3 className="font-bold text-sm leading-tight line-clamp-2 text-foreground">{video.title}</h3>
        {video.channelTitle && (
          <p className="text-xs text-muted-foreground mt-1 truncate">{video.channelTitle}</p>
        )}
      </div>
    </button>
  );
}
