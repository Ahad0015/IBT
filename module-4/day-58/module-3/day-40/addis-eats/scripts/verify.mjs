// Day 40: mechanical verification. Nothing here is argued, everything is checked.
//
//   npm run build
//   npm run start          (in another terminal; add ENABLE_TEST_ROUTES=1 for the failure hooks)
//   npm run verify         (BASE=http://localhost:3000 by default)
//
// 1. Directives   every "use client" file, none on a page/layout/route, each one documented
// 2. Strategy     STRATEGY.md markers vs what the production build actually produced
// 3. Secrets      nothing sensitive in the files the browser downloads (.next/static)
// 4. Endpoints    status codes and the one error shape, with real requests
// 5. No-JS        the checkout server action works without JavaScript
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE ?? "http://localhost:3000";
let failures = 0;
const line = (ok, name, detail = "") => {
  if (!ok) failures++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};
const section = (t) => console.log(`\n== ${t}`);

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "node_modules") yield* walk(p); }
    else yield p;
  }
}

// ---------------------------------------------------------------- 1. directives
section("1. Client boundary (search for the directive)");
const clientFiles = [];
for (const root of ["app", "components", "lib"]) {
  for (const f of walk(root)) {
    if (!/\.(js|jsx)$/.test(f)) continue;
    const head = fs.readFileSync(f, "utf8").replace(/^\s*(\/\/.*\n|\/\*[\s\S]*?\*\/\s*)*/, "").trimStart();
    if (/^["']use client["']/.test(head)) clientFiles.push(f.split(path.sep).join("/"));
  }
}
clientFiles.sort();
console.log(`  ${clientFiles.length} client files:`);
clientFiles.forEach((f) => console.log(`    - ${f}`));
const bad = clientFiles.filter((f) => /\/(page|layout|route)\.js$/.test(f));
line(bad.length === 0, 'no "use client" on any page.js / layout.js / route.js', bad.join(", "));
const boundaryDoc = fs.existsSync("BOUNDARY.md") ? fs.readFileSync("BOUNDARY.md", "utf8") : "";
const undocumented = clientFiles.filter((f) => !boundaryDoc.includes(f.replace(/^app\//, "app/")) && !boundaryDoc.includes(path.basename(f)));
line(undocumented.length === 0, "every client file is documented in BOUNDARY.md", undocumented.join(", "));
if (clientFiles.length > 5) {
  console.log(`  NOTE  ${clientFiles.length} client files is above the brief's "four or five" guideline:`);
  console.log("        the defence for each one must be in BOUNDARY.md.");
}

// ---------------------------------------------------------------- 2. strategy vs build
section("2. STRATEGY.md vs the production build");
if (!fs.existsSync(".next/prerender-manifest.json")) {
  console.log("  SKIP  no production build found (run `npm run build` first)");
} else {
  const pm = JSON.parse(fs.readFileSync(".next/prerender-manifest.json", "utf8"));
  const prerendered = new Set(Object.keys(pm.routes));
  const dynamicPages = new Set(Object.keys(pm.dynamicRoutes));
  const actual = (route) => {
    if (route.includes("[")) {
      const prefix = route.split("[")[0];
      const hasChildren = [...prerendered].some((r) => r.startsWith(prefix) && r !== prefix.replace(/\/$/, ""));
      return dynamicPages.has(route) && hasChildren ? "●" : "ƒ";
    }
    return prerendered.has(route) ? "○" : "ƒ";
  };
  const rows = fs.readFileSync("STRATEGY.md", "utf8").split("\n")
    .filter((l) => l.startsWith("| `/"))
    .map((l) => l.split("|").map((c) => c.trim()));
  rows.forEach((cells) => {
    const route = cells[1].replace(/`/g, "");
    const written = cells[2];
    const found = actual(route);
    line(found === written, `${route.padEnd(20)} written ${written}  build ${found}`);
  });
  if (rows.length === 0) line(false, "STRATEGY.md has a table of routes with a Marker column");
}

// ---------------------------------------------------------------- 3. secrets
section("3. Nothing sensitive in the browser bundle (.next/static)");
if (!fs.existsSync(".next/static")) {
  console.log("  SKIP  no production build found");
} else {
  const needles = ["abebe@example.com", "user_addis_101", "user_other_202", "Hana Girma", "ord_900",
    "sk_live", "DATABASE_URL", "TELEBIRR", "SECRET_KEY", "PRIVATE_KEY"];
  const hits = [];
  for (const f of walk(".next/static")) {
    if (!/\.(js|css|html|json|map)$/.test(f)) continue;
    const text = fs.readFileSync(f, "utf8");
    for (const n of needles) if (text.includes(n)) hits.push(`${n} in ${path.basename(f)}`);
  }
  line(hits.length === 0, `searched .next/static for ${needles.length} sensitive strings`, hits.join("; "));
  line(fs.readFileSync("lib/db.js", "utf8").includes('import "server-only"'), "lib/db.js imports server-only (a client import fails the build)");
}

// ---------------------------------------------------------------- 4 + 5. live checks
async function live() {
  try { await fetch(BASE + "/api/dishes"); } catch {
    section("4. Endpoints / 5. No-JavaScript");
    console.log(`  SKIP  server not reachable at ${BASE} (run \`npm run start\` in another terminal)`);
    return;
  }

  const json = (res) => res.json().catch(() => null);
  const post = (url, body, raw = false) => fetch(BASE + url, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: raw ? body : JSON.stringify(body),
  });

  section("4. Endpoints honour their contract");
  let r = await fetch(BASE + "/api/dishes");
  let b = await json(r);
  line(r.status === 200 && Array.isArray(b) && b.length > 0, "GET /api/dishes -> 200 and a list");

  r = await fetch(BASE + "/api/dishes/not-a-dish"); b = await json(r);
  line(r.status === 404 && typeof b?.error === "string", "GET /api/dishes/not-a-dish -> 404 and { error }");

  r = await post("/api/orders", "not json", true);
  line(r.status === 400, "POST /api/orders with a non-JSON body -> 400");

  r = await post("/api/orders", { name: "Almaz", phone: "0912", dishId: "dish_1" }); b = await json(r);
  line(r.status === 422 && Array.isArray(b?.fieldErrors?.phone), "POST /api/orders invalid phone -> 422 and fieldErrors.phone");

  r = await post("/api/orders", { name: "Almaz Tadesse", phone: "0912345678", dishId: "nope" }); b = await json(r);
  line(r.status === 422 && Array.isArray(b?.fieldErrors?.dishId), "POST /api/orders unknown dish -> 422 and fieldErrors.dishId");

  r = await post("/api/orders", { name: "Almaz Tadesse", phone: "0912345678", dishId: "dish_1", quantity: 2, total: 1, userId: "hacker", status: "PAID" });
  b = await json(r);
  line(r.status === 201 && b?.total === 700 && b?.userId !== "hacker" && b?.status === "PENDING",
    "POST /api/orders valid -> 201; the server priced it (700) and ignored total/userId/status");

  r = await fetch(BASE + "/api/orders/ord_900"); b = await json(r);
  line(r.status === 403 && typeof b?.error === "string", "GET /api/orders/ord_900 (someone else's) -> 403");

  r = await fetch(BASE + "/api/orders/ord_000");
  line(r.status === 404, "GET /api/orders/ord_000 -> 404");

  r = await fetch(BASE + "/menu/not-a-dish"); let html = await r.text();
  line(html.includes("404: Not found"), "/menu/not-a-dish renders not-found.js, not a crash",
    r.status === 200 ? "HTTP 200 because loading.js streams first; Next adds noindex" : `HTTP ${r.status}`);

  section("5. Progressive enhancement: the server action with NO JavaScript");
  html = await (await fetch(BASE + "/checkout")).text();
  const form = html.match(/<form[\s\S]*?<\/form>/)?.[0] ?? "";
  const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#x27;/g, "'");
  const hidden = [...form.matchAll(/<input([^>]*type="hidden"[^>]*)>/g)].map((m) => [
    unesc(m[1].match(/name="([^"]*)"/)?.[1] ?? ""), unesc(m[1].match(/value="([^"]*)"/)?.[1] ?? "")]);
  line(hidden.some(([n]) => n.startsWith("$ACTION")), "the server-rendered form carries the action fields a no-JS browser submits");

  const submit = async (fields) => {
    const fd = new FormData();
    [...hidden, ...fields].forEach(([k, v]) => fd.append(k, v));
    return (await fetch(BASE + "/checkout", { method: "POST", body: fd })).text();
  };
  let out = await submit([["dishId", "dish_1"], ["quantity", "1"], ["name", "Almaz T"], ["phone", "0912"], ["notes", ""]]);
  line(out.includes("Phone number must start"), "invalid phone: the message comes back beside the field");
  line(out.includes('value="Almaz T"'), "invalid phone: what the person typed is refilled");
  out = await submit([["dishId", "dish_1"], ["quantity", "1"], ["name", "Almaz Tadesse"], ["phone", "0912345678"], ["notes", "no JS"]]);
  line(/ord_\d+/.test(out) && out.includes("placed"), "valid submit: the order is placed and confirmed");
}
await live();

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
