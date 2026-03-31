import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { VideoCard } from '@/components/VideoCard';
import { useAppData } from '@/hooks/use-app-data';

const ChannelPage = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();
  const { data, getVideosForChannel } = useAppData();
  const channel = data.channels.find(c => c.id === channelId);
  const videos = channelId ? getVideosForChannel(channelId) : [];

  if (!channel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Channel not found</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={channel.avatarUrl} />
          <AvatarFallback className="bg-pastel-pink font-bold">
            {channel.title.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-lg font-bold truncate">{channel.title}</h1>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {videos.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No videos from this channel yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((v, i) => (
              <VideoCard key={v.id} video={v} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ChannelPage;
