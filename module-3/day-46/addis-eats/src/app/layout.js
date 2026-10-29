import "./globals.css";
import Link from "next/link";
import { Poppins } from "next/font/google";
import Providers from "./providers";
import AuthNav from "./AuthNav";
import GoogleAnalytics from "./GoogleAnalytics";
import { siteUrl } from "@/lib/site";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(siteUrl), // turns every relative URL below into an absolute one
  title: {
    default: "Addis Eats: Ethiopian food, delivered",
    template: "%s | Addis Eats", // a page titled "Menu" becomes "Menu | Addis Eats"
  },
  description:
    "Order Ethiopian favourites like doro wat, kitfo and shiro from Addis Eats, delivered fresh to your door.",
  openGraph: {
    siteName: "Addis Eats",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="min-h-screen flex flex-col bg-amber-50 text-stone-900">
        <Providers>
          <header className="bg-green-800 text-white px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">Addis Eats</Link>
            <nav className="flex items-center gap-6">
              <Link href="/menu" className="hover:underline">Menu</Link>
              <Link href="/cart" className="hover:underline">Cart</Link>
              <Link href="/orders" className="hover:underline">Orders</Link>
              <AuthNav />
            </nav>
          </header>

          <div className="flex-1 w-full max-w-5xl mx-auto p-6">{children}</div>

          <footer className="bg-stone-800 text-stone-300 text-center text-sm py-4">
            © Addis Eats
          </footer>
        </Providers>
        <GoogleAnalytics />
      </body>
    </html>
  );
}