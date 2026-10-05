import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const STORAGE_KEY = "addis-eats-theme";

function readTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

// A value that almost never changes - exactly why it gets its own context:
// toggling the theme must not touch the cart, and adding a dish must not
// re-render theme consumers.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readTheme);

  // Layout effect: runs before paint, so there is no flash of the wrong theme.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // storage blocked: the theme still works for this session
    }
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((current) => (current === "dark" ? "light" : "dark")),
    []
  );

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
