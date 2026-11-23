// app/menu/[id]/not-found.js
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h2>We couldn't find that dish.</h2>
      <Link href="/menu">Back to menu</Link>
    </main>
  );
}