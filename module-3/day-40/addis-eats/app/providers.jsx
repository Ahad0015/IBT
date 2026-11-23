"use client";

import { createContext, useContext, useReducer } from "react";

const CartContext = createContext(null);

function cartReducer(items, action) {
  switch (action.type) {
    case "add": {
      const existing = items.find((i) => i.id === action.dish.id);
      if (existing) {
        return items.map((i) =>
          i.id === action.dish.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...items, { ...action.dish, qty: 1 }];
    }
    case "remove":
      return items.filter((i) => i.id !== action.id);
    case "clear":
      return [];
    default:
      return items;
  }
}

export function Providers({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  return (
    <CartContext.Provider value={{ items, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <Providers>");
  return ctx;
}