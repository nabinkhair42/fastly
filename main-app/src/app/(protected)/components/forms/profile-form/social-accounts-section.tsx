"use client";

import { Button } from "@/components/ui/button";
import { FormDescription, FormLabel } from "@/components/ui/form";
import { Trash2 } from "lucide-react";
import type { FieldArrayWithId, UseFormReturn } from "react-hook-form";
import { SocialInput } from "./social-input";

interface SocialAccount {
  provider: string;
  url: string;
}

interface SocialAccountsSectionProps {
  form: UseFormReturn<any>;
  fields: FieldArrayWithId<any, "socialAccounts", "id">[];
  append: (value: SocialAccount) => void;
  remove: (index: number) => void;
}

export function SocialAccountsSection({
  form,
  fields,
  append,
  remove,
}: SocialAccountsSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <FormLabel>Social Accounts</FormLabel>
        <FormDescription>
          Add links to your website, blog, or social media profiles.
        </FormDescription>
      </div>
      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">
          You haven&apos;t added any accounts yet.
        </p>
      )}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <SocialInput
            provider={
              form.watch(`socialAccounts.${index}.provider`) || "website"
            }
            url={form.watch(`socialAccounts.${index}.url`) || ""}
            onProviderChange={(provider) => {
              form.setValue(`socialAccounts.${index}.provider`, provider, {
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
            onUrlChange={(url) => {
              form.setValue(`socialAccounts.${index}.url`, url, {
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => remove(index)}
            className="h-9 w-9 self-start sm:self-auto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ provider: "website", url: "" })}
      >
        Add Social Account
      </Button>
    </div>
  );
}
