import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { COFFEE, MARQUEE_ITEMS } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import Image from "next/image";
import styles from "./CoffeeSection.module.css";
import { RoastExplorer } from "./RoastExplorer";

export function CoffeeSection() {
  return (
    <section
      id="cafe"
      aria-labelledby="cafe-title"
      className={cn("section-rise section-pad bg-espresso-900 pt-0 text-cream-50", styles.section)}
    >
      <Marquee />
      <Header />
      <RoastExplorer />
      <Extractions />
      <Station />
      <Signatures />
    </section>
  );
}

function Marquee() {
  return (
    <div className={styles.marquee} aria-hidden="true" data-pause-offscreen="">
      <div className="hairline" />
      <div className={styles.marqueeWindow}>
        <div className={cn("animate-marquee", styles.marqueeTrack)}>
          {MARQUEE_TRACK.map((item, index) => (
            <span key={index} className={cn("text-eyebrow", styles.marqueeItem)}>
              {item}
              <span className={styles.marqueeArch} />
            </span>
          ))}
        </div>
      </div>
      <div className="hairline" />
    </div>
  );
}

function Header() {
  const [firstLine, secondLine] = COFFEE.titleLines;

  return (
    <header className={cn("page-x grid grid-cols-12 gap-x-3 lg:gap-x-6", styles.header)}>
      <Reveal className="col-span-12 lg:col-span-3 lg:pt-4" y={16}>
        <p className="text-eyebrow text-gold-400">{COFFEE.eyebrow}</p>
      </Reveal>
      <RevealLines
        id="cafe-title"
        lines={[firstLine, accentLastWord(secondLine)]}
        className="text-section col-span-12 mt-5 lg:col-span-9 lg:mt-0"
      />
      <Reveal
        className="col-span-11 col-start-2 mt-8 md:col-span-7 md:col-start-6 lg:col-span-5 lg:col-start-8 lg:mt-12"
        delay={0.2}
      >
        <p className="text-subhead text-cream-200">{COFFEE.intro}</p>
      </Reveal>
    </header>
  );
}

function Extractions() {
  return (
    <div className={cn("page-x grid grid-cols-12 gap-x-3 lg:gap-x-6", styles.extractions)}>
      <Reveal className="col-span-12 lg:col-span-3" y={20}>
        <h3 className="text-headline max-w-[10ch] text-balance">{COFFEE.extractionsTitle}</h3>
      </Reveal>
      <ol className="col-span-12 mt-8 grid lg:col-span-9 lg:mt-0 lg:grid-cols-3">
        {COFFEE.extractions.map((extraction, index) => (
          <li key={extraction.id} className={styles.extraction}>
            <Reveal delay={index * 0.12}>
              <p className="text-eyebrow text-gold-400" aria-hidden="true">
                {formatIndex(index)}
              </p>
              <h4 className="text-headline mt-4 lg:mt-5">{extraction.name}</h4>
              <p className="mt-4 text-cream-200">{extraction.detail}</p>
              <ul className="text-eyebrow mt-5 flex flex-wrap gap-x-3 gap-y-1 text-gold-400 lg:mt-8">
                {extraction.drinks.map((drink) => (
                  <li key={drink}>{drink}</li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Station() {
  const { back, front, side } = COFFEE.stationImages;

  return (
    <div className={cn("page-x", styles.station)}>
      <div className={styles.stationHead}>
        <Reveal y={16}>
          <p className="text-eyebrow text-gold-400">{COFFEE.stationLabel}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h3 className={cn("text-section", styles.stationTitle)}>
            {breakAfterComma(COFFEE.stationTitle)}
          </h3>
        </Reveal>
      </div>

      <Reveal className={styles.stationText} delay={0.16}>
        <p className="text-subhead text-cream-200">{COFFEE.stationText}</p>
      </Reveal>

      <div className={styles.backPlane}>
        <div className="frame-arch parallax-frame h-full w-full">
          <ParallaxLayer strength={8}>
            <Image
              src={back.src}
              alt={back.alt}
              fill
              sizes="(min-width: 1440px) 780px, (min-width: 1024px) 54vw, (min-width: 640px) 73vw, 117vw"
              className="object-cover object-[50%_24%]"
            />
          </ParallaxLayer>
        </div>
      </div>

      <div className={styles.sidePlane}>
        <div className={cn("frame-arch parallax-frame h-full w-full", styles.mat)}>
          <ParallaxLayer strength={5}>
            <Image
              src={side.src}
              alt={side.alt}
              fill
              sizes="(min-width: 1440px) 360px, (min-width: 1024px) 25vw, 33vw"
              className="object-cover object-[50%_38%]"
            />
          </ParallaxLayer>
        </div>
      </div>

      <div className={styles.frontCard}>
        <div className={cn("parallax-frame relative h-full w-full", styles.mat)}>
          <ParallaxLayer strength={-6}>
            <Image
              src={front.src}
              alt={front.alt}
              fill
              sizes="(min-width: 1440px) 500px, (min-width: 1024px) 34vw, (min-width: 640px) 41vw, 60vw"
              className="object-cover object-[52%_52%]"
            />
          </ParallaxLayer>
        </div>
      </div>
    </div>
  );
}

function Signatures() {
  return (
    <div className={cn("page-x", styles.signatures)}>
      <Reveal y={20}>
        <h3 className="text-headline">{COFFEE.signaturesTitle}</h3>
      </Reveal>
      <ul className={`mt-6 lg:mt-8 ${styles.signatureList}`}>
        {COFFEE.signatures.map((signature, index) => {
          const isLead = index === 0;

          return (
            <li key={signature.name} className="group">
              <div className="hairline" />
              <Reveal y={18}>
                <div
                  className={cn(
                    "transition-transform duration-500 ease-soft fine:group-hover:translate-x-3",
                    styles.signatureRow,
                    isLead && styles.signatureRowLead,
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={`text-eyebrow text-gold-400 ${styles.signatureIndex}`}
                  >
                    {formatIndex(index)}
                  </span>
                  <span
                    className={`${isLead ? `text-hero ${styles.leadName}` : "font-display text-[clamp(1.75rem,4.4vw,4rem)]"} ${styles.signatureName}`}
                  >
                    {signature.name}
                    <span aria-hidden="true" className={NAME_HOVER}>
                      {signature.name}
                    </span>
                  </span>
                  <span
                    className={`font-mono text-[0.8125rem] leading-snug text-cream-300 ${styles.signatureDetail}`}
                  >
                    {signature.detail}
                  </span>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
      <div className="hairline" />
    </div>
  );
}

/** The title's editorial accent: its last word in the serif. */
function accentLastWord(line: string) {
  const cut = line.lastIndexOf(" ") + 1;

  return (
    <>
      {line.slice(0, cut)}
      <span className="serif-italic text-gold-400">{line.slice(cut)}</span>
    </>
  );
}

/** The sentence turns at the comma: left to itself, `balance` strands « en » on the first line. */
function breakAfterComma(title: string) {
  const cut = title.indexOf(", ") + 1;
  if (!cut) return title;

  return (
    <>
      <span className="block">{title.slice(0, cut)}</span>{" "}
      <span className="block">{title.slice(cut + 1)}</span>
    </>
  );
}

function formatIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

// A gold copy of the name fades in over it: only opacity animates, the text stays one node.
const NAME_HOVER =
  "absolute inset-0 text-gold-400 opacity-0 transition-opacity duration-300 fine:group-hover:opacity-100";

// A half of the loop has to outrun the widest screen, or a gap opens before it restarts.
const MARQUEE_HALF = Array.from({ length: 4 }, () => MARQUEE_ITEMS).flat();
const MARQUEE_TRACK = [...MARQUEE_HALF, ...MARQUEE_HALF];
