import { ChangelogBadge } from '@/components/changelog/changelog-badge';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Bug, CalendarDays, Package, Sparkles, Zap } from 'lucide-react';
import Image from 'next/image';

export type ChangelogEntryType =
  | 'new'
  | 'improved'
  | 'fixed'
  | 'version'
  | 'outline';

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  type: ChangelogEntryType;
  changes: {
    type: 'new' | 'improved' | 'fixed';
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
  new: 'New',
  improved: 'Improved',
  fixed: 'Fixed',
};

const entryTypeIcons: Record<ChangelogEntryType, typeof Sparkles> = {
  new: Sparkles,
  improved: Zap,
  fixed: Bug,
  version: Package,
  outline: Package,
};

const entryTypeLabels: Record<ChangelogEntryType, string> = {
  new: 'Feature release',
  improved: 'Enhancement',
  fixed: 'Patch release',
  version: 'Stable release',
  outline: 'Announcement',
};

export function Changelog({ entries, className }: ChangelogProps) {
  return (
    <div className={cn('w-full max-w-5xl mx-auto px-4', className)}>
      {/* Header */}
      <section className="mb-16 space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Release notes
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Changelog
          </h1>
        </div>
        <p className="text-lg text-muted-foreground sm:text-xl">
          Keep track of all the latest updates, improvements, and bug fixes to
          our platform.
        </p>
        <div className="flex  gap-3 text-muted-foreground">
          <Badge variant={'outline'} className="rounded-full">
            {entries.length} {entries.length === 1 ? 'release' : 'releases'}
          </Badge>
          <Badge variant={'outline'} className="rounded-full">
            Updated {entries[0]?.date ?? 'recently'}
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
              acc[change.type]!.push(change.description);
              return acc;
            },
            {} as Record<ChangelogEntry['changes'][number]['type'], string[]>
          );

          const EntryTypeIcon = entryTypeIcons[entry.type];
          const entryTypeLabel = entryTypeLabels[entry.type];

          return (
            <article key={`${entry.version}-${index}`} className="">
              <div className="flex flex-col md:flex-row gap-6">
                {/* version number and title */}
                <aside className="md:sticky md:top-28 md:w-60">
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
                    <h2 className="text-lg font-semibold leading-snug text-foreground">
                      {entry.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      {entry.date}
                    </div>
                  </div>
                </aside>

                {/* version details */}

                <section className="flex-1 space-y-6 max-w-xl">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {entry.description}
                  </p>

                  {entry.image && (
                    <div className="overflow-hidden rounded border border-border/60 bg-muted">
                      <Image
                        src={entry.image}
                        alt={entry.title}
                        width={1280}
                        height={720}
                        className="h-80 aspect-video object-fit"
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
                                variant={type as 'new' | 'improved' | 'fixed'}
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
                                  className="flex items-start gap-3"
                                >
                                  <span className="mt-2 h-px w-6 flex-shrink-0 bg-border/70" />
                                  <span className="text-foreground">
                                    {description}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </section>
                        );
                      }
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
