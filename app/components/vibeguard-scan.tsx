"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { vibeguardStats } from "../portfolio-data";
import styles from "./vibeguard-scan.module.css";

/* ==========================================================================
   VibeGuard, scanning.

   A live re-enactment of the product on its own sample corpus. The file,
   the lines and the finding are real — samples/vulnerable/auth_bypass.py in
   the repository, and rule VG-AUTH-001 as the analyzer reports it — so the
   demo says nothing the tool would not say itself. The loop: the file is
   read, the scan line sweeps, the finding lands, the status settles.
   ========================================================================== */

const FILE = "samples/vulnerable/auth_bypass.py";

const LINES = [
  "DEBUG = False",
  "",
  "",
  "def is_authorised(user):",
  "    if DEBUG:",
  "        return True  # AI-prone: debug bypass left in",
  '    if user.token == "changeme":',
  "        return True",
  "    # TODO: add proper auth validation here",
  "    return user.is_admin",
] as const;

const HIT = {
  start: 5,
  end: 6,
  rule: "VG-AUTH-001",
  severity: "critical",
  confidence: "medium",
  title: "Authentication bypass when DEBUG is enabled",
  how: "Remove the bypass, or gate it behind an explicit non-production check that fails closed.",
} as const;

type Phase = "idle" | "typing" | "scanning" | "found" | "done";

const ORDER: Record<Phase, number> = {
  idle: 0,
  typing: 1,
  scanning: 2,
  found: 3,
  done: 4,
};

const LINE_H = 22;

const STATUS: Record<Phase, string> = {
  idle: `analyzer-core · standard · ${vibeguardStats.rules} rules`,
  typing: "reading file…",
  scanning: `scanning ${vibeguardStats.rules} rules…`,
  found: "1 finding",
  done: "1 finding · critical · 0 bytes left the device",
};

export function VibeGuardScan() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const timers = [
      window.setTimeout(() => setPhase("typing"), 250),
      window.setTimeout(() => setPhase("scanning"), 1500),
      window.setTimeout(() => setPhase("found"), 3000),
      window.setTimeout(() => setPhase("done"), 3800),
      window.setTimeout(() => setPhase("idle"), 11200),
      window.setTimeout(() => setCycle((c) => c + 1), 11900),
    ];
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [inView, cycle, reduceMotion]);

  const current: Phase = reduceMotion ? "done" : phase;
  const at = ORDER[current];
  const linesVisible = at >= ORDER.typing;
  const hit = at >= ORDER.found;
  const scanning = current === "scanning";
  const caretY = at >= ORDER.scanning ? HIT.end * LINE_H : 0;
  const caretOpacity = scanning ? 1 : current === "found" ? 0.55 : 0;

  return (
    <div
      ref={ref}
      className={styles.scan}
      role="img"
      aria-label={`VibeGuard が ${FILE} を走査し、${HIT.start}–${HIT.end} 行目に ${HIT.rule}（${HIT.severity}）「${HIT.title}」を検出する様子`}
    >
      <div className={styles.head}>
        <span>{FILE}</span>
        <span className={styles.status} data-phase={current}>
          <i aria-hidden="true" />
          {STATUS[current]}
        </span>
      </div>

      <pre className={styles.code} aria-hidden="true">
        <ol>
          {LINES.map((text, index) => {
            const n = index + 1;
            const isHit = hit && n >= HIT.start && n <= HIT.end;
            return (
              <motion.li
                key={n}
                data-hit={isHit ? "true" : undefined}
                initial={false}
                animate={{
                  opacity: linesVisible ? 1 : 0,
                  x: linesVisible ? 0 : -8,
                }}
                transition={{
                  duration: 0.32,
                  delay: linesVisible ? index * 0.08 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span>{n}</span>
                <code>{text || " "}</code>
              </motion.li>
            );
          })}
        </ol>
        <motion.i
          className={styles.caret}
          initial={false}
          animate={{ y: caretY, opacity: caretOpacity }}
          transition={{
            y: { duration: scanning ? 1.35 : 0.2, ease: "linear" },
            opacity: { duration: 0.3 },
          }}
        />
      </pre>

      <motion.div
        className={styles.finding}
        initial={false}
        animate={{ opacity: hit ? 1 : 0, y: hit ? 0 : 8 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!hit}
      >
        <span className={styles.rule}>
          {HIT.rule} · {HIT.severity} · confidence {HIT.confidence} · L
          {HIT.start}–{HIT.end}
        </span>
        <strong>{HIT.title}</strong>
        <p>{HIT.how}</p>
      </motion.div>
    </div>
  );
}
