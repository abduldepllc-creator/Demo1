"use server";

import { z } from "zod";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { inquirySchema } from "@/lib/validations";
import type { FormState } from "@/types";

export async function submitInquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = inquirySchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    await db.insert(inquiries).values(parsed.data);
  } catch (err) {
    console.error("Failed to save inquiry", err);
    return { status: "error", message: "Something went wrong. Please try again or call us." };
  }

  return {
    status: "success",
    message: `Thank you, ${parsed.data.name.split(" ")[0]}! Our sales team will contact you within 24 hours.`,
  };
}
