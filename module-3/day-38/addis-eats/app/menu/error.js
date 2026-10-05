"use client";

export default function MenuError({ error, reset }) {
  return (
    <main className="p-6">
      <div className="rounded border border-red-300 bg-red-50 p-4">
        <h2 className="font-bold text-red-700">Something went wrong</h2>
        <p className="mt-1 text-sm">{error.message}</p>
        <button
          onClick={() => reset()}
          className="mt-3 rounded bg-red-600 px-3 py-1 text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}