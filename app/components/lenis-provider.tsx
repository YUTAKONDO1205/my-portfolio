"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

// useLayoutEffect warns when React renders this on the server; the scroll reset
// it drives only ever has meaning in the browser.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function LenisProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const startAtTop = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.4,
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Only a link into another page should start at the top: back/forward keeps
  // the position the browser restored, and an anchored URL keeps its section.
  // Every navigation on this site comes from a click, so arming the reset here
  // — rather than inferring it from the pathname change alone — keeps the two
  // apart. (A `#section` click emits popstate too, so a "was this a popstate?"
  // flag would stay armed and silently swallow the next real navigation.)
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as
        | HTMLAnchorElement
        | null;
      if (!anchor) return;
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      startAtTop.current =
        anchor.origin === window.location.origin &&
        (!anchor.target || anchor.target === "_self") &&
        anchor.pathname !== window.location.pathname &&
        !anchor.hash;
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // A route change leaves the window at the previous page's offset (clamped to
  // the new document height) and Lenis keeps lerping from there, so a page
  // entered from further down opens mid-way and glides upward — settling
  // wherever Next's own scrollIntoView lands rather than at the top. Pin both
  // the window and Lenis's internal target to 0 before the first paint.
  useIsomorphicLayoutEffect(() => {
    if (!startAtTop.current) return;
    startAtTop.current = false;

    const pinToTop = () => {
      lenisRef.current?.scrollTo(0, { immediate: true, force: true });
      // `html { scroll-behavior: smooth }` would otherwise animate this.
      window.scrollTo({ top: 0, behavior: "instant" });
    };

    pinToTop();

    // Next runs its own scrollIntoView for the incoming segment, and when that
    // segment mounts a commit later than the pathname update it lands after the
    // pin above and drops the page a little below the top. Hold the top for a
    // few frames so the top wins whichever order the two run in, and let go the
    // moment the visitor actually reaches for the scroll.
    const intents = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    let rafId = 0;
    let releaseTimer = 0;

    const release = () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(releaseTimer);
      for (const intent of intents) {
        window.removeEventListener(intent, release);
      }
    };

    const hold = () => {
      pinToTop();
      rafId = requestAnimationFrame(hold);
    };

    rafId = requestAnimationFrame(hold);
    releaseTimer = window.setTimeout(release, 500);
    for (const intent of intents) {
      window.addEventListener(intent, release, { passive: true });
    }

    return release;
  }, [pathname]);

  return <>{children}</>;
}
