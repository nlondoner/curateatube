export function parseYouTubeUrl(url: string): { type: 'video'; videoId: string } | { type: 'channel'; channelId: string; format: string } | null {
  try {
    const u = new URL(url);
    
    // Video patterns
    if (u.hostname.includes('youtube.com') && u.pathname === '/watch') {
      const v = u.searchParams.get('v');
      if (v) return { type: 'video', videoId: v };
    }
    if (u.hostname === 'youtu.be') {
      const v = u.pathname.slice(1);
      if (v) return { type: 'video', videoId: v };
    }
    if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/embed/')) {
      const v = u.pathname.split('/embed/')[1]?.split('/')[0];
      if (v) return { type: 'video', videoId: v };
    }
    if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/shorts/')) {
      const v = u.pathname.split('/shorts/')[1]?.split('/')[0];
      if (v) return { type: 'video', videoId: v };
    }

    // Channel patterns
    if (u.hostname.includes('youtube.com')) {
      const path = u.pathname;
      if (path.startsWith('/channel/')) {
        const id = path.split('/channel/')[1]?.split('/')[0];
        if (id) return { type: 'channel', channelId: id, format: 'id' };
      }
      if (path.startsWith('/@')) {
        const handle = path.split('/@')[1]?.split('/')[0];
        if (handle) return { type: 'channel', channelId: handle, format: 'handle' };
      }
      if (path.startsWith('/c/')) {
        const name = path.split('/c/')[1]?.split('/')[0];
        if (name) return { type: 'channel', channelId: name, format: 'custom' };
      }
    }
  } catch {
    // not a valid URL
  }
  return null;
}

export async function fetchVideoMetadata(videoId: string): Promise<{ title: string; thumbnailUrl: string; channelTitle?: string } | null> {
  try {
    const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
    const data = await res.json();
    if (data.title) {
      return {
        title: data.title,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        channelTitle: data.author_name || undefined,
      };
    }
  } catch {
    // fallback
  }
  return null;
}

export function getVideoThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function getEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}
