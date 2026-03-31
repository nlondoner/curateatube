import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle, Plus, ArrowLeft } from 'lucide-react';
import { parseYouTubeUrl, fetchVideoMetadata } from '@/lib/youtube';
import type { Video, Channel } from '@/lib/types';

interface ParentSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appData: {
    data: { videos: Video[]; channels: Channel[] };
    addVideo: (v: Video) => void;
    removeVideo: (id: string) => void;
    addChannel: (c: Channel) => void;
    removeChannel: (id: string) => void;
    hasVideoId: (id: string) => boolean;
    hasChannelId: (id: string) => boolean;
  };
}

export function ParentSettings({ open, onOpenChange, appData }: ParentSettingsProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setError('');
    const parsed = parseYouTubeUrl(url.trim());

    if (!parsed) {
      setError('Invalid YouTube URL. Paste a video or channel link.');
      return;
    }

    if (parsed.type === 'video') {
      if (appData.hasVideoId(parsed.videoId)) {
        setError('This video is already added.');
        return;
      }
      setLoading(true);
      const meta = await fetchVideoMetadata(parsed.videoId);
      const video: Video = {
        id: crypto.randomUUID(),
        youtubeVideoId: parsed.videoId,
        title: meta?.title || 'Untitled Video',
        thumbnailUrl: meta?.thumbnailUrl || `https://img.youtube.com/vi/${parsed.videoId}/hqdefault.jpg`,
        channelTitle: meta?.channelTitle,
        addedAt: new Date().toISOString(),
      };
      appData.addVideo(video);
      setLoading(false);
      setUrl('');
    } else {
      if (appData.hasChannelId(parsed.channelId)) {
        setError('This channel is already added.');
        return;
      }
      const channel: Channel = {
        id: crypto.randomUUID(),
        youtubeChannelId: parsed.channelId,
        title: parsed.channelId,
        avatarUrl: '',
        addedAt: new Date().toISOString(),
      };
      appData.addChannel(channel);
      setUrl('');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">Parent Settings</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Add URL */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Add YouTube Video or Channel</label>
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={e => { setUrl(e.target.value); setError(''); }}
                placeholder="Paste YouTube URL here..."
                className="flex-1"
              />
              <Button onClick={handleAdd} disabled={loading || !url.trim()} className="rounded-xl">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          {/* Videos list */}
          <div>
            <h3 className="font-bold mb-2">Allowed Videos ({appData.data.videos.length})</h3>
            {appData.data.videos.length === 0 ? (
              <p className="text-sm text-muted-foreground">No videos added yet.</p>
            ) : (
              <div className="space-y-2">
                {appData.data.videos.map(v => (
                  <div key={v.id} className="flex items-center gap-3 p-2 rounded-xl bg-muted/50">
                    <img src={v.thumbnailUrl} alt="" className="w-20 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{v.title}</p>
                      {v.channelTitle && <p className="text-xs text-muted-foreground">{v.channelTitle}</p>}
                    </div>
                    {v.broken && <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />}
                    <Button variant="ghost" size="icon" onClick={() => appData.removeVideo(v.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Channels list */}
          <div>
            <h3 className="font-bold mb-2">Allowed Channels ({appData.data.channels.length})</h3>
            {appData.data.channels.length === 0 ? (
              <p className="text-sm text-muted-foreground">No channels added yet.</p>
            ) : (
              <div className="space-y-2">
                {appData.data.channels.map(c => (
                  <div key={c.id} className="flex items-center gap-3 p-2 rounded-xl bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-pastel-pink flex items-center justify-center text-sm font-bold">
                      {c.title.charAt(0).toUpperCase()}
                    </div>
                    <span className="flex-1 text-sm font-medium truncate">{c.title}</span>
                    <Button variant="ghost" size="icon" onClick={() => appData.removeChannel(c.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button variant="outline" className="w-full rounded-xl" onClick={() => onOpenChange(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Kid Mode
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
