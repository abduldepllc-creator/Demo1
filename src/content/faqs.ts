export type Faq = { q: string; a: string };
export type FaqGroup = { id: string; title: string; items: Faq[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "ordering",
    title: "Ordering & Pricing",
    items: [
      {
        q: "What is the minimum order quantity?",
        a: "Our MOQ is 20–25 kg depending on the base. Volume discounts start at 100 kg, with up to 12% off on orders of 1 ton and above.",
      },
      {
        q: "How do I get a price quote?",
        a: "Use the quote form on our Contact page, use the bulk price calculator on any product page, or message us on WhatsApp. We reply within 24 hours — usually much sooner.",
      },
      {
        q: "Can I mix different soap bases in one order?",
        a: "Yes. You can combine several bases in one order. Volume pricing is calculated on the total weight, as long as each base meets its own minimum.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept bank transfer (IBFT). Established customers can apply for flexible credit terms on repeat orders.",
      },
    ],
  },
  {
    id: "delivery",
    title: "Shipping & Delivery",
    items: [
      {
        q: "Do you deliver across Pakistan?",
        a: "Yes. We dispatch to 60+ cities through trusted cargo partners. Orders are usually dispatched within 48–72 hours of payment confirmation.",
      },
      {
        q: "How is soap base packed for transport?",
        a: "Every block is shrink-wrapped against moisture, then packed in sealed, labelled corrugated cartons. Large orders are palletised.",
      },
      {
        q: "Can I collect my order from your warehouse?",
        a: "Yes, self-collection from our Lahore warehouse is available Monday to Saturday. Please book a collection time with our sales team.",
      },
    ],
  },
  {
    id: "product",
    title: "Product & Quality",
    items: [
      {
        q: "Can I get a sample before placing a bulk order?",
        a: "Absolutely. We offer 1 kg sample packs of any base so you can test clarity, lather and fragrance load before you commit to bulk.",
      },
      {
        q: "How much fragrance or essential oil can I add?",
        a: "Most of our bases hold 2–3% fragrance oil by weight. Our SLS-free and butter-rich bases perform best at 1.5–2.5%.",
      },
      {
        q: "How should soap base be stored?",
        a: "Keep it sealed in its original wrap, somewhere cool and dry and out of direct sunlight. Most of our bases have an 18–24 month shelf life.",
      },
      {
        q: "Why do my soaps get water droplets (sweating)?",
        a: "Glycerin draws moisture from humid air. Wrap finished soaps in cling film soon after they set. Our Crystal Clear base uses a low-sweat formula made for Pakistan's humidity.",
      },
    ],
  },
  {
    id: "custom",
    title: "Custom & Private Label",
    items: [
      {
        q: "Do you offer custom formulations?",
        a: "Yes. For larger orders we can adjust clarity, hardness, colour, additives and fragrance to match your brand's specification.",
      },
      {
        q: "Can you supply soap under my own brand?",
        a: "Yes. Our private label service covers formulation, moulding, wrapping and branded packaging. See the Private Label page for details.",
      },
    ],
  },
];

export const ALL_FAQS = FAQ_GROUPS.flatMap((g) => g.items);
