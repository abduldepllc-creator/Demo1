import type { Metadata } from "next";
import { PolicyPage, type PolicySection } from "@/components/shared/policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How SoapBase Pakistan collects, uses and protects your personal information.",
};

// NOTE: Template content. Have it reviewed by a legal professional before launch.
const SECTIONS: PolicySection[] = [
  {
    id: "information-we-collect",
    title: "Information we collect",
    paragraphs: ["When you request a quote, place an order or contact us, we may collect:"],
    list: [
      "Your name, company name, phone/WhatsApp number and email address",
      "Your city and delivery address",
      "Order details such as products, quantities and order history",
      "Messages you send us through our forms, email or WhatsApp",
      "Basic technical data such as browser type and pages visited, collected to improve the website",
    ],
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    list: [
      "To respond to enquiries and prepare quotes",
      "To process, dispatch and deliver orders",
      "To provide customer support and order updates",
      "To improve our products, services and website",
      "To send occasional product or pricing updates, only if you agree, and you can opt out at any time",
    ],
  },
  {
    id: "sharing",
    title: "Sharing your information",
    paragraphs: [
      "We do not sell your personal information. We share only the details needed with trusted partners, such as cargo and courier companies, so they can deliver your order. These partners may use the information only for that purpose.",
    ],
  },
  {
    id: "data-security",
    title: "Data security",
    paragraphs: [
      "We use reasonable technical and organisational measures to protect your information from unauthorised access, loss or misuse. No method of transmission over the internet is completely secure, so we cannot guarantee absolute security.",
    ],
  },
  {
    id: "retention",
    title: "Data retention",
    paragraphs: [
      "We keep enquiry and order records for as long as needed to serve you and to meet our accounting and legal obligations. After that, they are deleted or anonymised.",
    ],
  },
  {
    id: "your-rights",
    title: "Your rights",
    paragraphs: [
      "You can ask us to access, correct or delete the personal information we hold about you, or to stop sending you marketing messages. Contact us using the details below.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      "We may update this policy from time to time. The latest version will always be on this page, with the date it was last updated.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="Your privacy matters to us. This policy explains what information we collect, how we use it and the choices you have."
      updated="27 November 2026"
      sections={SECTIONS}
    />
  );
}
