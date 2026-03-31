import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

function generateChallenge() {
  const a = Math.floor(Math.random() * 20) + 12;
  const b = Math.floor(Math.random() * 9) + 3;
  return { question: `${a} × ${b}`, answer: a * b };
}

interface MathGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function MathGate({ open, onOpenChange, onSuccess }: MathGateProps) {
  const challenge = useMemo(() => generateChallenge(), [open]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(input) === challenge.answer) {
      setInput('');
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lock className="h-5 w-5" /> Parent Access
          </DialogTitle>
          <DialogDescription>Solve this to continue:</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-center text-3xl font-bold text-foreground">
            {challenge.question} = ?
          </p>
          <Input
            type="number"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false); }}
            placeholder="Your answer"
            className="text-center text-xl h-14"
            autoFocus
          />
          {error && <p className="text-destructive text-center text-sm">Not quite! Try again.</p>}
          <Button type="submit" className="w-full h-12 text-lg rounded-xl">
            Unlock
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
