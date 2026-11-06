"use client";

import { MagneticButton } from "@/components/motion/MagneticButton";
import { prefersReducedMotion } from "@/components/motion/routes";
import { AI_CAFE, whatsappUrl } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useId, useState, type MouseEvent, type ReactNode } from "react";
import styles from "./AICafeSection.module.css";

/**
 * A static help desk dressed as a terminal, not a chat: each request prints a canned
 * answer, and the real conversation starts on WhatsApp. The first request is selected
 * on the server with its whole output, so the window works and reads without script.
 */
export function ServiceTerminal() {
  const titleId = useId();
  const promptId = useId();
  // Until the visitor picks something, the prefilled message must not speak for them.
  const [run, setRun] = useState<Run>({
    request: REQUESTS[0],
    count: 0,
    isChosen: false,
    isTyped: false,
  });
  const { request, count, isChosen, isTyped } = run;
  const message = isChosen ? request.message : AI_CAFE.ctaDefaultMessage;

  function choose(next: ServiceRequest, event: MouseEvent<HTMLButtonElement>) {
    const isReduced = prefersReducedMotion();
    setRun({ request: next, count: count + 1, isChosen: true, isTyped: !isReduced });
    revealChip(event.currentTarget, isReduced);
  }

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className={styles.terminal}
      data-request-index={REQUESTS.indexOf(request)}
    >
      <div className={styles.terminalBar}>
        <DoorGlyph />
        <p id={titleId} className={styles.terminalTitle}>
          {AI_CAFE.terminalTitle}
        </p>
        <p className={styles.terminalNote}>{NOT_A_CHAT_NOTE}</p>
      </div>

      <div className={styles.terminalBody}>
        <p id={promptId} className={styles.prompt}>
          <span className={styles.promptMark} aria-hidden="true">
            ?
          </span>
          {AI_CAFE.terminalPrompt}
        </p>

        <div role="group" aria-labelledby={promptId} className={cn(styles.chips, "no-scrollbar")}>
          {REQUESTS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === request.id}
              className={styles.chip}
              onClick={(event) => choose(item, event)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.screen}>
          <Reserved texts={COMMANDS} className={styles.command} isDecorative>
            <span className={styles.commandMark}>$ </span>
            {request.command}
          </Reserved>

          {/* One announcement per choice: the typed copy is hidden from assistive tech. */}
          <div aria-live="polite" aria-atomic="true">
            <p className="sr-only">{request.output}</p>
            <Reserved texts={OUTPUTS} className={styles.output} isDecorative>
              <TypedOutput key={count} text={request.output} isTyped={isTyped} />
            </Reserved>
          </div>
        </div>
      </div>

      <div className={styles.terminalFoot}>
        <div className={styles.messagePreview}>
          <p className={styles.messageLabel}>{MESSAGE_LABEL}</p>
          <Reserved texts={MESSAGES} className={styles.messageText}>
            {message}
          </Reserved>
        </div>
        <MagneticButton>
          <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="cta cta--zellige"
          >
            <span className="cta__label">{AI_CAFE.ctaLabel}</span>
            <span className="sr-only"> {NEW_TAB_NOTE}</span>
            <ArrowUpRight className="cta__arrow size-4" aria-hidden="true" />
          </a>
        </MagneticButton>
      </div>
    </div>
  );
}

/** Prints the text one character at a time; remounted by key on every choice. */
function TypedOutput({ text, isTyped }: { text: string; isTyped: boolean }) {
  const [length, setLength] = useState(isTyped ? 0 : text.length);

  useEffect(() => {
    if (!isTyped) return;

    let timer: ReturnType<typeof setTimeout>;
    let next = 0;

    function typeNext() {
      next += 1;
      setLength(next);
      if (next < text.length) timer = setTimeout(typeNext, charDelay(text[next - 1]));
    }

    timer = setTimeout(typeNext, COMMAND_PAUSE_MS);
    return () => clearTimeout(timer);
  }, [text, isTyped]);

  return (
    <>
      {text.slice(0, length)}
      <span
        className={styles.cursor}
        data-typing={length < text.length ? "" : undefined}
        data-pause-offscreen=""
      />
      {/* Holds the line breaks in place, so words never jump lines while typing. */}
      <span className={styles.outputRest}>{text.slice(length)}</span>
    </>
  );
}

/**
 * Stacks the visible text over invisible copies of its longest siblings, so choosing
 * another request never changes the height of the window, nor moves the page.
 */
function Reserved({
  texts,
  className,
  isDecorative = false,
  children,
}: {
  texts: readonly string[];
  className: string;
  /** Hides the visible text from assistive tech too. */
  isDecorative?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={styles.reserved}>
      {texts.map((text) => (
        <p key={text} className={cn(className, styles.reservedCopy)}>
          {text}
        </p>
      ))}
      <p className={className} aria-hidden={isDecorative || undefined}>
        {children}
      </p>
    </div>
  );
}

/** The door of the logo at a few pixels high: stands in for the usual window controls. */
function DoorGlyph() {
  return (
    <svg viewBox="0 0 12 14" className={styles.doorGlyph} aria-hidden="true" focusable="false">
      <path d="M1 14V5h1V3h1V2h2V1h2v1h2v1h1v2h1v9H9V5H8V4H4v1H3v9z" />
    </svg>
  );
}

/** Below the wrap breakpoint the chips scroll sideways: keep the chosen one in sight. */
function revealChip(chip: HTMLElement, isReduced: boolean) {
  const strip = chip.parentElement;
  if (!strip || strip.scrollWidth <= strip.clientWidth) return;

  strip.scrollTo({
    left: chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2,
    behavior: isReduced ? "auto" : "smooth",
  });
}

/** A short pause on punctuation is what makes it read like someone typing. */
function charDelay(character: string) {
  return /[.,:?!]/.test(character) ? PUNCTUATION_DELAY_MS : CHARACTER_DELAY_MS;
}

const REQUESTS = AI_CAFE.requests;
const COMMANDS = REQUESTS.map((item) => `$ ${item.command}`);
const OUTPUTS = REQUESTS.map((item) => item.output);
const MESSAGES = [AI_CAFE.ctaDefaultMessage, ...REQUESTS.map((item) => item.message)];

const COMMAND_PAUSE_MS = 260;
const CHARACTER_DELAY_MS = 16;
const PUNCTUATION_DELAY_MS = 110;

// Missing from lib/site-content.ts, listed in the report.
const NOT_A_CHAT_NOTE = "Aperçu, pas un chat";
const MESSAGE_LABEL = "Message préparé";
const NEW_TAB_NOTE = "sur WhatsApp, dans un nouvel onglet";

type ServiceRequest = (typeof AI_CAFE.requests)[number];
type Run = {
  request: ServiceRequest;
  /** Restarts the typing, even when the same request is chosen twice. */
  count: number;
  isChosen: boolean;
  isTyped: boolean;
};
