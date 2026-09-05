import { useEffect, useState } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      const category = new URL(url, window.location.origin).searchParams.get("c") || "All";
      const result = category === "All"
        ? DISHES
        : DISHES.filter((dish) => dish.category === category);

      if (!controller.signal.aborted) {
        setData(result);
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}

const DISHES = [
  { id: "d1", name: "Doro Wat", category: "Main", price: 240, tag: "Spicy" },
  { id: "d2", name: "Shiro", category: "Vegetarian", price: 120, tag: "Vegetarian" },
  { id: "d3", name: "Kitfo", category: "Main", price: 320, tag: "Spicy" },
  { id: "d4", name: "Tibs", category: "Main", price: 280, tag: "Spicy" },
  { id: "d5", name: "Injera Firfir", category: "Breakfast", price: 100, tag: "Spicy" },
  { id: "d6", name: "Beyaynetu", category: "Vegetarian", price: 150, tag: "Vegetarian" },
  { id: "d7", name: "Misir Wat", category: "Vegetarian", price: 110, tag: "Spicy" },
  { id: "d8", name: "Gomen", category: "Vegetarian", price: 90, tag: "Vegetarian" },
  { id: "d9", name: "Dulet", category: "Main", price: 220, tag: "Spicy" },
  { id: "d10", name: "Fasting Firfir", category: "Vegetarian", price: 130, tag: "Vegetarian" },
  { id: "d11", name: "Siga Tibs", category: "Main", price: 300, tag: "Spicy" },
  { id: "d12", name: "Atkilt Wat", category: "Vegetarian", price: 100, tag: "Vegetarian" },
];
