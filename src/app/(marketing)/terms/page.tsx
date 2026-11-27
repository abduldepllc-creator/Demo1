import type { Metadata } from "next";
import { PolicyPage, type PolicySection } from "@/components/shared/policy-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for wholesale orders placed with SoapBase Pakistan.",
};

// NOTE: Template content. Have it reviewed by a legal professional before launch.
const SECTIONS: PolicySection[] = [
  {
    id: "orders-quotes",
    title: "Orders & quotes",
    paragraphs: [
      "Prices shown on this website and in the bulk price calculator are estimates for guidance. A written quote confirms the final price, valid for 7 days unless stated otherwise. An order is confirmed once we receive payment or approve credit terms.",
    ],
  },
  {
    id: "pricing-payment",
    title: "Pricing & payment",
    list: [
      "All prices are in Pakistani Rupees (PKR) per kg and exclude delivery unless stated otherwise",
      "Volume discounts apply to the total weight of a single order",
      "Payment is by bank transfer before dispatch, unless credit terms have been agreed in writing",
      "We may change prices because of raw material costs. Confirmed orders are not affected",
    ],
  },
  {
    id: "minimum-order",
    title: "Minimum order quantity",
    paragraphs: [
      "Each product has a minimum order quantity (MOQ) shown on its product page. Sample packs of 1 kg are available separately and are not subject to the MOQ.",
    ],
  },
  {
    id: "delivery",
    title: "Delivery",
    paragraphs: [
      "We aim to dispatch orders within 48–72 hours of payment confirmation. Delivery times are estimates and may be affected by cargo schedules, weather or other events outside our control. Risk passes to the customer on delivery or collection.",
    ],
  },
  {
    id: "returns-claims",
    title: "Returns & claims",
    paragraphs: [
      "Please inspect your goods on arrival. Report any damage, shortage or quality concern within 48 hours of delivery, with photos and the batch number. If a claim is approved, we will replace the goods or issue a credit. Soap base that has been melted, processed or stored incorrectly cannot be returned.",
    ],
  },
  {
    id: "product-use",
    title: "Product use",
    paragraphs: [
      "Our soap bases are raw materials for making soap. Customers are responsible for their own finished-product formulations, labelling and compliance with applicable regulations, including skin testing of any additives they use.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    paragraphs: [
      "To the extent permitted by law, our liability for any claim relating to an order is limited to the value of the goods supplied in that order.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing law",
    paragraphs: ["These terms are governed by the laws of Pakistan, and disputes fall under the jurisdiction of the courts of Lahore."],
  },
];

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      intro="These terms apply to all quotes, orders and deliveries from SoapBase Pakistan. Please read them before placing an order."
      updated="27 November 2026"
      sections={SECTIONS}
    />
  );
}
