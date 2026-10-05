// A pretend order endpoint. There is no real server yet (that is Module 4),
// so this behaves like one: it takes time, it validates AGAIN (anything sent
// from a browser can be forged), and it answers a rule failure the way a real
// API would - HTTP 422 with a fieldErrors object.
import { normalizePhone, validate } from "../checkout/validate.js";

export class OrderError extends Error {
  constructor(message, { status, fieldErrors = {} } = {}) {
    super(message);
    this.name = "OrderError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let nextOrderNumber = 1001;

// DEMO TRIGGERS, so every form state can be tried by hand:
//   0900 000 000 ... -> 422 "not registered with TeleBirr"  (a server-only rule)
//   0933 333 333     -> 503 "kitchen line is busy"          (a failed request)
export async function placeOrder(form, items, { delay = 800 } = {}) {
  await sleep(delay);

  // 1. The server has the final word: same rules, enforced again.
  const fieldErrors = validate(form);

  // 2. Rules only the server can know.
  const phone = normalizePhone(form.phone);
  const national = phone.replace(/^\+251/, "0");
  if (!fieldErrors.phone && national.startsWith("0900")) {
    fieldErrors.phone = "That number is not registered with TeleBirr";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new OrderError("Please check the highlighted fields.", {
      status: 422,
      fieldErrors,
    });
  }

  if (!items || items.length === 0) {
    throw new OrderError("Your cart is empty.", { status: 400 });
  }

  if (national === "0933333333") {
    throw new OrderError(
      "Our kitchen line is busy right now. Your cart and details are safe - please try again.",
      { status: 503 }
    );
  }

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { id: `AE-${nextOrderNumber++}`, total };
}
