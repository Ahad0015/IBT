import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Welcome to Addis Eats</h1>
      <p className="mt-2">Traditional Ethiopian food, made fresh daily.</p>
      <Link href="/menu" className="mt-4 inline-block text-blue-600 underline">
        See the menu
      </Link>
    </main>
  );
}