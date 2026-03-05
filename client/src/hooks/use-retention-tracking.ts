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

export function setRetentionEmailId(emailId: number) {
  sessionStorage.setItem("retention_email_id", String(emailId));
}

export function useRetentionTracking(page: string = "/") {
  const startTime = useRef(Date.now());
  const sent = useRef(false);

  useEffect(() => {
    startTime.current = Date.now();
    sent.current = false;

    const sessionId = generateSessionId();

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
      };
      if (emailId) payload.emailId = emailId;

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

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", sendDuration);

    return () => {
      sendDuration();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", sendDuration);
    };
  }, [page]);
}
