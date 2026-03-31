import { Tv } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-28 h-28 rounded-full bg-pastel-lavender flex items-center justify-center mb-6">
        <Tv className="h-14 w-14 text-accent-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No shows yet!</h2>
      <p className="text-muted-foreground text-lg max-w-sm">
        Ask your parent to add some shows! 🎬
      </p>
    </div>
  );
}
