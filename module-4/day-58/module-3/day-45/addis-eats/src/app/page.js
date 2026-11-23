import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: { absolute: "Addis Eats: Ethiopian food, delivered" },
  description:
    "Order doro wat, kitfo, shiro and more from Addis Eats. Fresh Ethiopian food, delivered to your door.",
};

export default function Home() {
  return (
    <main className="text-center">
      {/* hero.jpg is a square 1254x1254 file. A fixed 16:9 box with object-cover crops it
          instead of stretching it, and the box reserves the space so there is no layout shift. */}
      <div className="relative w-full aspect-[16/9] mb-8 overflow-hidden rounded-lg">
        <Image
          src="/images/hero.jpg"
          alt="A table of Ethiopian dishes"
          fill
          sizes="(min-width: 1024px) 976px, 100vw"
          preload
          className="object-cover"
        />
      </div>
      <h1 className="text-4xl font-bold mb-4">Welcome to Addis Eats</h1>
      <p className="mb-8 text-stone-600">Ethiopian food, delivered.</p>
      <Link
        href="/menu"
        className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800"
      >
        See the menu
      </Link>
    </main>
  );
}