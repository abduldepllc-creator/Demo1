import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { whatsappLink } from "@/config/site";
import { Bubbles } from "@/components/shared/bubbles";
import { Reveal } from "@/components/shared/reveal";
import { SoapBlock } from "@/components/shared/soap-block";
import { WhatsAppIcon } from "@/components/shared/icons";

export function CtaBand() {
  return (
    <section className="container-x py-16 sm:py-24">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-linear-to-br from-brand-600 via-brand to-[#3fb14b] px-6 py-14 text-center shadow-glow sm:px-12 sm:py-20 lg:text-left">
          <Bubbles count={8} className="-z-10 opacity-70" />
          <div className="absolute -top-20 -left-20 -z-10 size-72 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -right-24 -bottom-24 -z-10 size-80 rounded-full bg-navy/30 blur-3xl" />

          <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-sm font-bold tracking-[0.18em] text-white/80 uppercase">Wholesale · Bulk · Nationwide</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
                Ready to place a bulk order?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/85 sm:text-lg lg:mx-0">
                Tell us what you need and get a tailored wholesale quote within 24 hours. Volume discounts up to
                12% on orders of 1 ton and above.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Link href="/contact" className="btn btn-navy group !px-7 !py-4">
                  Request a Quote
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn !px-7 !py-4 bg-white text-navy hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <WhatsAppIcon className="size-5 text-[#25D366]" />
                  WhatsApp Us
                </a>
              </div>
            </div>

            <div className="relative mx-auto hidden w-full max-w-sm sm:block">
              <div className="animate-float relative z-10 w-[70%]">
                <SoapBlock color="#cfeef5" translucent />
              </div>
              <div className="animate-float-slow absolute top-[30%] right-0 w-[60%] [animation-delay:2s]">
                <SoapBlock color="#f6f4ee" />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
