import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { AI_CAFE, GIRLS_ONLY } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import styles from "./AICafeSection.module.css";
import { AccentedPeriod, KuficCircuit } from "./KuficCircuit";
import { ServiceTerminal } from "./ServiceTerminal";

/**
 * Pillar D. One current runs through the section: the logo's kufic turns into wiring,
 * plugs into the terminal, and comes out again towards the three pillars.
 */
export function AICafeSection() {
  return (
    <section
      id="cafe-ia"
      aria-labelledby="cafe-ia-title"
      className={cn("section-rise section-pad bg-espresso-950 text-cream-50", styles.section)}
    >
      <div className={cn("page-x", styles.stage)}>
        <div className={styles.lead}>
          <div className={styles.leadText}>
            <p className="text-eyebrow text-zellige-400">{AI_CAFE.eyebrow}</p>
            <RevealLines
              id="cafe-ia-title"
              lines={[
                AI_CAFE.titleLines[0],
                <span key="indent" className={styles.titleIndent}>
                  <AccentedPeriod line={AI_CAFE.titleLines[1]} />
                </span>,
              ]}
              className={cn("text-section", styles.title)}
            />
            <Reveal delay={0.12} className={styles.intro}>
              <p className="text-subhead text-pretty text-cream-300">{AI_CAFE.intro}</p>
            </Reveal>
          </div>
          <KuficCircuit variant="section" className={styles.leadCircuit} />
        </div>

        <div className={styles.terminalRow}>
          <Reveal y={48}>
            <ServiceTerminal />
            <p className="mt-3 text-[0.9375rem] text-cream-300">{GIRLS_ONLY.closedNote}</p>
          </Reveal>
        </div>

        <KuficCircuit variant="bus" />

        <div className={styles.pillarsRow}>
          <ul className={styles.pillars}>
            {AI_CAFE.pillars.map((pillar, index) => (
              <li key={pillar.id} className={styles.pillar}>
                <Reveal delay={index * 0.08} y={20}>
                  <p className={styles.pillarIndex}>{String(index + 1).padStart(2, "0")}</p>
                  <h3 className={styles.pillarName}>{pillar.name}</h3>
                  <p className={styles.pillarDetail}>{pillar.detail}</p>
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal delay={0.24} y={20} className={styles.pillarLink}>
            <MagneticButton>
              <Link href="/cafe-ia" className="cta cta--outline">
                <span className="cta__label">{AI_CAFE.pageCta}</span>
                <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
              </Link>
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
