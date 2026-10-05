// Run with: npm test  - the rules are a pure function, so no React is involved.
import test from "node:test";
import assert from "node:assert/strict";
import {
  AREAS,
  firstInvalidField,
  normalizePhone,
  validate,
} from "./validate.js";

const good = { name: "Abebe", phone: "0911234567", area: "Bole", notes: "" };

test("a complete form has no errors", () => {
  assert.deepEqual(validate(good), {});
});

test("an empty form reports name and phone (area defaults to a real area)", () => {
  const errors = validate({ name: "", phone: "", area: "Bole", notes: "" });
  assert.deepEqual(Object.keys(errors), ["name", "phone"]);
});

test("name must contain more than whitespace", () => {
  assert.equal(validate({ ...good, name: "   " }).name, "Please enter your name");
});

test("TeleBirr: accepts 09... and +2519..., with spaces and dashes stripped", () => {
  for (const phone of [
    "0911234567",
    "+251911234567",
    "0911 234 567",
    "+251 911 234 567",
    "091-123-4567",
  ]) {
    assert.equal(validate({ ...good, phone }).phone, undefined, phone);
  }
});

test("TeleBirr: rejects wrong shapes", () => {
  for (const phone of [
    "911234567", // missing the leading 0
    "0811234567", // not a 09 mobile
    "091123456", // one digit short
    "09112345678", // one digit long
    "+251711234567", // not a 9 after the country code
    "abc",
  ]) {
    assert.ok(validate({ ...good, phone }).phone, phone);
  }
});

test("the phone message says what to do, not what failed", () => {
  assert.equal(
    validate({ ...good, phone: "x" }).phone,
    "Use 09… or +2519… (TeleBirr number)"
  );
});

test("area must be one of the four delivery areas", () => {
  for (const area of AREAS) assert.equal(validate({ ...good, area }).area, undefined);
  assert.equal(validate({ ...good, area: "Mars" }).area, "Choose a delivery area");
  assert.equal(validate({ ...good, area: "" }).area, "Choose a delivery area");
});

test("notes are optional but capped at 200 characters", () => {
  assert.equal(validate({ ...good, notes: "x".repeat(200) }).notes, undefined);
  assert.match(validate({ ...good, notes: "x".repeat(201) }).notes, /at most 200.*you have 201/);
});

test("validate never mutates the form it is given", () => {
  const form = Object.freeze({ ...good, name: "" });
  validate(form); // would throw in strict mode if it tried to write
  assert.equal(form.name, "");
});

test("firstInvalidField follows page order, not insertion order", () => {
  assert.equal(firstInvalidField({ phone: "x", name: "y" }), "name");
  assert.equal(firstInvalidField({ notes: "x", area: "y" }), "area");
  assert.equal(firstInvalidField({}), undefined);
});

test("normalizePhone strips spaces and dashes only", () => {
  assert.equal(normalizePhone(" +251 911-234 567 "), "+251911234567");
  assert.equal(normalizePhone(undefined), "");
});
