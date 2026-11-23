import { createContext, useCallback, useMemo, useReducer } from "react";
import { cartReducer, initialCartState } from "./cartReducer.js";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const addItem = useCallback((dish) => {
    dispatch({
      type: "add",
      dish: { ...dish, cartId: crypto.randomUUID() },
    });
  }, []);

  const removeItem = useCallback((cartId) => {
    dispatch({ type: "remove", cartId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const total = useMemo(
    () => state.items.reduce((sum, dish) => sum + dish.price, 0),
    [state.items]
  );

  const value = useMemo(
    () => ({
      items: state.items,
      total,
      addItem,
      removeItem,
      clearCart,
    }),
    [state.items, total, addItem, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
