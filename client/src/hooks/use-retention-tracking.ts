import { useEffect, useRef } from "react";

function generateSessionId(): string {
  const stored = sessionStorage.getItem("retention_session_id");
  if (stored) return stored;
  const id = crypto.randomUUID();
  sessionStorage.setItem("retention_session_id", id);
  return id;
}

function getEmailId(): number | undefined {
  const stored = sessionStorage.getItem("retention_email_id");
  return stored ? parseInt(stored, 10) : undefined;
}

function getUtmParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  const source = params.get("utm_source");
  const medium = params.get("utm_medium");
  const campaign = params.get("utm_campaign");
  if (source) utm.utmSource = source;
  if (medium) utm.utmMedium = medium;
  if (campaign) utm.utmCampaign = campaign;
  return utm;
}

function getReferrer(): string | undefined {
  const ref = document.referrer;
  if (!ref) return undefined;
  try {
    const refHost = new URL(ref).hostname;
    if (refHost === window.location.hostname) return undefined;
    return ref;
  } catch {
    return undefined;
  }
}

export function setRetentionEmailId(emailId: number) {
  sessionStorage.setItem("retention_email_id", String(emailId));
}

export function useRetentionTracking(page: string = "/") {
  const startTime = useRef(Date.now());
  const sent = useRef(false);
  const maxScroll = useRef(0);

  useEffect(() => {
    startTime.current = Date.now();
    sent.current = false;
    maxScroll.current = 0;

    const sessionId = generateSessionId();
    const utmParams = getUtmParams();
    const referrer = getReferrer();

    function handleScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight <= 0) return;
      const percent = Math.round((scrollTop / docHeight) * 100);
      if (percent > maxScroll.current) {
        maxScroll.current = percent;
      }
    }

    function sendDuration() {
      if (sent.current) return;
      sent.current = true;

      const durationSeconds = Math.round(
        (Date.now() - startTime.current) / 1000
      );
      if (durationSeconds < 1) return;

      const emailId = getEmailId();
      const payload: Record<string, unknown> = {
        sessionId,
        page,
        durationSeconds,
        maxScrollPercent: maxScroll.current,
        ...utmParams,
      };
      if (emailId) payload.emailId = emailId;
      if (referrer) payload.referrer = referrer;

      const body = JSON.stringify(payload);

      // Use sendBeacon for reliability on page unload
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/retention/track", blob);
      } else {
        fetch("/api/retention/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        });
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        sendDuration();
      } else {
        // Reset when user comes back
        startTime.current = Date.now();
        sent.current = false;
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", sendDuration);

    return () => {
      sendDuration();
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", sendDuration);
    };
  }, [page]);
}
