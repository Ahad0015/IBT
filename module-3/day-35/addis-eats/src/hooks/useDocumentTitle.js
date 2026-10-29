import { useEffect } from 'react'

// Gives each screen its own tab title, which also helps screen-reader users
// know where they are after a route change.
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Addis Eats` : 'Addis Eats'
  }, [title])
}
