import CartView from "./CartView";

export default function CartPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Your cart</h1>
      <CartView />
    </main>
  );
}