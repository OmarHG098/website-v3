import { useEffect } from "react";
import { useEditModeOptional } from "@/contexts/EditModeContext";
import { subscribeToContentUpdates, ContentUpdatedPayload } from "@/lib/contentEvents";

type ContentType = "program" | "landing" | "location" | "page";

export function useContentAutoRefresh(
  contentType: ContentType | undefined,
  slug: string | undefined,
  locale: string | undefined,
  refetch: () => void
): void {
  const editMode = useEditModeOptional();

  useEffect(() => {
    if (!editMode?.isEditMode || !contentType || !slug || !locale) {
      return;
    }

    const unsubscribe = subscribeToContentUpdates((payload: ContentUpdatedPayload) => {
      if (payload.contentType === contentType && payload.slug === slug && payload.locale === locale) {
        refetch();
      }
    });

    return unsubscribe;
  }, [editMode?.isEditMode, contentType, slug, locale, refetch]);
}
