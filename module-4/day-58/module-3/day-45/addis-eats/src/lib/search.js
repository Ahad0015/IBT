// Shared by the server (to seed the first page) and the client (to build the same key).
export const SEARCH_PAGE_SIZE = 2;

// The same shape /api/dishes returns, so the client can use it as SWR's fallbackData.
export function firstPage(dishes) {
  return {
    items: dishes.slice(0, SEARCH_PAGE_SIZE),
    page: 1,
    limit: SEARCH_PAGE_SIZE,
    total: dishes.length,
    totalPages: Math.max(1, Math.ceil(dishes.length / SEARCH_PAGE_SIZE)),
  };
}
