"use client";

import { useEffect, useId, useState } from "react";
import { useTheme } from "next-themes";

let mermaidPromise: Promise<typeof import("mermaid")> | null = null;

function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid");
  }
  return mermaidPromise;
}

export function Mermaid({ chart }: { chart: string }) {
  const id = useId();
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    const render = async () => {
      const mermaid = await loadMermaid();
      mermaid.default.initialize({
        startOnLoad: false,
        theme: resolvedTheme === "dark" ? "dark" : "default",
      });

      const { svg } = await mermaid.default.render(
        `mermaid-${id.replace(/:/g, "")}`,
        chart
      );
      setSvg(svg);
    };

    render();
  }, [chart, id, resolvedTheme]);

  return (
    <div
      className="flex justify-center my-4"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: mermaid renders svg
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
