import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Channel } from '@/lib/types';

export function ChannelTile({ channel }: { channel: Channel }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/channel/${channel.id}`)}
      className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-pastel-mint/50 transition-colors"
    >
      <Avatar className="h-20 w-20 shadow-md">
        <AvatarImage src={channel.avatarUrl} alt={channel.title} />
        <AvatarFallback className="bg-pastel-pink text-lg font-bold">
          {channel.title.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-semibold text-center leading-tight max-w-[100px] truncate">
        {channel.title}
      </span>
    </button>
  );
}
