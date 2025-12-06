import { Button } from "@/components/ui/button";
import { SiGithub } from "react-icons/si";
import { Suspense } from "react";

async function StarsCount() {
  try {
    const data = await fetch("https://api.github.com/repos/nabinkhair42/fastly", {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
      next: { revalidate: 86400 },
      cache: "force-cache",
    });

    if (!data.ok) {
      throw new Error(`GitHub API error: ${data.status}`);
    }

    const json = await data.json();

    return (
      <span className="text-muted-foreground w-8 text-xs tabular-nums">
        {json.stargazers_count}
      </span>
    );
  } catch (error) {
    console.error("Failed to fetch GitHub stars:", error);
    return (
      <span className="text-muted-foreground w-8 text-xs tabular-nums">
        --
      </span>
    );
  }
}

export const GitHubButton = () => {
  return (
    <Button
      variant={"outline"}
      size="sm"
      className="rounded-full sm:inline-flex shadow-none"
    >
      <SiGithub />
      <Suspense fallback={<span className="text-muted-foreground w-8 text-xs tabular-nums">--</span>}>
        <StarsCount />
      </Suspense>
    </Button>
  );
};
