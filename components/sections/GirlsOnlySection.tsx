import { MagneticButton } from "@/components/motion/MagneticButton";
import { IntroFade, IntroLines, Reveal, RevealLines } from "@/components/motion/Reveal";
import { GIRLS_ONLY } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./GirlsOnlySection.module.css";
import { WeekStrip } from "./WeekStrip";

/**
 * The terracotta wall of the café, as a poster: two days, too big for the frame.
 * Then what happens on those days, the arcade of the week, and how to come: just come.
 */
export function GirlsOnlySection() {
  const sectionNumber = GIRLS_ONLY.eyebrow.split(" ")[0];

  return (
    <section
      id="girls-only"
      aria-labelledby="girls-only-title"
      className={cn("section-rise section-pad", styles.wall)}
    >
      <h2 id="girls-only-title" className="sr-only">
        {GIRLS_ONLY.titleSr}
      </h2>

      <GirlsOnlyPoster />

      <div className="page-x">
        <ul className={styles.moments}>
          {GIRLS_ONLY.moments.map((moment, index) => (
            <li key={moment.id} className={styles.moment}>
              <Reveal delay={index * 0.08}>
                <p className={cn("text-eyebrow", styles.momentIndex)}>
                  {`${sectionNumber}.${index + 1}`}
                </p>
                <h3 className={styles.momentName}>{moment.name}</h3>
                <p className={styles.momentDetail}>{moment.detail}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <WeekStrip />

        <GirlsOnlyAccess
          secondaryAction={
            <MagneticButton className={styles.actionWrap}>
              <Link href="/girls-only#programme" className={cn("cta cta--outline", styles.actionLink)}>
                <span className="cta__label">{GIRLS_ONLY.programmeCta}</span>
              </Link>
            </MagneticButton>
          }
        />
      </div>
    </section>
  );
}

/** No booking on those days: the café simply belongs to them. */
export function GirlsOnlyAccess({ secondaryAction }: { secondaryAction?: ReactNode }) {
  return (
    <div className={styles.access}>
      <RevealLines
        as="h3"
        lines={GIRLS_ONLY.accessLines}
        className={cn("text-section", styles.accessTitle)}
      />
      <Reveal delay={0.1} className={styles.accessBody}>
        <p className="text-subhead">{GIRLS_ONLY.accessText}</p>
        <div className={styles.actions}>
          <MagneticButton className={styles.actionWrap}>
            <Link href="/location" className={cn("cta cta--cream", styles.actionLink)}>
              <span className="cta__label">{GIRLS_ONLY.accessCta}</span>
            </Link>
          </MagneticButton>
          {secondaryAction}
        </div>
      </Reveal>
    </div>
  );
}

/**
 * Mardi and Jeudi as visuals: the heading that names them belongs to the caller.
 * `isPageOpening`: on the first screen, the entrance must not wait for the script.
 */
export function GirlsOnlyPoster({
  children,
  isPageOpening = false,
}: {
  children?: ReactNode;
  isPageOpening?: boolean;
}) {
  const Lines = isPageOpening ? IntroLines : RevealLines;
  const Fade = isPageOpening ? IntroFade : Reveal;

  return (
    <div className={styles.poster}>
      <p className={cn("text-eyebrow", styles.posterEyebrow)}>
        {isPageOpening ? GIRLS_ONLY_NAME : GIRLS_ONLY.eyebrow}
      </p>

      <div className={styles.dayMardi} aria-hidden="true">
        <Lines as="p" lines={[GIRLS_ONLY.days[0]]} className={cn("text-mega", styles.day)} />
      </div>

      <div className={styles.dayJeudi} aria-hidden="true">
        <Lines
          as="p"
          lines={[GIRLS_ONLY.days[1]]}
          delay={0.12}
          className={cn("text-mega", styles.day)}
        />
      </div>

      <div className={styles.posterTag} aria-hidden="true">
        <Lines
          as="p"
          lines={GIRLS_ONLY_NAME.split(" ")}
          delay={0.28}
          className={cn("serif-italic", styles.posterTagText)}
        />
      </div>

      <Fade delay={0.2} className={styles.posterIntro}>
        <p className={cn("text-subhead", styles.posterIntroText)}>{GIRLS_ONLY.intro}</p>
        {children}
      </Fade>
    </div>
  );
}

const GIRLS_ONLY_NAME = "Girls Only";
