import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface TrackerConfig {
  project: string; // e.g., "m2creative-card"
}

export interface TrackEventPayload {
  event: string; // e.g., "whatsapp_click", "qr_scan"
  source?: string; // e.g., "qr_campaign_2026"
  metadata?: Record<string, any>;
}

/**
 * Sovereign Event Tracker
 * 
 * Replaces Google Analytics / Microsoft Clarity with a direct-to-Convex
 * sovereign event pipeline. Maintains absolute data ownership.
 */
export function useSovereignTracker(config: TrackerConfig) {
  const trackMutation = useMutation(api.deploymentIntelligence.trackEvent);

  const trackEvent = async (payload: TrackEventPayload) => {
    try {
      // Basic device/country inference could be expanded here 
      // via headers or Edge middleware in Next.js, but for now
      // we capture client-side info.
      const device = typeof navigator !== 'undefined' 
        ? /Mobile|Android|iP(ad|hone)/.test(navigator.userAgent) ? "Mobile" : "Desktop"
        : "Unknown";
      
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      await trackMutation({
        project: config.project,
        event: payload.event,
        source: payload.source,
        device: device,
        country: timeZone, // Approximate based on timezone, better handled in middleware
        metadata: payload.metadata,
      });

      console.log(`[SOVEREIGN TRACKER] Logged event: ${payload.event} for project: ${config.project}`);
    } catch (error) {
      console.error("[SOVEREIGN TRACKER] Failed to log event:", error);
    }
  };

  return { trackEvent };
}
