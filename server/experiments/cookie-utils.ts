import type { Request, Response } from "express";
import type { ExperimentAssignment, ExperimentCookie, VisitorContext } from "@shared/schema";
import { experimentCookieSchema } from "@shared/schema";

const COOKIE_NAME = "4g_experiments";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Generate a simple session ID if none exists
 */
export function getOrCreateSessionId(req: Request, res: Response): string {
  const existing = req.cookies?.["4g_session_id"];
  if (existing) return existing;

  const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  res.cookie("4g_session_id", sessionId, {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
  });
  return sessionId;
}

/**
 * Parse experiment cookie from request
 */
export function getExperimentCookie(req: Request): ExperimentCookie | null {
  try {
    const cookieValue = req.cookies?.[COOKIE_NAME];
    if (!cookieValue) return null;

    const decoded = Buffer.from(cookieValue, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);
    return experimentCookieSchema.parse(parsed);
  } catch {
    return null;
  }
}

/**
 * Set experiment cookie on response
 */
export function setExperimentCookie(
  res: Response,
  sessionId: string,
  assignments: ExperimentAssignment[]
): void {
  const cookie: ExperimentCookie = {
    session_id: sessionId,
    assignments,
  };

  const encoded = Buffer.from(JSON.stringify(cookie)).toString("base64");

  res.cookie(COOKIE_NAME, encoded, {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
  });
}

/**
 * Build visitor context from request
 */
export function buildVisitorContext(req: Request, sessionId: string): VisitorContext {
  const ua = req.headers["user-agent"] || "";
  const isMobile = /mobile|android|iphone|ipad/i.test(ua);
  const isTablet = /tablet|ipad/i.test(ua);

  const now = new Date();

  // Use locale param (consistent with routes) or lang, fallback to en
  const language = (req.query.locale as string) || (req.query.lang as string) || "en";

  return {
    session_id: sessionId,
    language,
    region: req.query.region as string,
    country: req.query.country as string,
    utm_source: req.query.utm_source as string,
    utm_campaign: req.query.utm_campaign as string,
    utm_medium: req.query.utm_medium as string,
    device: isTablet ? "tablet" : isMobile ? "mobile" : "desktop",
    hour: now.getHours(),
    day_of_week: now.getDay(),
  };
}
