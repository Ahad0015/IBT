export const initialState = {
  items: [],
};

export function cartReducer(state, action) {
  switch (action.type) {
    case "add":
      return { ...state, items: [...state.items, action.dish] };
    case "remove":
      return {
        ...state,
        items: state.items.filter((item) => item.cartId !== action.cartId),
      };
    case "clear":
      return { items: [] };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
