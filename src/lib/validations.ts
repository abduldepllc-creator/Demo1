import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .max(200)
  .optional()
  .transform((v) => (v ? v : undefined));

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  company: optionalText,
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{8,16}$/, "Please enter a valid phone number"),
  email: z
    .union([z.literal(""), z.email("Please enter a valid email")])
    .optional()
    .transform((v) => (v ? v : undefined)),
  city: optionalText,
  product: optionalText,
  quantityKg: z
    .union([z.literal(""), z.coerce.number().int().min(1, "Quantity must be at least 1 kg").max(1_000_000)])
    .optional()
    .transform((v) => (typeof v === "number" ? v : undefined)),
  message: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v ? v : undefined)),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
