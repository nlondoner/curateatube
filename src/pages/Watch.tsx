import { useParams, useNavigate } from 'react-router-dom';
import { Home, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getEmbedUrl } from '@/lib/youtube';
import { useAppData } from '@/hooks/use-app-data';

const Watch = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { data } = useAppData();
  const video = data.videos.find(v => v.youtubeVideoId === videoId);

  if (!videoId) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Player */}
        <AspectRatio ratio={16 / 9}>
          <iframe
            src={getEmbedUrl(videoId)}
            title={video?.title || 'Video'}
            className="w-full h-full rounded-b-2xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </AspectRatio>

        {/* Info */}
        <div className="px-4 py-4 space-y-4">
          <h1 className="text-xl font-bold">{video?.title || 'Video'}</h1>
          {video?.channelTitle && (
            <p className="text-muted-foreground font-medium">{video.channelTitle}</p>
          )}

          {/* Controls */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 h-14 rounded-2xl text-base gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" /> Back
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-14 rounded-2xl text-base gap-2"
              onClick={() => {
                const iframe = document.querySelector('iframe');
                if (iframe) iframe.src = iframe.src;
              }}
            >
              <RotateCcw className="h-5 w-5" /> Replay
            </Button>
            <Button
              className="flex-1 h-14 rounded-2xl text-base gap-2"
              onClick={() => navigate('/')}
            >
              <Home className="h-5 w-5" /> Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
