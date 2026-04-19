import { Facebook, Instagram, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor">
    <path d="M496 347.21a190.31 190.31 0 0 1-32.79-5.31c-27.28-6.63-54.84-24.26-68.12-52.43-6.9-14.63-2.64-18.59 11.86-24 14.18-5.27 29.8-7.72 36.86-23 5.89-12.76 1.13-27.76-10.41-35.49-15.71-10.53-30.35-.21-46.62 2.07 3.73-46.66 8.66-88.57-22.67-127.73C338.14 48.86 297.34 32 256.29 32s-81.86 16.86-107.81 49.33c-31.38 39.26-26.4 81.18-22.67 127.92-16.32-2.25-30.81-12.79-46.63-2.18-10.58 7.1-16.36 22-10.52 35.12 6.3 14.14 21.92 17.73 36.86 23 14.37 5.38 18.61 9.39 11.71 24-13.19 28.07-40.66 45.72-67.85 52.35A193.63 193.63 0 0 1 16 347.21c-9.38 1.87-16 9.87-16 19.31 0 26.12 42.44 39 65.31 44.57 3.11.76 10.65 2.62 12.14 6 3.39 7.63-.61 19.18 6.65 29.77C93 459.23 108.42 464 124.71 464c13.32 0 27.15-3.15 41.23-6.36a228.37 228.37 0 0 1 41.23-5.19c14.61 0 24.74 4.59 38.29 15.06C265.69 482.53 280.66 496 304 496s38.31-13.47 58.54-28.49c13.55-10.47 23.68-15.06 38.29-15.06a228.37 228.37 0 0 1 41.23 5.19c14.08 3.21 27.91 6.36 41.23 6.36 16.29 0 31.69-4.77 40.58-17.15 7.26-10.59 3.26-22.14 6.65-29.77 1.49-3.36 9-5.22 12.14-6C565.56 406.19 608 393.33 608 367.21c0-9.44-6.62-17.44-16-19.31z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[hsl(var(--ink-950))] border-t border-white/5">
      <div className="mx-auto w-full max-w-[1440px] px-6 pt-24 pb-10 md:px-10">
        {/* Wordmark supersized */}
        <div className="mb-16 flex flex-col gap-10 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-eyebrow mb-6 text-[hsl(var(--accent))]">
              — Écrivez-nous, passez nous voir
            </p>
            <h2 className="text-hero leading-[0.9] text-[hsl(var(--text))]">
              À bientôt
              <span className="serif-italic text-[hsl(var(--accent))]">.</span>
            </h2>
          </div>
          <Image
            src="/images/menu-items/TransparentWhite.png"
            alt="Kech Waffles"
            width={240}
            height={90}
            className="h-16 w-auto self-start object-contain md:h-20 md:self-end"
          />
        </div>

        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          <Column title="Adresse">
            <p className="flex items-start gap-2 text-sm font-light leading-relaxed text-[hsl(var(--text-muted))]">
              <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-[hsl(var(--accent))]" />
              <span>
                MAG 33 AL BADII
                <br />
                Marrakech, Maroc
              </span>
            </p>
          </Column>

          <Column title="Horaires">
            <ul className="space-y-2 text-sm font-light text-[hsl(var(--text-muted))]">
              <li className="flex justify-between gap-4">
                <span className="text-[hsl(var(--text-subtle))]">Lun – Jeu</span>
                <span>10h – 22h</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-[hsl(var(--text-subtle))]">Ven</span>
                <span>17h – 02h</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-[hsl(var(--text-subtle))]">Sam</span>
                <span>10h – 02h</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-[hsl(var(--text-subtle))]">Dim</span>
                <span>11h – 22h</span>
              </li>
            </ul>
          </Column>

          <Column title="Explorer">
            <ul className="space-y-2 text-sm font-light">
              {[
                ["Notre histoire", "/notre-histoire"],
                ["Nos produits", "/product"],
                ["La carte", "/menu"],
                ["Fidélité", "/loyalty/card"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-2 text-[hsl(var(--text-muted))] transition hover:text-[hsl(var(--accent))]"
                  >
                    <span className="h-px w-4 bg-current transition-all group-hover:w-6" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </Column>

          <Column title="Suivre">
            <div className="flex items-center gap-5 text-[hsl(var(--text-muted))]">
              <Link
                href="https://instagram.com/kech_waffles"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[hsl(var(--accent))]"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://facebook.com/kechwaffles"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[hsl(var(--accent))]"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://tiktok.com/@kechwaffles"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[hsl(var(--accent))]"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-5 w-5" />
              </Link>
              <Link
                href="https://snapchat.com/add/kechwaffles"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[hsl(var(--accent))]"
                aria-label="Snapchat"
              >
                <SnapchatIcon className="h-5 w-5" />
              </Link>
            </div>
          </Column>
        </div>

        <div className="mt-20 flex flex-col justify-between gap-4 border-t border-white/5 pt-8 text-xs font-light text-[hsl(var(--text-subtle))] md:flex-row">
          <p>© {new Date().getFullYear()} Kech Waffles — Tous droits réservés.</p>
          <p className="uppercase tracking-[0.2em]">Fait à Marrakech</p>
        </div>
      </div>
    </footer>
  );
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <h3 className="text-eyebrow text-[hsl(var(--text-subtle))]">{title}</h3>
      {children}
    </div>
  );
}
