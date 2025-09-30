import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const changelogBadgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        new: 'bg-changelog-new text-changelog-new-foreground hover:bg-changelog-new/80',
        improved:
          'border bg-changelog-improved text-changelog-improved-foreground hover:bg-changelog-improved/80',
        fixed:
          'bg-changelog-fixed text-changelog-fixed-foreground hover:bg-changelog-fixed/80',
        version: 'bg-primary text-primary-foreground hover:bg-primary/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'outline',
    },
  }
);

export interface ChangelogBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof changelogBadgeVariants> {}

function ChangelogBadge({ className, variant, ...props }: ChangelogBadgeProps) {
  return (
    <div
      className={cn(changelogBadgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { ChangelogBadge, changelogBadgeVariants };
