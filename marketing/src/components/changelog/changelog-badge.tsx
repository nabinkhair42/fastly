import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

const changelogBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        new: "border-changelog-new/30 bg-changelog-new/10 text-changelog-new hover:bg-changelog-new/20 hover:border-changelog-new/50",
        improved:
          "border-changelog-improved/30 bg-changelog-improved/10 text-changelog-improved hover:bg-changelog-improved/20 hover:border-changelog-improved/50",
        fixed:
          "border-changelog-fixed/30 bg-changelog-fixed/10 text-changelog-fixed hover:bg-changelog-fixed/20 hover:border-changelog-fixed/50",
        version: "border-changelog-version/30 bg-changelog-version/10 text-changelog-version hover:bg-changelog-version/20 hover:border-changelog-version/50",
        outline: "border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
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
