"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveCustomer } from "@/actions/admin/customers";
import type { Customer } from "@/db/schema";
import { CITIES } from "@/constants";
import { Card } from "./ui";
import { Field, FormError, Input, SubmitButton, Textarea, type ActionState } from "./form";
import { btn } from "./styles";

export function CustomerForm({ customer }: { customer?: Customer }) {
  const [state, action] = useActionState(saveCustomer.bind(null, customer?.id ?? null), {} as ActionState);
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} noValidate>
      <Card title={customer ? "Edit details" : "Customer details"}>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Contact name" name="name" required error={e.name}>
            <Input name="name" defaultValue={customer?.name} />
          </Field>
          <Field label="Company / brand" name="company" error={e.company}>
            <Input name="company" defaultValue={customer?.company ?? ""} />
          </Field>
          <Field label="Phone / WhatsApp" name="phone" required error={e.phone}>
            <Input name="phone" type="tel" defaultValue={customer?.phone} />
          </Field>
          <Field label="Email" name="email" error={e.email}>
            <Input name="email" type="email" defaultValue={customer?.email ?? ""} />
          </Field>
          <Field label="City" name="city" error={e.city}>
            <Input name="city" list="customer-cities" defaultValue={customer?.city ?? ""} />
            <datalist id="customer-cities">
              {CITIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field label="Address" name="address" error={e.address}>
            <Input name="address" defaultValue={customer?.address ?? ""} />
          </Field>
          <Field label="Notes" name="notes" error={e.notes} className="sm:col-span-2">
            <Textarea name="notes" defaultValue={customer?.notes ?? ""} rows={3} placeholder="Preferred bases, payment terms, delivery instructions…" />
          </Field>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-navy/8 p-4 sm:flex-row sm:items-center sm:justify-end">
          <FormError state={state} />
          <Link href={customer ? `/admin/customers/${customer.id}` : "/admin/customers"} className={btn("outline")}>Cancel</Link>
          <SubmitButton>{customer ? "Save changes" : "Add customer"}</SubmitButton>
        </div>
      </Card>
    </form>
  );
}
