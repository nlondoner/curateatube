export interface Video {
  id: string;
  youtubeVideoId: string;
  title: string;
  thumbnailUrl: string;
  channelId?: string;
  channelTitle?: string;
  description?: string;
  addedAt: string;
  broken?: boolean;
}

export interface Channel {
  id: string;
  youtubeChannelId: string;
  title: string;
  avatarUrl: string;
  addedAt: string;
}

export interface AppData {
  videos: Video[];
  channels: Channel[];
}
