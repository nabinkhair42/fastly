'use client';

import { cn } from '@/lib/utils';
import { Bug, Check, Link2, Package, Plus, Zap } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export type ChangelogEntryType = 'new' | 'improved' | 'fixed' | 'version' | 'outline';

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
  new: Plus,
  improved: Zap,
  fixed: Bug,
};

const changeTypeLabels = {
  new: 'Added',
  improved: 'Improved',
  fixed: 'Fixed',
};

const entryTypeIcons: Record<ChangelogEntryType, typeof Plus> = {
  new: Plus,
  improved: Zap,
  fixed: Bug,
  version: Package,
  outline: Package,
};

const entryTypeLabels: Record<ChangelogEntryType, string> = {
  new: 'Feature',
  improved: 'Enhancement',
  fixed: 'Patch',
  version: 'Release',
  outline: 'Update',
};

const entryTypeColors: Record<ChangelogEntryType, string> = {
  new: 'bg-emerald-500',
  improved: 'bg-amber-500',
  fixed: 'bg-rose-500',
  version: 'bg-blue-500',
  outline: 'bg-muted-foreground',
};

// Copy link button component
function CopyLinkButton({ version }: { version: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}${window.location.pathname}#${version}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
      title="Copy link to version"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
    </button>
  );
}

// Timeline dot component - simplified to just a colored dot
function TimelineDot({ type, isFirst }: { type: ChangelogEntryType; isFirst: boolean }) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Connecting line above */}
      {!isFirst && <div className="absolute bottom-full w-px h-10 bg-border" />}
      {/* Simple dot */}
      <div
        className={cn(
          'relative z-10 w-3 h-3 rounded-full border-2 border-background shadow-sm',
          entryTypeColors[type]
        )}
      />
    </div>
  );
}

// Entry card component
function EntryCard({ entry, isFirst }: { entry: ChangelogEntry; isFirst: boolean }) {
  const groupedChanges = entry.changes.reduce(
    (acc, change) => {
      if (!acc[change.type]) {
        acc[change.type] = [];
      }
      acc[change.type]?.push(change.description);
      return acc;
    },
    {} as Record<ChangelogEntry['changes'][number]['type'], string[]>
  );

  return (
    <article id={entry.version} className="group relative scroll-mt-24">
      <div className="flex gap-6 md:gap-8">
        {/* Timeline column - hidden on mobile */}
        <div className="hidden md:flex flex-col items-center pt-2">
          <TimelineDot type={entry.type} isFirst={isFirst} />
          {/* Connecting line below */}
          <div className="w-px flex-1 bg-border" />
        </div>

        {/* Content column */}
        <div className="flex-1 pb-12">
          {/* Sticky header for scroll context */}
          <div className="sticky top-14 z-10 bg-background/95 backdrop-blur-sm -mx-4 px-4 py-2 -mt-2 mb-1 border-b border-transparent [&:not(:first-child)]:border-border/50">
            {/* Header row: version + type + date + copy */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="font-mono font-semibold text-foreground">{entry.version}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{entryTypeLabels[entry.type]}</span>
              <span className="text-muted-foreground">·</span>
              <time className="text-muted-foreground">{entry.date}</time>
              <CopyLinkButton version={entry.version} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3 tracking-tight mt-2">
            {entry.title}
          </h2>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">
            {entry.description}
          </p>

          {/* Image */}
          {entry.image && (
            <div className="mb-6 rounded-lg overflow-hidden border border-border bg-muted/30">
              <div className="relative aspect-video">
                <Image src={entry.image} alt={entry.title} fill className="object-cover" />
              </div>
            </div>
          )}

          {/* Changes - simple list format */}
          <div className="space-y-6">
            {Object.entries(groupedChanges).map(([type, descriptions]) => {
              const TypeIcon = changeTypeIcons[type as keyof typeof changeTypeIcons];
              return (
                <div key={type}>
                  <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                    <TypeIcon className="h-4 w-4" />
                    {changeTypeLabels[type as keyof typeof changeTypeLabels]}
                  </h3>
                  <ul className="space-y-2 pl-6">
                    {descriptions.map((description, idx) => (
                      <li
                        key={`${type}-${idx}`}
                        className="text-foreground leading-relaxed list-disc marker:text-muted-foreground"
                      >
                        {description}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}

export function Changelog({ entries, className }: ChangelogProps) {
  return (
    <div className={cn('w-full max-w-5xl mx-auto px-4 xl:px-0', className)}>
      {/* Header */}
      <header className="mb-12">
        <p className="text-sm text-muted-foreground mb-2">Release notes</p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
          Changelog
        </h1>
        <p className="text-muted-foreground max-w-xl">
          Keep track of all the latest updates, improvements, and bug fixes.
        </p>
      </header>

      {/* Timeline */}
      <div className="relative">
        {entries.map((entry, index) => (
          <EntryCard key={`${entry.version}-${index}`} entry={entry} isFirst={index === 0} />
        ))}
      </div>
    </div>
  );
}
