type ContentType = "program" | "landing" | "location" | "page";

export interface ContentUpdatedPayload {
  contentType: ContentType;
  slug: string;
  locale: string;
}

type ContentEventListener = (payload: ContentUpdatedPayload) => void;

const listeners = new Set<ContentEventListener>();

export function emitContentUpdated(payload: ContentUpdatedPayload): void {
  listeners.forEach(listener => {
    try {
      listener(payload);
    } catch (error) {
      console.error("[contentEvents] Listener error:", error);
    }
  });
}

export function subscribeToContentUpdates(listener: ContentEventListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
