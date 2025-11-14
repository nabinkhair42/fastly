import crypto from "node:crypto";
import { UserSessionModel } from "@/models/user-sessions";
import type { AuthMethod } from "@/types/user";
import type { NextRequest } from "next/server";
import { UAParser } from "ua-parser-js";

interface SessionMetadata {
  userAuthId: string;
  authMethod: AuthMethod;
  request: NextRequest;
}

const extractIpAddress = (request: NextRequest): string => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "Unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // @ts-expect-error - NextRequest.ip is available at runtime
  return (request.ip as string | undefined) ?? "Unknown";
};

export const createUserSession = async ({
  userAuthId,
  authMethod,
  request,
}: SessionMetadata) => {
  const userAgentString = request.headers.get("user-agent") ?? "Unknown";
  const parser = new UAParser(userAgentString);
  const parsed = parser.getResult();

  const sessionId = crypto.randomUUID();

  const session = await UserSessionModel.create({
    userAuth: userAuthId,
    sessionId,
    authMethod,
    userAgent: userAgentString,
    browser: parsed.browser?.name
      ? `${parsed.browser.name} ${parsed.browser.version ?? ""}`.trim()
      : "Unknown",
    os: parsed.os?.name
      ? `${parsed.os.name} ${parsed.os.version ?? ""}`.trim()
      : "Unknown",
    device:
      parsed.device?.model || parsed.device?.type
        ? [parsed.device?.vendor, parsed.device?.model ?? parsed.device?.type]
            .filter(Boolean)
            .join(" ")
        : "Unknown device",
    ipAddress: extractIpAddress(request),
  });

  return session;
};

export const markSessionRevoked = async (
  userAuthId: string,
  sessionId: string,
) => {
  await UserSessionModel.findOneAndUpdate(
    { userAuth: userAuthId, sessionId },
    { $set: { revokedAt: new Date() } },
  );
};

export const touchSession = async (userAuthId: string, sessionId: string) => {
  return UserSessionModel.findOneAndUpdate(
    { userAuth: userAuthId, sessionId, revokedAt: null },
    { $set: { lastActiveAt: new Date() } },
    { new: true },
  );
};
