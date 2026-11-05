"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { slideImageSrc, type SlideDeck } from "../slide-decks";
import { Ja } from "./ja";

/* One slide at a time, at its own 16:9 shape. Arrow buttons, ←/→ while
   anything in the viewer has focus, and a horizontal swipe all turn the
   page. The pages on either side and the two jump targets are fetched
   ahead, and the <img> is reused rather than remounted, so the browser keeps
   the previous slide on screen until the next one has loaded instead of
   showing a blank frame. The PDF is linked for anyone who wants the whole
   file. */

type SlideDeckViewerProps = {
  deck: SlideDeck;
};

export function SlideDeckViewer({ deck }: SlideDeckViewerProps) {
  const total = deck.pageTitles.length;
  const [page, setPage] = useState(1);
  const swipeFrom = useRef<number | null>(null);

  const clamp = useCallback(
    (n: number) => Math.min(total, Math.max(1, n)),
    [total],
  );
  const go = useCallback((n: number) => setPage(clamp(n)), [clamp]);
  // relative moves read the latest page, so fast repeated presses all count
  const step = useCallback(
    (delta: number) => setPage((current) => clamp(current + delta)),
    [clamp],
  );

  useEffect(() => {
    const ahead = [page - 1, page + 1, 1, deck.mainPages + 1];
    for (const target of ahead) {
      if (target < 1 || target > total || target === page) continue;
      const img = new window.Image();
      img.src = slideImageSrc(deck, target);
    }
  }, [deck, page, total]);

  const inAppendix = page > deck.mainPages;
  const title = deck.pageTitles[page - 1];

  return (
    // the keys work from the buttons too, so a click can be followed by →
    <div
      className="slide-viewer"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          step(1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          step(-1);
        }
      }}
    >
      <figure
        className="slide-viewer-frame"
        tabIndex={0}
        aria-roledescription="スライド"
        aria-label={`${deck.title}（←→ キーでページを移動）`}
        onPointerDown={(event) => {
          swipeFrom.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (swipeFrom.current === null) return;
          const dx = event.clientX - swipeFrom.current;
          swipeFrom.current = null;
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
        }}
        onPointerCancel={() => {
          swipeFrom.current = null;
        }}
      >
        <Image
          src={slideImageSrc(deck, page)}
          alt={title}
          width={1600}
          height={900}
          sizes="(max-width: 1024px) 100vw, 1100px"
          unoptimized
          draggable={false}
        />
      </figure>

      <div className="slide-viewer-bar">
        <div className="slide-viewer-nav">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={page === 1}
            aria-label="前のページ"
          >
            ←
          </button>
          <span className="slide-viewer-count" aria-live="polite">
            {page} / {total}
          </span>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={page === total}
            aria-label="次のページ"
          >
            →
          </button>
        </div>

        <div className="slide-viewer-jump">
          <button
            type="button"
            onClick={() => go(1)}
            aria-pressed={!inAppendix}
          >
            本編 1〜{deck.mainPages}
          </button>
          <button
            type="button"
            onClick={() => go(deck.mainPages + 1)}
            aria-pressed={inAppendix}
          >
            付録 {deck.mainPages + 1}〜{total}
          </button>
          <a href={deck.pdfHref} target="_blank" rel="noreferrer">
            PDF（{deck.pdfSizeLabel}）
          </a>
        </div>
      </div>

      <p className="slide-viewer-title">
        <Ja>{title}</Ja>
      </p>
    </div>
  );
}
