import { useState, useEffect, useCallback } from 'react';
import type { AppData, Video, Channel } from '@/lib/types';

const STORAGE_KEY = 'curateatube_data';

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { videos: [], channels: [] };
}

function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useAppData() {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const addVideo = useCallback((video: Video) => {
    setData(prev => ({
      ...prev,
      videos: [...prev.videos, video],
    }));
  }, []);

  const removeVideo = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      videos: prev.videos.filter(v => v.id !== id),
    }));
  }, []);

  const addChannel = useCallback((channel: Channel) => {
    setData(prev => ({
      ...prev,
      channels: [...prev.channels, channel],
    }));
  }, []);

  const removeChannel = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      channels: prev.channels.filter(c => c.id !== id),
    }));
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
    addVideo,
    removeVideo,
    addChannel,
    removeChannel,
    hasVideoId,
    hasChannelId,
    getVideosForChannel,
  };
}
