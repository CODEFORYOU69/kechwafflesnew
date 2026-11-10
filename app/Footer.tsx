import { CONTACT, GIRLS_ONLY, OPENING_HOURS, VISIT, whatsappUrl } from "@/lib/site-content";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The whole width of the grid, then the facts. `.section-rise` covers the foot of
 * what comes before it: pages not built from those sections (back office, contest,
 * loyalty) never reserved that room, so there the footer stays below their content.
 */
export default function Footer() {
  return (
    <footer
      aria-labelledby="footer-title"
      className="section-rise overflow-clip bg-espresso-950 text-cream-50 print:hidden [main:not(:has(.section-rise))+&]:mt-0"
    >
      <div
        aria-hidden="true"
        className="kufic-grid mask-b-fade pointer-events-none absolute inset-x-0 top-0 h-[34rem] text-gold-400 opacity-[0.04]"
      />

      <div className="page-x relative pb-6 pt-[clamp(4.5rem,8vw,8rem)]">
        <div className="grid grid-cols-12 gap-x-4 lg:gap-x-6">
          <p className="text-eyebrow col-span-12 text-gold-400 md:col-span-6">{EYEBROW}</p>

          {/* Sized from the width of the grid: the line runs exactly from margin to margin. */}
          <div className="col-span-12 mt-8 [container-type:inline-size] md:row-start-2 md:mt-4">
            <h2
              id="footer-title"
              className="text-mega whitespace-nowrap text-[calc(100cqw/3.29)] text-cream-50"
            >
              {TITLE}
              <span className="text-gold-400">.</span>
            </h2>
          </div>

          <Image
            src="/brand/kech-waffles-logo.svg"
            alt="Kech Waffles"
            width={1347}
            height={1145}
            sizes="(min-width: 1024px) 240px, 180px"
            className="col-span-12 mt-10 h-auto w-[180px] md:col-span-6 md:col-start-7 md:row-start-1 md:mt-0 lg:col-span-3 lg:col-start-10 lg:w-[240px]"
          />
        </div>

        <div className="hairline mt-6 md:mt-4" />

        <div className="grid grid-cols-12 gap-x-4 gap-y-12 pt-8 md:pt-10 lg:gap-x-6">
          <Column title="Adresse" className="col-span-12 md:col-span-6 lg:col-span-4">
            <a
              href={CONTACT.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <span className="text-headline block text-cream-50">
                <Underlined>{CONTACT.addressLine}</Underlined>
              </span>
              <span className="mt-2 block text-cream-300">
                {CONTACT.city}, {CONTACT.country}
              </span>
              <span className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm text-gold-400 lg:fine:min-h-8">
                {VISIT.directionsCta}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
                <span className="sr-only">{NEW_TAB_LABEL}</span>
              </span>
            </a>
          </Column>

          <Column title="Horaires" className="col-span-12 md:col-span-6 lg:col-span-3">
            <dl className="font-mono text-[0.8125rem] leading-none">
              {OPENING_HOURS.map((opening) => (
                <div
                  key={opening.weekday}
                  className="flex items-baseline justify-between gap-4 border-b border-cream-50/10 py-2 first:pt-0"
                >
                  <dt className="text-cream-300">{opening.day}</dt>
                  <dd className={opening.opensAt === null ? "text-cream-400" : "text-cream-50"}>
                    {opening.label}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[0.8125rem] leading-snug text-cream-200">{GIRLS_ONLY.closedNote}</p>
          </Column>

          <Column title="Explorer" className="col-span-6 lg:col-span-2">
            <ul>
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={LIST_LINK}>
                    <Underlined>{link.label}</Underlined>
                  </Link>
                </li>
              ))}
            </ul>
          </Column>

          <Column title="Suivre" className="col-span-6 lg:col-span-3">
            <ul>
              {FOLLOW_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className={LIST_LINK}>
                    <Underlined>{link.label}</Underlined>
                    <ArrowUpRight className="size-3.5 flex-none text-gold-400" aria-hidden="true" />
                    <span className="sr-only">{NEW_TAB_LABEL}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Column>
        </div>

        {/* On the grid rather than against the right margin, where the floating WhatsApp button sits. */}
        <div className="text-eyebrow mt-12 grid grid-cols-12 gap-x-4 gap-y-2 border-t border-cream-50/10 pt-5 text-cream-400 md:mt-16 lg:gap-x-6">
          <p className="col-span-12 md:col-span-6 lg:col-span-9">
            © {new Date().getFullYear()} Kech Waffles
          </p>
          <p className="col-span-12 md:col-span-6 lg:col-span-3">{SIGNATURE}</p>
        </div>
      </div>
    </footer>
  );
}

function Column({
  title,
  className,
  children,
}: {
  title: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <h3 className="text-eyebrow mb-5 text-cream-400">{title}</h3>
      {children}
    </div>
  );
}

function Underlined({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold-400 transition-transform duration-500 ease-soft group-focus-visible:scale-x-100 fine:group-hover:scale-x-100"
      />
    </span>
  );
}

const LIST_LINK =
  "group inline-flex min-h-11 min-w-11 items-center gap-1 text-[0.9375rem] text-cream-200 fine:hover:text-cream-50 lg:fine:min-h-8";

const EXPLORE_LINKS = [
  { label: "Café", href: "/#cafe" },
  { label: "La carte", href: "/menu" },
  { label: "Girls Only", href: "/girls-only" },
  { label: "Café IA", href: "/cafe-ia" },
  { label: "Prestations", href: "/prestations" },
  { label: "Notre histoire", href: "/notre-histoire" },
  { label: "Nos produits", href: "/product" },
  { label: "Nous trouver", href: "/location" },
  { label: "In English", href: "/en" },
  { label: "Fidélité", href: "/loyalty/card" },
];

const FOLLOW_LINKS = [
  { label: "Instagram", href: CONTACT.instagramUrl },
  { label: "Facebook", href: CONTACT.facebookUrl },
  { label: "TikTok", href: CONTACT.tiktokUrl },
  { label: "Snapchat", href: CONTACT.snapchatUrl },
  { label: "WhatsApp", href: whatsappUrl() },
  { label: "Glovo", href: CONTACT.glovoUrl },
];

const EYEBROW = "Écrivez-nous, passez nous voir";
const TITLE = "À bientôt";
const SIGNATURE = "Fait à Marrakech";
const NEW_TAB_LABEL = "(nouvel onglet)";
