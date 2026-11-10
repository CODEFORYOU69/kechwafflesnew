import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { clsx } from "clsx";
import { Plus } from "lucide-react";
import styles from "./FaqSection.module.css";

/**
 * Questions asked before coming, as native `<details>`: they open without a script, and the
 * answers stay in the HTML for search engines and AI crawlers.
 */
export function FaqSection({
  eyebrow,
  titleLines,
  items,
}: {
  eyebrow: string;
  titleLines: string[];
  items: FaqItem[];
}) {
  return (
    <section
      aria-labelledby="faq-title"
      className="section-rise section-pad bg-cream-100 text-espresso-950"
    >
      <div className={clsx("page-x", styles.faq)}>
        <div className={styles.faqHead}>
          <Reveal>
            <p className="text-eyebrow text-terracotta-700">{eyebrow}</p>
          </Reveal>
          <RevealLines id="faq-title" lines={titleLines} className="text-section mt-6" />
        </div>

        <Reveal y={24} className={styles.faqList}>
          {items.map((item) => (
            <details key={item.id} id={`question-${item.id}`} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                <span className="text-headline">{item.question}</span>
                <Plus className={styles.faqIcon} aria-hidden="true" />
              </summary>
              <p className={styles.faqAnswer}>{item.answer}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/** The same questions as a schema.org `FAQPage`, for the page that shows them. */
export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

type FaqItem = { id: string; question: string; answer: string };
