'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChatGPTIcon, ClaudeIcon, MarkdownIcon, V0Icon } from '@/components/icons';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

interface CopyPageDropdownProps {
  pageUrl: string;
  pageTitle: string;
}

export function CopyPageDropdown({ pageUrl, pageTitle }: CopyPageDropdownProps) {
  const getFullUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${pageUrl}`;
    }
    return pageUrl;
  };

  const getMarkdownUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${pageUrl}.md`;
    }
    return `${pageUrl}.md`;
  };

  const menuItems = [
    {
      icon: MarkdownIcon,
      label: 'View as Markdown',
      href: `${pageUrl}.md`,
      external: false,
    },
    {
      icon: V0Icon,
      label: 'Open in v0',
      href: `https://v0.dev/chat?q=${encodeURIComponent(`Help me build a UI component based on this documentation: ${getMarkdownUrl()}\n\nTitle: ${pageTitle}`)}`,
      external: true,
    },
    {
      icon: ChatGPTIcon,
      label: 'Open in ChatGPT',
      href: `https://chatgpt.com/?q=${encodeURIComponent(`Help me understand this documentation: ${getMarkdownUrl()}\n\nTitle: ${pageTitle}`)}`,
      external: true,
    },
    {
      icon: ClaudeIcon,
      label: 'Open in Claude',
      href: `https://claude.ai/new?q=${encodeURIComponent(`Help me understand this documentation: ${getMarkdownUrl()}\n\nTitle: ${pageTitle}`)}`,
      external: true,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="px-2">
          Copy Page
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {menuItems.map(item => (
          <DropdownMenuItem key={item.label} asChild>
            <a
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-2"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
