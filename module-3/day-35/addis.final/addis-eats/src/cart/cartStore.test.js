// Run with: npm test
// The store is a plain module, so we test it with no React and no components.
import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";

// Minimal in-memory localStorage so the persist middleware has somewhere to write.
const data = new Map();
globalThis.localStorage = {
  getItem: (k) => (data.has(k) ? data.get(k) : null),
  setItem: (k, v) => void data.set(k, String(v)),
  removeItem: (k) => void data.delete(k),
};

const { useCartStore, selectTotal, selectCount } = await import("./cartStore.js");

const shiro = { id: 1, name: "Shiro", price: 120 };
const tibs = { id: 2, name: "Tibs", price: 358 };

const state = () => useCartStore.getState();

beforeEach(() => {
  state().clear();
  data.clear();
});

test("addItem puts a new dish in the cart with qty 1", () => {
  state().addItem(shiro);
  assert.deepEqual(state().items, [{ ...shiro, qty: 1 }]);
});

test("adding the same dish again increases qty instead of duplicating", () => {
  state().addItem(shiro);
  state().addItem(shiro);
  assert.equal(state().items.length, 1);
  assert.equal(state().items[0].qty, 2);
});

test("remove takes out only the matching dish", () => {
  state().addItem(shiro);
  state().addItem(tibs);
  state().remove(1);
  assert.deepEqual(state().items.map((i) => i.id), [2]);
});

test("clear empties the cart", () => {
  state().addItem(shiro);
  state().clear();
  assert.deepEqual(state().items, []);
});

test("actions never mutate the previous items array", () => {
  state().addItem(shiro);
  const before = state().items;
  const beforeFirst = before[0];

  state().addItem(shiro); // qty change
  state().addItem(tibs); // append
  state().remove(2);

  assert.equal(before.length, 1);
  assert.equal(beforeFirst.qty, 1);
});

test("total and count are derived by selectors, never stored", () => {
  state().addItem(shiro);
  state().addItem(shiro);
  state().addItem(tibs);
  assert.equal(selectTotal(state()), 120 * 2 + 358);
  assert.equal(selectCount(state()), 3);
  assert.equal("total" in state(), false);
});

test("actions keep the same identity, so writers never re-render", () => {
  const { addItem, remove, clear } = state();
  state().addItem(shiro);
  assert.equal(state().addItem, addItem);
  assert.equal(state().remove, remove);
  assert.equal(state().clear, clear);
});

test("persist: only items are saved, and the order survives a 'refresh'", async () => {
  state().addItem(shiro);
  state().addItem(tibs);

  const saved = JSON.parse(data.get("addis-eats-cart"));
  assert.deepEqual(Object.keys(saved.state), ["items"]); // no functions saved
  assert.equal(saved.version, 1);

  // Simulate a page refresh: wipe memory, then rehydrate from storage.
  useCartStore.setState({ items: [] });
  data.set("addis-eats-cart", JSON.stringify(saved));
  await useCartStore.persist.rehydrate();

  assert.deepEqual(state().items.map((i) => [i.id, i.qty]), [[1, 1], [2, 1]]);
});
