import { z } from "zod";

// Your Day 33 schema, used by the checkout form AND the server (the server has the final word).
//
// FIXED (Day 39): the phone regex was written with doubled backslashes
// (/^(09|\\+2519)\\d{8}$/). Inside a regex literal "\\" means a literal backslash,
// so no real phone number could ever match and every order came back 422.
// It is now /^(09|\+2519)\d{8}$/.
//
// ADDED: .int() on quantity, so 1.5 portions is rejected.
export const orderSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(2, "Name must be at least 2 characters"),
  phone: z
    .string({ required_error: "Phone number is required" })
    .regex(/^(09|\+2519)\d{8}$/, "Phone number must start with 09… or +2519… followed by 8 digits"),
  dishId: z.string().optional(),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .optional()
    .default(1),
  notes: z.string().max(200, "Notes cannot exceed 200 characters").optional(),
});
