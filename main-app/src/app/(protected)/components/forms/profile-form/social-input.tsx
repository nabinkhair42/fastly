"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

export const SOCIAL_PLATFORMS = {
  website: {
    label: "Website",
    icon: FaGlobe,
    placeholder: "https://yourwebsite.com",
  },
  github: {
    label: "GitHub",
    icon: FaGithub,
    placeholder: "https://github.com/username",
  },
  twitter: {
    label: "Twitter",
    icon: FaXTwitter,
    placeholder: "https://twitter.com/username",
  },
  linkedin: {
    label: "LinkedIn",
    icon: FaLinkedin,
    placeholder: "https://linkedin.com/in/username",
  },
  instagram: {
    label: "Instagram",
    icon: FaInstagram,
    placeholder: "https://instagram.com/username",
  },
  facebook: {
    label: "Facebook",
    icon: FaFacebook,
    placeholder: "https://facebook.com/username",
  },
  youtube: {
    label: "YouTube",
    icon: FaYoutube,
    placeholder: "https://youtube.com/@username",
  },
  tiktok: {
    label: "TikTok",
    icon: FaTiktok,
    placeholder: "https://tiktok.com/@username",
  },
  discord: {
    label: "Discord",
    icon: FaDiscord,
    placeholder: "https://discord.gg/server",
  },
  other: { label: "Other", icon: FaGlobe, placeholder: "https://example.com" },
} as const;

interface SocialInputProps {
  provider: string;
  url: string;
  onProviderChange: (provider: string) => void;
  onUrlChange: (url: string) => void;
  placeholder?: string;
}

export function SocialInput({
  provider,
  url,
  onProviderChange,
  onUrlChange,
  placeholder = "https://example.com",
}: SocialInputProps) {
  const [open, setOpen] = useState(false);
  const selectedPlatform =
    SOCIAL_PLATFORMS[provider as keyof typeof SOCIAL_PLATFORMS];
  const Icon = selectedPlatform?.icon || FaGlobe;
  const dynamicPlaceholder = selectedPlatform?.placeholder || placeholder;

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild={true}>
          <Button
            type="button"
            variant="outline"
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex w-full items-center justify-between gap-3 sm:w-48"
          >
            <span className="flex flex-1 items-center gap-2 truncate">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="truncate text-sm">
                {selectedPlatform?.label ?? "Select platform"}
              </span>
            </span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[260px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search platforms..." className="h-9" />
            <CommandEmpty>No platform found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="max-h-60">
                <div className="py-1">
                  {Object.entries(SOCIAL_PLATFORMS).map(
                    ([key, { icon: PlatformIcon, label }]) => {
                      const isSelected = provider === key;
                      return (
                        <CommandItem
                          key={key}
                          value={`${label} ${key}`}
                          onSelect={() => {
                            onProviderChange(key);
                            setOpen(false);
                          }}
                        >
                          <PlatformIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="flex-1 text-sm">{label}</span>
                          {isSelected && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </CommandItem>
                      );
                    },
                  )}
                </div>
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder={dynamicPlaceholder}
        className="sm:flex-1"
      />
    </div>
  );
}
