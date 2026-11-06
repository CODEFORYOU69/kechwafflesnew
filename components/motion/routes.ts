/**
 * Application routes keep the browser's native behaviour: no smooth scroll,
 * no page curtain. Forms and tables there must feel immediate.
 */
const APP_ROUTES = ["/admin", "/concours", "/loyalty", "/api"];

export function isAppRoute(pathname: string | null | undefined) {
  if (!pathname) return false;
  return APP_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
