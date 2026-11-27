"use client";

import { useActionState } from "react";
import { addSubscriber } from "@/actions/admin/newsletter";
import { FormError, Input, SubmitButton, type ActionState } from "./form";

export function SubscriberForm() {
  const [state, action] = useActionState(addSubscriber, {} as ActionState);
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} className="space-y-3 p-5" noValidate>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-navy">Email *</label>
        <Input name="email" type="email" placeholder="buyer@company.pk" />
        {e.email?.[0] && <p className="mt-1 text-xs font-semibold text-red-600">{e.email[0]}</p>}
      </div>
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-bold text-navy">Name</label>
        <Input name="name" />
      </div>
      <FormError state={state} />
      <SubmitButton className="w-full">Add subscriber</SubmitButton>
    </form>
  );
}
