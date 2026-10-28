// src/app/providers.js
"use client";

import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

export default function Providers({ children }) {
  const [items, setItems] = useState([]);
  const addItem = (dish) => setItems((prev) => [...prev, dish]);

  return (
    <CartContext.Provider value={{ items, addItem }}>
      {children}
    </CartContext.Provider>
  );
}