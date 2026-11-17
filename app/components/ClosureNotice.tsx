import { CLOSURE_NOTICE, CONTACT } from "@/lib/site-content";
import { getSiteSettings } from "@/lib/site-settings.server";
import { ArrowUpRight } from "lucide-react";

/**
 * On every page while the café is closed for a while, switched in `/admin/site`: nobody
 * should find out at the door. In both languages from tablet width up, since the same bar
 * sits on `/en`.
 */
export async function ClosureNotice() {
  const { isTemporarilyClosed } = await getSiteSettings();
  if (!isTemporarilyClosed) return null;

  return (
    <aside className="closure-notice" aria-label={CLOSURE_NOTICE.status}>
      <span className="closure-notice__dot" aria-hidden="true" />
      <p>
        <strong className="font-semibold">{CLOSURE_NOTICE.status}</strong>
        {/* Two lines on a phone: the English words wait for a wider screen. */}
        <span lang="en" className="hidden sm:inline">
          {" "}
          · Temporarily closed
        </span>
      </p>
      <a
        href={CONTACT.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="closure-notice__link"
      >
        {LINK_LABEL}
        <span className="sr-only"> (nouvel onglet)</span>
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
      </a>
    </aside>
  );
}

const LINK_LABEL = "Réouverture sur Instagram";
