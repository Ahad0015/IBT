// The mock "server" is just a module, so it is testable without React.
import test from "node:test";
import assert from "node:assert/strict";
import { OrderError, placeOrder } from "./orders.js";

const form = { name: "Abebe", phone: "0911234567", area: "Bole", notes: "" };
const items = [
  { id: 1, price: 120, qty: 2 },
  { id: 2, price: 358, qty: 1 },
];
const fast = { delay: 0 };

test("a valid order returns an id and the total", async () => {
  const order = await placeOrder(form, items, fast);
  assert.match(order.id, /^AE-\d+$/);
  assert.equal(order.total, 598);
});

test("order ids are unique", async () => {
  const a = await placeOrder(form, items, fast);
  const b = await placeOrder(form, items, fast);
  assert.notEqual(a.id, b.id);
});

test("the server validates AGAIN: a forged request gets a 422 with fieldErrors", async () => {
  await assert.rejects(
    () => placeOrder({ ...form, name: "", area: "Mars" }, items, fast),
    (err) => {
      assert.ok(err instanceof OrderError);
      assert.equal(err.status, 422);
      assert.deepEqual(Object.keys(err.fieldErrors), ["name", "area"]);
      return true;
    }
  );
});

test("server-only rule: an unregistered TeleBirr number is a 422 on phone", async () => {
  for (const phone of ["0900123456", "+251 900 123 456"]) {
    await assert.rejects(
      () => placeOrder({ ...form, phone }, items, fast),
      (err) => err.status === 422 && /not registered/.test(err.fieldErrors.phone)
    );
  }
});

test("a failed request is a non-422 error with no fieldErrors", async () => {
  await assert.rejects(
    () => placeOrder({ ...form, phone: "0933333333" }, items, fast),
    (err) => err.status === 503 && Object.keys(err.fieldErrors).length === 0
  );
});

test("an empty cart cannot be ordered", async () => {
  await assert.rejects(
    () => placeOrder(form, [], fast),
    (err) => err.status === 400
  );
});
