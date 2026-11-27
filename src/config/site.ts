// NOTE: phone, email, WhatsApp and address below are placeholders — replace with real details.
export const siteConfig = {
  name: "SoapBase Pakistan",
  domain: "soapbase.pk",
  url: "https://soapbase.pk",
  tagline: "Premium Raw Soap Base in Bulk",
  description:
    "SoapBase Pakistan is a wholesale supplier of premium raw soap base — transparent, milky, goat milk, aloe vera, shea butter and charcoal melt & pour bases in bulk, delivered nationwide.",
  positioning: ["Wholesale Supplier", "Bulk Orders", "Raw Soap Materials"],
  contact: {
    phone: "+92 300 1234567",
    phoneHref: "tel:+923001234567",
    whatsapp: "923001234567",
    email: "sales@soapbase.pk",
    address: "Sundar Industrial Estate, Lahore, Punjab, Pakistan",
    hours: "Mon – Sat, 9:00 AM – 7:00 PM",
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
} as const;

export function whatsappLink(message = "Hi SoapBase! I'd like a bulk quote for soap base.") {
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
