import Link from "next/link";
import CartCount from "./CartCount";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white">
      <Link href="/" className="text-xl font-bold">Addis Eats</Link>
      <nav className="flex gap-4">
        <Link href="/menu">Menu</Link>
        <Link href="/cart">
          Cart <CartCount />
        </Link>
        <Link href="/checkout">Checkout</Link>
      </nav>
    </header>
  );
}