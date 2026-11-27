"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveOrder } from "@/actions/admin/orders";
import { ORDER_STATUSES, PAYMENT_STATUSES, type Customer, type Order, type OrderItem } from "@/db/schema";
import { CITIES } from "@/constants";
import { Card } from "./ui";
import { Field, FormError, Input, Select, SubmitButton, Textarea, type ActionState } from "./form";
import { btn } from "./styles";
import { OrderItemsEditor, type ProductOption } from "./order-items-editor";

type Prefill = Partial<Pick<Order, "customerName" | "company" | "phone" | "email" | "city" | "address" | "notes">> & {
  inquiryId?: number;
  items?: { productId: number; quantityKg: number; unitPrice: number }[];
};

export function OrderForm({
  order,
  customers,
  products,
  prefill,
}: {
  order?: Order & { items: OrderItem[] };
  customers: Pick<Customer, "id" | "name" | "company" | "phone" | "email" | "city" | "address">[];
  products: ProductOption[];
  prefill?: Prefill;
}) {
  const [state, action] = useActionState(saveOrder.bind(null, order?.id ?? null), {} as ActionState);
  const e = state.fieldErrors ?? {};
  const base = order ?? prefill ?? {};

  const [customerId, setCustomerId] = useState<number>(order?.customerId ?? 0);
  const [details, setDetails] = useState({
    customerName: base.customerName ?? "",
    company: base.company ?? "",
    phone: base.phone ?? "",
    email: base.email ?? "",
    city: base.city ?? "",
    address: base.address ?? "",
  });

  const pickCustomer = (id: number) => {
    setCustomerId(id);
    const c = customers.find((x) => x.id === id);
    if (c) {
      setDetails({
        customerName: c.name,
        company: c.company ?? "",
        phone: c.phone,
        email: c.email ?? "",
        city: c.city ?? "",
        address: c.address ?? "",
      });
    }
  };

  const set = (k: keyof typeof details) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setDetails({ ...details, [k]: ev.target.value });

  const items =
    order?.items.filter((i) => i.productId).map((i) => ({ productId: i.productId!, quantityKg: i.quantityKg, unitPrice: i.unitPrice })) ??
    prefill?.items ??
    [];

  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[1fr_340px]" noValidate>
      {prefill?.inquiryId && <input type="hidden" name="inquiryId" value={prefill.inquiryId} />}
      <div className="space-y-6">
        <Card title="Customer">
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Existing customer" name="customerId" hint="Pick one to fill the details, or enter a new customer below" className="sm:col-span-2">
              <Select name="customerId" value={customerId || ""} onChange={(ev) => pickCustomer(Number(ev.target.value))}>
                <option value="">New / walk-in customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.company ? ` · ${c.company}` : ""} · {c.phone}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Contact name" name="customerName" required error={e.customerName}>
              <Input name="customerName" value={details.customerName} onChange={set("customerName")} />
            </Field>
            <Field label="Company" name="company" error={e.company}>
              <Input name="company" value={details.company} onChange={set("company")} />
            </Field>
            <Field label="Phone / WhatsApp" name="phone" required error={e.phone}>
              <Input name="phone" type="tel" value={details.phone} onChange={set("phone")} />
            </Field>
            <Field label="Email" name="email" error={e.email}>
              <Input name="email" type="email" value={details.email} onChange={set("email")} />
            </Field>
            <Field label="City" name="city" error={e.city}>
              <Input name="city" list="order-cities" value={details.city} onChange={set("city")} />
              <datalist id="order-cities">
                {CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <Field label="Delivery address" name="address" error={e.address}>
              <Input name="address" value={details.address} onChange={set("address")} />
            </Field>
            {!customerId && !order && (
              <label className="flex items-center gap-2 text-sm font-semibold text-navy sm:col-span-2">
                <input type="checkbox" name="saveCustomer" defaultChecked className="size-4 accent-brand" />
                Save as a new customer
              </label>
            )}
          </div>
        </Card>

        <Card title="Products">
          <div className="p-5">
            <OrderItemsEditor products={products} defaultItems={items} defaultDiscount={order?.discount ?? 0} defaultDeliveryFee={order?.deliveryFee ?? 0} />
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Status">
          <div className="space-y-4 p-5">
            <Field label="Order status" name="status" hint="Confirmed or later deducts stock. Cancelled restores it." error={e.status}>
              <Select name="status" defaultValue={order?.status ?? "pending"}>
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="Payment" name="paymentStatus" error={e.paymentStatus}>
              <Select name="paymentStatus" defaultValue={order?.paymentStatus ?? "unpaid"}>
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="Internal notes" name="notes" error={e.notes}>
              <Textarea name="notes" defaultValue={base.notes ?? ""} rows={3} />
            </Field>
          </div>
        </Card>

        <div className="sticky bottom-4 space-y-3 rounded-2xl border border-navy/8 bg-white p-4 shadow-lift">
          <FormError state={state} />
          <SubmitButton className="w-full">{order ? "Save order" : "Create order"}</SubmitButton>
          <Link href={order ? `/admin/orders/${order.id}` : "/admin/orders"} className={`${btn("outline")} w-full`}>Cancel</Link>
        </div>
      </div>
    </form>
  );
}
