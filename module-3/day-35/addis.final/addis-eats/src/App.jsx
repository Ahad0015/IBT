import { lazy } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import RequireAuth from "./auth/RequireAuth";
import Login from "./auth/Login";
import Layout from "./Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Menu from "./menu/Menu";
import DishDetail from "./menu/DishDetail";
import CartPanel from "./cart/CartPanel";

// Day 34: Checkout is the one lazy route. It is the heaviest screen (form,
// validation, order API) and the least visited, so it leaves the first
// download. Layout supplies the <Suspense> fallback and the error boundary.
const Checkout = lazy(() => import("./checkout/Checkout"));

// Context carries only what genuinely belongs in it: the session and the
// theme - each in its own provider, because they change independently.
// The cart lives in cart/cartStore.js, outside the tree.
// Child paths are relative: no leading slash inside the parent.
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
              <Route path="menu/:id" element={<DishDetail />} />
              <Route path="cart" element={<CartPanel />} />
              <Route
                path="checkout"
                element={
                  <RequireAuth>
                    <Checkout />
                  </RequireAuth>
                }
              />
              <Route path="login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
