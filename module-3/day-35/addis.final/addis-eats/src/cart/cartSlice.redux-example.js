// HOMEWORK (Day 32) - "Write it in Redux too".
// NOT used by the app: the real cart is cartStore.js (Zustand).
// Kept side by side so the two can be compared. To try it: npm i @reduxjs/toolkit
import { configureStore, createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    // Immer lets us write "mutation"; it produces a new immutable state.
    addItem: (state, action) => {
      const dish = action.payload;
      const existing = state.items.find((item) => item.id === dish.id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...dish, qty: 1 });
      }
    },
    remove: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clear: (state) => {
      state.items = [];
    },
  },
});

// createSlice generated these action creators for us.
export const { addItem, remove, clear } = cartSlice.actions;

// Same derived-value selectors as cartStore.js, but they receive the ROOT state,
// hence state.cart.items (the slice is mounted under the key "cart").
export const selectTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
export const selectCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.qty, 0);

export const store = configureStore({
  reducer: { cart: cartSlice.reducer },
});

/* Comparison with the Zustand store:
 *
 *   Zustand                          Redux Toolkit
 *   ------------------------------   ---------------------------------------
 *   create((set) => ({...}))         createSlice({ name, initialState, reducers })
 *   addItem(dish)                    dispatch(addItem(dish))   (+ useDispatch)
 *   useCartStore(selectCount)        useSelector(selectCount)
 *   import the store anywhere        <Provider store={store}> in main.jsx
 *   set(fn) returns NEW state        reducer "mutates" a draft (Immer)
 *   persist middleware               extra package (e.g. redux-persist)
 */
