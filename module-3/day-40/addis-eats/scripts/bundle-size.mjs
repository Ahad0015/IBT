// Approximate "First Load JS" per route for Next.js 16 (whose build table no longer prints sizes).
// Usage: npm run build && npm run size
// It adds the shared framework chunks to the client chunks each route's page references,
// and reports gzip size. Compare the /menu number before and after a change: if it jumps,
// a "use client" has spread further than you intended.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import zlib from "node:zlib";

const next = ".next";
if (!fs.existsSync(next)) {
  console.error("No .next folder. Run `npm run build` first.");
  process.exit(1);
}

const gz = (file) => {
  const p = path.join(next, file.replace(/^\/?_next\//, "").replace(/^\//, ""));
  return fs.existsSync(p) ? zlib.gzipSync(fs.readFileSync(p)).length : 0;
};
const norm = (f) => f.replace(/^\/?_next\//, "").replace(/^\//, "");

const build = JSON.parse(fs.readFileSync(path.join(next, "build-manifest.json"), "utf8"));
const shared = new Set([...(build.polyfillFiles ?? []), ...(build.rootMainFiles ?? [])].map(norm));
const sharedBytes = [...shared].reduce((n, f) => n + gz(f), 0);

const rows = [];
function walk(dir, rel = "") {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const sub = path.join(dir, entry.name);
    const route = path.posix.join(rel, entry.name);
    const manifest = path.join(sub, "page_client-reference-manifest.js");
    if (fs.existsSync(manifest)) {
      const ctx = { globalThis: {} };
      ctx.globalThis = ctx;
      vm.createContext(ctx);
      vm.runInContext(fs.readFileSync(manifest, "utf8"), ctx);
      for (const m of Object.values(ctx.__RSC_MANIFEST ?? {})) {
        const chunks = new Set();
        for (const mod of Object.values(m.clientModules ?? {})) (mod.chunks ?? []).forEach((c) => chunks.add(norm(c)));
        for (const list of Object.values(m.entryJSFiles ?? {})) list.forEach((c) => chunks.add(norm(c)));
        const own = [...chunks].filter((c) => c.endsWith(".js") && !shared.has(c));
        const ownBytes = own.reduce((n, f) => n + gz(f), 0);
        rows.push({ route: "/" + route.replace(/^\//, ""), kB: (sharedBytes + ownBytes) / 1024, own: ownBytes / 1024 });
      }
    }
    walk(sub, route);
  }
}
walk(path.join(next, "server", "app"));

// the root route lives at app/page_client-reference-manifest.js
const rootManifest = path.join(next, "server", "app", "page_client-reference-manifest.js");
if (fs.existsSync(rootManifest)) {
  const ctx = {}; ctx.globalThis = ctx; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(rootManifest, "utf8"), ctx);
  for (const m of Object.values(ctx.__RSC_MANIFEST ?? {})) {
    const chunks = new Set();
    for (const mod of Object.values(m.clientModules ?? {})) (mod.chunks ?? []).forEach((c) => chunks.add(norm(c)));
    for (const list of Object.values(m.entryJSFiles ?? {})) list.forEach((c) => chunks.add(norm(c)));
    const own = [...chunks].filter((c) => c.endsWith(".js") && !shared.has(c));
    const ownBytes = own.reduce((n, f) => n + gz(f), 0);
    rows.push({ route: "/", kB: (sharedBytes + ownBytes) / 1024, own: ownBytes / 1024 });
  }
}

const seen = new Set();
const unique = rows.filter((r) => !seen.has(r.route) && seen.add(r.route));
unique.sort((a, b) => a.route.localeCompare(b.route));

console.log(`Shared framework JS (gzip): ${(sharedBytes / 1024).toFixed(1)} kB\n`);
console.log("Route".padEnd(26) + "Own JS".padStart(10) + "First Load JS".padStart(16));
for (const r of unique) {
  console.log(r.route.padEnd(26) + `${r.own.toFixed(1)} kB`.padStart(10) + `${r.kB.toFixed(1)} kB`.padStart(16));
}
console.log("\n(gzip, approximate; use it to compare before and after, not as an absolute figure)");
