import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Video, Channel, AppData } from '@/lib/types';

export function useAppData() {
  const [data, setData] = useState<AppData>({ videos: [], channels: [] });
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    async function load() {
      const [videosRes, channelsRes] = await Promise.all([
        supabase.from('videos').select('*').order('added_at', { ascending: false }),
        supabase.from('channels').select('*').order('added_at', { ascending: false }),
      ]);

      setData({
        videos: (videosRes.data ?? []).map(v => ({
          id: v.id,
          youtubeVideoId: v.youtube_video_id,
          title: v.title,
          thumbnailUrl: v.thumbnail_url ?? '',
          channelId: v.channel_id ?? undefined,
          channelTitle: v.channel_title ?? undefined,
          description: v.description ?? undefined,
          addedAt: v.added_at,
          broken: v.broken ?? false,
        })),
        channels: (channelsRes.data ?? []).map(c => ({
          id: c.id,
          youtubeChannelId: c.youtube_channel_id,
          title: c.title,
          avatarUrl: c.avatar_url ?? '',
          addedAt: c.added_at,
        })),
      });
      setLoading(false);
    }
    load();
  }, []);

  const addVideo = useCallback(async (video: Video) => {
    const { data: inserted, error } = await supabase.from('videos').insert({
      youtube_video_id: video.youtubeVideoId,
      title: video.title,
      thumbnail_url: video.thumbnailUrl,
      channel_id: video.channelId ?? null,
      channel_title: video.channelTitle ?? null,
      description: video.description ?? null,
      broken: video.broken ?? false,
    }).select().single();

    if (!error && inserted) {
      const mapped: Video = {
        id: inserted.id,
        youtubeVideoId: inserted.youtube_video_id,
        title: inserted.title,
        thumbnailUrl: inserted.thumbnail_url ?? '',
        channelId: inserted.channel_id ?? undefined,
        channelTitle: inserted.channel_title ?? undefined,
        description: inserted.description ?? undefined,
        addedAt: inserted.added_at,
        broken: inserted.broken ?? false,
      };
      setData(prev => ({ ...prev, videos: [mapped, ...prev.videos] }));
    }
  }, []);

  const removeVideo = useCallback(async (id: string) => {
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (!error) {
      setData(prev => ({ ...prev, videos: prev.videos.filter(v => v.id !== id) }));
    }
  }, []);

  const addChannel = useCallback(async (channel: Channel) => {
    const { data: inserted, error } = await supabase.from('channels').insert({
      youtube_channel_id: channel.youtubeChannelId,
      title: channel.title,
      avatar_url: channel.avatarUrl,
    }).select().single();

    if (!error && inserted) {
      const mapped: Channel = {
        id: inserted.id,
        youtubeChannelId: inserted.youtube_channel_id,
        title: inserted.title,
        avatarUrl: inserted.avatar_url ?? '',
        addedAt: inserted.added_at,
      };
      setData(prev => ({ ...prev, channels: [mapped, ...prev.channels] }));
    }
  }, []);

  const removeChannel = useCallback(async (id: string) => {
    const { error } = await supabase.from('channels').delete().eq('id', id);
    if (!error) {
      setData(prev => ({ ...prev, channels: prev.channels.filter(c => c.id !== id) }));
    }
  }, []);

  const hasVideoId = useCallback((youtubeVideoId: string) => {
    return data.videos.some(v => v.youtubeVideoId === youtubeVideoId);
  }, [data.videos]);

  const hasChannelId = useCallback((youtubeChannelId: string) => {
    return data.channels.some(c => c.youtubeChannelId === youtubeChannelId);
  }, [data.channels]);

  const getVideosForChannel = useCallback((channelId: string) => {
    const channel = data.channels.find(c => c.id === channelId);
    if (!channel) return [];
    return data.videos.filter(v => v.channelTitle === channel.title);
  }, [data]);

  return {
    data,
    loading,
    addVideo,
    removeVideo,
    addChannel,
    removeChannel,
    hasVideoId,
    hasChannelId,
    getVideosForChannel,
  };
}
