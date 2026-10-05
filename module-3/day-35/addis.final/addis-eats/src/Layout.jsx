import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./layout/Header";
import Nav from "./layout/Nav";
import Footer from "./layout/Footer";
import ErrorBoundary from "./ui/ErrorBoundary";
import Spinner from "./ui/Spinner";

// Rendered once by the parent route. Only <Outlet /> changes when you navigate,
// so the header, nav and footer are never rebuilt.
//
// ErrorBoundary wraps Suspense wraps Outlet:
//  - Suspense shows the spinner while a lazy route's code downloads;
//  - if that download (or any screen) throws, the boundary shows a message
//    INSIDE <main>, so the header and nav survive.
// key={pathname}: a new page remounts the boundary, which clears an old error.
function Layout() {
  const { pathname } = useLocation();

  return (
    <>
      <Header />
      <Nav />
      <main>
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<Spinner label="Loading…" />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}

export default Layout;
