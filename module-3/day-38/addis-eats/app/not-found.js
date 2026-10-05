import Link from "next/link";

export default function NotFound() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">404: Not found</h1>
      <p className="mt-2">We could not find what you were looking for.</p>
      <Link href="/menu" className="mt-4 inline-block text-blue-600 underline">
        Back to the menu
      </Link>
    </main>
  );
}