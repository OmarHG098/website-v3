import { queryClient } from "./queryClient";

type ContentType = "program" | "landing" | "location" | "page";

/**
 * Get the API path for a content type
 */
function getApiPath(contentType: ContentType): string {
  switch (contentType) {
    case "program":
      return "/api/career-programs";
    case "landing":
      return "/api/landings";
    case "location":
      return "/api/locations";
    case "page":
      return "/api/pages";
  }
}

/**
 * Invalidate React Query cache for a specific content item.
 * This will trigger a refetch of the data, causing the page to update.
 * Uses predicate matching to catch all related queries regardless of extra params.
 */
export async function invalidateContent(
  contentType: ContentType,
  slug: string,
  locale?: string
): Promise<void> {
  const apiPath = getApiPath(contentType);
  
  // Use predicate to match any query that starts with this path and includes the slug
  await queryClient.invalidateQueries({ 
    predicate: (query) => {
      const key = query.queryKey;
      if (!Array.isArray(key) || key.length < 2) return false;
      
      // Match queries that start with the API path and include the slug
      return key[0] === apiPath && key[1] === slug;
    }
  });
}

/**
 * Refetch content immediately after invalidation.
 * Use this when you need the data to update synchronously.
 */
export async function refetchContent(
  contentType: ContentType,
  slug: string,
  _locale?: string
): Promise<void> {
  const apiPath = getApiPath(contentType);
  
  // Refetch any matching queries
  await queryClient.refetchQueries({ 
    predicate: (query) => {
      const key = query.queryKey;
      if (!Array.isArray(key) || key.length < 2) return false;
      return key[0] === apiPath && key[1] === slug;
    }
  });
}

/**
 * Combined invalidate and refetch for immediate updates.
 * This is the recommended method for all edit operations.
 */
export async function refreshContent(
  contentType: ContentType,
  slug: string,
  locale?: string
): Promise<void> {
  const apiPath = getApiPath(contentType);
  
  // Log cache state before invalidation
  const cache = queryClient.getQueryCache();
  const allQueries = cache.getAll();
  const matchingBefore = allQueries.filter(q => {
    const key = q.queryKey;
    return Array.isArray(key) && key.length >= 2 && key[0] === apiPath && key[1] === slug;
  });
  console.log(`[refreshContent] Before invalidation - Found ${matchingBefore.length} matching queries:`, 
    matchingBefore.map(q => ({ key: q.queryKey, state: q.state.status })));
  
  await invalidateContent(contentType, slug, locale);
  console.log(`[refreshContent] After invalidation, now refetching...`);
  
  await refetchContent(contentType, slug, locale);
  console.log(`[refreshContent] Refetch complete`);
}
