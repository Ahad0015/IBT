import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Addis Eats",
  description: "Ethiopian food, ordered online.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="flex gap-4 bg-slate-900 p-4 text-white">
          <Link href="/">Home</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/checkout">Checkout</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}