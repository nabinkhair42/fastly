"use client";

import { useCallback, useState } from "react";

interface UseDialogStateOptions {
  defaultOpen?: boolean;
}

interface UseDialogStateReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  isOpen: () => boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
}

export function useDialogState(
  options: UseDialogStateOptions = {},
): UseDialogStateReturn {
  const { defaultOpen = false } = options;
  const [open, setOpen] = useState(defaultOpen);

  const isOpen = useCallback(() => open, [open]);
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  return {
    open,
    setOpen,
    isOpen,
    onOpen,
    onClose,
    toggle,
  };
}
