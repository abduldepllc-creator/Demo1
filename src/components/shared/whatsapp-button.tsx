import { whatsappLink } from "@/config/site";
import { WhatsAppIcon } from "./icons";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-4 bottom-4 z-40 flex items-center sm:right-6 sm:bottom-6"
    >
      <span className="mr-3 hidden translate-x-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-navy opacity-0 shadow-lift transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
        Chat for bulk prices
      </span>
      <span className="relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.8)] transition-transform duration-300 group-hover:scale-110">
        <span className="animate-pulse-ring absolute inset-0 rounded-full bg-[#25D366]" />
        <WhatsAppIcon className="relative size-7" />
      </span>
    </a>
  );
}
