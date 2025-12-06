import { ChangelogBadge } from "@/components/changelog/changelog-badge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Bug, CalendarDays, Package, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import { GoDotFill } from "react-icons/go";

export type ChangelogEntryType =
  | "new"
  | "improved"
  | "fixed"
  | "version"
  | "outline";

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  type: ChangelogEntryType;
  changes: {
    type: "new" | "improved" | "fixed";
    description: string;
  }[];
  image?: string;
}

export interface ChangelogProps {
  entries: ChangelogEntry[];
  className?: string;
}

const changeTypeIcons = {
  new: Sparkles,
  improved: Zap,
  fixed: Bug,
};

const changeTypeLabels = {
  new: "New",
  improved: "Improved",
  fixed: "Fixed",
};

const entryTypeIcons: Record<ChangelogEntryType, typeof Sparkles> = {
  new: Sparkles,
  improved: Zap,
  fixed: Bug,
  version: Package,
  outline: Package,
};

const entryTypeLabels: Record<ChangelogEntryType, string> = {
  new: "Feature release",
  improved: "Enhancement",
  fixed: "Patch release",
  version: "Stable release",
  outline: "Announcement",
};

export function Changelog({ entries, className }: ChangelogProps) {
  return (
    <div className={cn("w-full max-w-5xl mx-auto px-4 xl:px-0", className)}>
      {/* Header */}
      <section className="mb-16 space-y-3">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Release notes</p>
          <h1 className="text-4xl font-medium text-foreground"># Changelog</h1>
          <p className="text-muted-foreground">
            Keep track of all the latest updates, improvements, and bug fixes to
            our platform.
          </p>
        </div>
        <div className="flex  gap-3 text-muted-foreground">
          <Badge variant={"outline"}>
            Updated {entries[0]?.date ?? "recently"}
          </Badge>
        </div>
      </section>

      {/* Timeline */}
      <div className="space-y-20">
        {entries.map((entry, index) => {
          const groupedChanges = entry.changes.reduce(
            (acc, change) => {
              if (!acc[change.type]) {
                acc[change.type] = [];
              }
              acc[change.type]?.push(change.description);
              return acc;
            },
            {} as Record<ChangelogEntry["changes"][number]["type"], string[]>,
          );

          const EntryTypeIcon = entryTypeIcons[entry.type];
          const entryTypeLabel = entryTypeLabels[entry.type];

          return (
            <article key={`${entry.version}-${index}`}>
              <div className="flex flex-col md:flex-row gap-6 ">
                {/* version number and title */}
                <aside className="sticky top-28 md:w-60">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <ChangelogBadge
                        variant={entry.type}
                        className="flex items-center gap-1 text-xs sm:text-sm"
                      >
                        <EntryTypeIcon className="h-3.5 w-3.5" />
                        {entryTypeLabel}
                      </ChangelogBadge>
                      <Badge
                        variant="outline"
                        className="rounded-full text-xs sm:text-sm"
                      >
                        {entry.version}
                      </Badge>
                    </div>
                    <h2 className="text-lg font-medium leading-snug text-foreground">
                      {entry.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      {entry.date}
                    </div>
                  </div>
                </aside>

                {/* version details */}

                <section className="flex-1 space-y-6">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {entry.description}
                  </p>

                  {entry.image && (
                    <div className="overflow-hidden bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)] rounded-md border bg-muted">
                      <Image
                        src={entry.image}
                        alt={entry.title}
                        width={1280}
                        height={720}
                        className="aspect-video object-fit"
                      />
                    </div>
                  )}

                  <div className="space-y-6">
                    {Object.entries(groupedChanges).map(
                      ([type, descriptions]) => {
                        const Icon =
                          changeTypeIcons[type as keyof typeof changeTypeIcons];

                        return (
                          <section key={type} className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                              <ChangelogBadge
                                variant={type as "new" | "improved" | "fixed"}
                                className="flex items-center gap-1 text-xs sm:text-sm"
                              >
                                <Icon className="h-3.5 w-3.5" />
                                {
                                  changeTypeLabels[
                                    type as keyof typeof changeTypeLabels
                                  ]
                                }
                              </ChangelogBadge>
                            </div>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {descriptions.map((description, idx) => (
                                <li
                                  key={`${type}-${idx}`}
                                  className="flex gap-3 items-center"
                                >
                                  <GoDotFill />
                                  <span className="text-foreground">
                                    {description}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </section>
                        );
                      },
                    )}
                  </div>
                </section>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
