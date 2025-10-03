import { Button } from '@/components/ui/button';
import { SiGithub } from 'react-icons/si';

export async function StarsCount() {
  const data = await fetch('https://api.github.com/repos/nabinkhair42/fastly', {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },

    next: { revalidate: 86400 },
  });
  const json = await data.json();

  return (
    <span className="text-muted-foreground w-8 text-xs tabular-nums">{json.stargazers_count}</span>
  );
}

export const GitHubButton = () => {
  return (
    <>
      <Button variant={'outline'} size="sm" className="rounded-full sm:inline-flex shadow-none">
        <SiGithub />
        <StarsCount />
      </Button>
    </>
  );
};
