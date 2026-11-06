import { Fragment, type CSSProperties, type ElementType, type ReactNode } from "react";

/**
 * Fade and rise on entering the viewport. Plain markup, so Server Components can
 * use it for free: `MotionRuntime` watches `[data-reveal]`, CSS does the animation.
 */
export function Reveal({
  children,
  delay = 0,
  y = 32,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const style = {
    "--reveal-delay": `${delay}s`,
    "--reveal-y": `${y}px`,
  } as CSSProperties;

  return (
    <div data-reveal="" className={className} style={style}>
      {children}
    </div>
  );
}

/** A heading whose lines each rise out of their own mask. */
export function RevealLines({
  lines,
  as: Tag = "h2",
  className,
  delay = 0,
  id,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const style = { "--reveal-delay": `${delay}s` } as CSSProperties;

  return (
    <Tag data-reveal="lines" className={className} style={style} id={id}>
      {lines.map((line, index) => (
        <Fragment key={index}>
          <span className="line-mask" style={{ "--line": index } as CSSProperties}>
            <span>{line}</span>
          </span>{" "}
        </Fragment>
      ))}
    </Tag>
  );
}

/**
 * `RevealLines` in pure CSS, for the first screen of a page: the largest paint must
 * not wait for the script that `Reveal` depends on.
 */
export function IntroLines({
  lines,
  as: Tag = "h1",
  className,
  delay = 0,
  id,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  delay?: number;
  id?: string;
}) {
  return (
    <Tag className={className} id={id}>
      {lines.map((line, index) => (
        <Fragment key={index}>
          <span
            className="intro-line"
            style={{ "--line": index, "--intro-delay": `${delay}s` } as CSSProperties}
          >
            <span>{line}</span>
          </span>{" "}
        </Fragment>
      ))}
    </Tag>
  );
}

/** `Reveal` in pure CSS, same reason as `IntroLines`. */
export function IntroFade({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const style = { "--intro-delay": `${delay}s` } as CSSProperties;

  return (
    <div className={className ? `intro-fade ${className}` : "intro-fade"} style={style}>
      {children}
    </div>
  );
}
