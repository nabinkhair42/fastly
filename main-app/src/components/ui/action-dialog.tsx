import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Button } from './button';
import { Input } from './input';

// Helper function to parse bold text without dangerouslySetInnerHTML
function parseDescription(text: string) {
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  const regex = /\*\*(.*?)\*\*/g;

  let match = regex.exec(text);
  while (match !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    // Add bold text
    parts.push(<strong key={match.index}>{match[1]}</strong>);
    lastIndex = regex.lastIndex;
    match = regex.exec(text);
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
interface ActionDialogProps {
  title: string;
  description: string;
  onConfirm: (value?: string) => void;
  onCancel: () => void;
  children?: React.ReactNode;
  type?: 'confirm' | 'rename';
  initialValue?: string;
  confirmText?: string;
  cancelText?: string;
  isActionDestructive?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

export function ActionDialog({
  title,
  description,
  onConfirm,
  onCancel,
  children,
  type = 'confirm',
  initialValue = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isActionDestructive = false,
  isLoading = false,
  loadingText = 'Loading...',
}: ActionDialogProps) {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleConfirm = () => {
    if (type === 'rename') {
      onConfirm(inputValue);
    } else {
      onConfirm();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="space-y-3 pt-4 px-6">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{parseDescription(description)}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {type === 'rename' ? (
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter new title..."
              autoFocus={true}
            />
          ) : (
            children
          )}
        </div>
        <DialogFooter className="gap-2 p-4 px-6">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={type === 'rename' && !inputValue.trim()}
            variant={isActionDestructive ? 'destructive' : 'default'}
            loading={isLoading}
            loadingText={loadingText}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
