"use client";

import { ActionDialog } from "@/components/ui/action-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useRevokeSession,
  useUserSessions,
} from "@/hooks/users/use-user-mutations";
import { cn } from "@/lib/utils";
import type { SessionData } from "@/types/api";
import { AuthMethod } from "@/types/user";
import { formatDistanceToNow } from "date-fns";
import { Monitor, ShieldCheck, XCircleIcon } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

const methodLabel: Record<AuthMethod, string> = {
  [AuthMethod.EMAIL]: "Email",
  [AuthMethod.GOOGLE]: "Google",
  [AuthMethod.FACEBOOK]: "Facebook",
  [AuthMethod.GITHUB]: "GitHub",
};

const SessionSkeleton = () => (
  <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
    <div className="flex flex-1 items-start gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-60" />
        <Skeleton className="h-3 w-44" />
      </div>
    </div>
    <Skeleton className="h-8 w-28" />
  </div>
);

const SessionRow = ({
  session,
  isCurrent,
  onRevoke,
  isRevoking,
}: {
  session: SessionData;
  isCurrent: boolean;
  onRevoke: () => void;
  isRevoking: boolean;
}) => {
  const deviceLabel = session.device || "Unknown device";
  const lastActive = formatDistanceToNow(new Date(session.lastActiveAt), {
    addSuffix: true,
  });

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-start gap-3">
        <div className="mt-1 rounded-md bg-muted p-2">
          {isCurrent ? (
            <ShieldCheck className="h-5 w-5" />
          ) : (
            <Monitor className="h-5 w-5" />
          )}
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium leading-none">
              {session.browser || "Unknown browser"}
            </p>
            <Badge variant={isCurrent ? "default" : "secondary"}>
              {isCurrent
                ? "This device"
                : (methodLabel[session.authMethod as AuthMethod] ?? "Session")}
            </Badge>
            {session.revokedAt && <Badge variant="destructive">Revoked</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">
            {deviceLabel} • {session.os || "Unknown OS"}
          </p>
          <p className="text-xs text-muted-foreground/80">
            IP {session.ipAddress || "Unknown"} • Last active {lastActive}
          </p>
        </div>
      </div>
      {!isCurrent && !session.revokedAt && (
        <Button
          variant="outline"
          className="w-full md:w-auto"
          onClick={onRevoke}
          disabled={isRevoking}
        >
          <XCircleIcon fill="red" className="text-white h-4 w-4" /> Revoke
        </Button>
      )}
    </div>
  );
};

export const ActiveSessions = () => {
  const { data, isLoading } = useUserSessions();
  const revokeSession = useRevokeSession();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState<SessionData | null>(
    null,
  );
  const scrollAreaId = useId();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentSessionId(localStorage.getItem("sessionId"));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const root = document.getElementById(scrollAreaId);
    if (!root) {
      return;
    }

    const viewport = root.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLElement | null;

    if (!viewport) {
      return;
    }

    const handleScroll = () => {
      setIsScrolled(viewport.scrollTop > 0);
    };

    handleScroll();
    viewport.addEventListener("scroll", handleScroll);

    return () => {
      viewport.removeEventListener("scroll", handleScroll);
    };
  }, [scrollAreaId]);

  const sessions = useMemo(() => data?.data.sessions ?? [], [data]);

  const isSessionBeingRevoked = (sessionId: string) =>
    revokeSession.isPending && sessionToRevoke?.sessionId === sessionId;

  const handleConfirmRevoke = () => {
    if (!sessionToRevoke) {
      return;
    }

    revokeSession.mutate(sessionToRevoke.sessionId, {
      onSettled: () => {
        setSessionToRevoke(null);
      },
    });
  };

  const handleCancelRevoke = () => {
    if (revokeSession.isPending) {
      return;
    }
    setSessionToRevoke(null);
  };

  const scrollMaskClass = isScrolled
    ? "[mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
    : "[mask-image:linear-gradient(to_bottom,black,black_88%,transparent)]";

  return (
    <>
      <ScrollArea
        id={scrollAreaId}
        className={cn("h-72 border-none shadow-none", scrollMaskClass)}
      >
        <CardContent className="space-y-3">
          {isLoading && (
            <div className="space-y-3">
              <SessionSkeleton />
              <SessionSkeleton />
            </div>
          )}

          {!isLoading && sessions.length === 0 && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No recent sessions found.
            </div>
          )}

          {!isLoading && sessions.length > 0 && (
            <div className="space-y-3">
              {sessions.map((session) => (
                <SessionRow
                  key={session.sessionId}
                  session={session}
                  isCurrent={session.sessionId === currentSessionId}
                  isRevoking={isSessionBeingRevoked(session.sessionId)}
                  onRevoke={() => setSessionToRevoke(session)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </ScrollArea>

      {sessionToRevoke ? (
        <ActionDialog
          title="Revoke this session?"
          description="Revoking will immediately sign this device out and require the user to log in again."
          confirmText="Revoke session"
          cancelText="Keep session"
          isActionDestructive={true}
          isLoading={revokeSession.isPending}
          loadingText="Revoking..."
          onConfirm={handleConfirmRevoke}
          onCancel={handleCancelRevoke}
        >
          <div className="px-6 pb-4 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Browser:</span>{" "}
              {sessionToRevoke.browser || "Unknown browser"}
            </p>
            <p>
              <span className="font-medium text-foreground">Device:</span>{" "}
              {sessionToRevoke.device || "Unknown device"}
            </p>
            <p>
              <span className="font-medium text-foreground">IP:</span>{" "}
              {sessionToRevoke.ipAddress || "Unknown"}
            </p>
            <p>
              <span className="font-medium text-foreground">Last active:</span>{" "}
              {formatDistanceToNow(new Date(sessionToRevoke.lastActiveAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </ActionDialog>
      ) : null}
    </>
  );
};
