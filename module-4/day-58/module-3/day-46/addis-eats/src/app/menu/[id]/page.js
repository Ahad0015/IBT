import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dishes } from "../data";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return dishes.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = dishes.find((d) => d.id === id);

  if (!dish) {
    return { title: "Dish not found", robots: { index: false } };
  }

  const description = `${dish.summary} ${dish.price} ETB.`;

  return {
    title: dish.name,
    description,
    alternates: { canonical: `/menu/${dish.id}` },
    // A child's openGraph replaces the parent's completely, so repeat siteName and type.
    openGraph: {
      title: dish.name,
      description,
      url: `/menu/${dish.id}`,
      siteName: "Addis Eats",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: dish.name, description },
  };
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = dishes.find((d) => d.id === id);

  if (!dish) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.summary,
    image: `${siteUrl}${dish.image}`,
    offers: {
      "@type": "Offer",
      price: String(dish.price),
      priceCurrency: "ETB",
    },
    ...(dish.category === "Vegetarian" && {
      suitableForDiet: "https://schema.org/VegetarianDiet",
    }),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        // "<" is escaped so dish text can never close the script tag
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Image
        src={dish.image}
        alt={`${dish.name}, ${dish.category.toLowerCase()} at Addis Eats`}
        width={800}
        height={600}
        sizes="(min-width: 1024px) 480px, 100vw"
        className="w-full max-w-md h-auto rounded-lg mb-4"
      />
      <h1 className="text-2xl font-bold">{dish.name}</h1>
      <p className="text-stone-600 mb-2">{dish.category}</p>
      <p className="mb-2">{dish.summary}</p>
      <p className="font-bold mb-4">{dish.price} ETB</p>
      <Link href="/menu" className="underline">← Back to menu</Link>
    </main>
  );
}