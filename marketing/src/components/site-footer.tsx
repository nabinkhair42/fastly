export function SiteFooter() {
  return (
    <footer className="group-has-[.section-soft]/body:bg-surface/40 3xl:fixed:bg-transparent group-has-[.docs-nav]/body:pb-20 group-has-[.docs-nav]/body:sm:pb-0 dark:bg-transparent">
      <div className="container-wrapper px-4 xl:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="text-muted-foreground w-full px-1 text-center text-xs leading-loose sm:text-sm">
            Built by{" "}
            <a
              href="https://nabinkhair.com.com.np"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              nabinkhair
            </a>{" "}
            at{" "}
            <a
              href="https://github.com/codixra"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline text-amber-400 underline-offset-4"
            >
              Codixra
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/nabinkhair42/fastly"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </div>
        </div>
      </div>
    </footer>
  );
}
