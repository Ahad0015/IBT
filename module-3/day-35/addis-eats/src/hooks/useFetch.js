import { useCallback, useEffect, useState } from 'react'

// Runs an async function and tracks its loading / error / data state
// (features 12 and 14). `reload()` re-runs it, which powers every Retry button.
// A stale response from an older call is ignored, so fast navigation can't
// overwrite newer data.
export function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let ignore = false
    setState((prev) => ({ ...prev, loading: true, error: null }))
    fetcher()
      .then((data) => {
        if (!ignore) setState({ data, loading: false, error: null })
      })
      .catch((error) => {
        if (!ignore) setState({ data: null, loading: false, error })
      })
    return () => {
      ignore = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  return { ...state, reload }
}
