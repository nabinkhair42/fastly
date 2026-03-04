'use client';
import { Button } from '@/components/ui/button';
import { SiGithub } from 'react-icons/si';
import { useEffect, useState } from 'react';

export const GitHubButton = () => {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const res = await fetch('https://api.github.com/repos/nabinkhair42/fastly', {
          headers: { Accept: 'application/vnd.github.v3+json' },
        });
        if (res.ok) {
          const data = await res.json();
          setStars(data.stargazers_count);
        }
      } catch {
        // Silently fail - stars will show as "--"
      }
    };
    fetchStars();
  }, []);

  return (
    <Button
      variant={'outline'}
      size="sm"
      className="rounded-full sm:inline-flex shadow-none"
      onClick={() => window.open('https://github.com/nabinkhair42/fastly', '_blank')}
    >
      <SiGithub />
      <span className="text-muted-foreground text-xs tabular-nums">{stars ?? '--'}</span>
    </Button>
  );
};
