import { useState } from 'react';
import { Settings } from 'lucide-react';
import { useAppData } from '@/hooks/use-app-data';
import { VideoCard } from '@/components/VideoCard';
import { ChannelTile } from '@/components/ChannelTile';
import { EmptyState } from '@/components/EmptyState';
import { MathGate } from '@/components/MathGate';
import { ParentSettings } from '@/components/ParentSettings';

const Index = () => {
  const appData = useAppData();
  const { data } = appData;
  const [gateOpen, setGateOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const visibleVideos = data.videos.filter(v => !v.broken);
  const isEmpty = visibleVideos.length === 0 && data.channels.length === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-primary to-[hsl(var(--pastel-pink))] bg-clip-text text-transparent">
          CurateATube
        </h1>
        <button
          onClick={() => setGateOpen(true)}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Parent settings"
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <>
            {/* Videos */}
            {visibleVideos.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold mb-4">My Shows</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {visibleVideos.map((v, i) => (
                    <VideoCard key={v.id} video={v} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* Channels */}
            {data.channels.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">My Channels</h2>
                <div className="flex flex-wrap gap-4">
                  {data.channels.map(c => (
                    <ChannelTile key={c.id} channel={c} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <MathGate
        open={gateOpen}
        onOpenChange={setGateOpen}
        onSuccess={() => {
          setGateOpen(false);
          setSettingsOpen(true);
        }}
      />

      <ParentSettings
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        appData={appData}
      />
    </div>
  );
};

export default Index;
