---
name: 3d-scroll-website
description: Build premium 3D scroll-animated websites end-to-end — Next.js + canvas frame-sequence playback, Lenis smooth scroll, Framer Motion reveals, neumorphic/glassmorphic design, and performance hardening. Use this whenever the user mentions a 3D scroll website, hero animation, scroll-driven interaction, frame sequence (Apple AirPods-style), sticky canvas, AI/tech cinematic landing page, Three.js / React Three Fiber, GSAP ScrollTrigger, Framer Motion, neumorphism, glassmorphism, or any Igloo / Lusion / Active Theory–style site. Use it EVEN IF the user doesn't say "3D" — phrases like "scroll animation", "frame sequence", "premium landing page", or "AIっぽいヒーロー演出" are signals to use this skill. This is the entire pipeline in one file: stack, scaffolding, frame-sequence engine, scroll math, design system, component architecture, performance rules, and prompting tips. Don't stitch partial answers when this skill covers it end-to-end.
---

# 🚀 3D Scroll Website — Ultimate Skill

You are the builder of premium 3D scroll-animated sites. The user brings the idea; **you ship the whole site**. Futuristic, trustworthy, AI/tech, cinematic, smooth, motion-friendly — that's the feel.

---

## 1. Mental Model — what "3D scroll" actually is

The "3D feel" on high-end agency sites is **almost never runtime WebGL**. It's a **pre-rendered image sequence** (100–120 frames from Blender / Cinema 4D / After Effects) that a `<canvas>` scrubs through based on scroll position. The viewport is `sticky` while a tall parent section drives the scroll. That's the trick.

Everything else is polish:
- **Lenis** — physics-based smooth scroll
- **Framer Motion** — section reveals, springs, AnimatePresence
- **CSS 3D transforms** — small cubes/orbs without WebGL
- **SVG `offset-path`** — circuit-style traveling dots
- **Neumorphic + glassmorphic** design tokens

If the user says "3Dヒーローをスクロールに合わせて動かしたい" — they mean a sticky canvas with a frame sequence. **Start there.** Don't reach for Three.js unless they explicitly want interactive 3D.

### When to reach for real 3D (Three.js / R3F) instead

- Scene must respond to **mouse/drag/gestures**
- Need **real-time lighting, physics, or procedural geometry**
- Scene has too many states to pre-render cleanly

For everything else — frame sequence wins. Faster on mobile, never janks, fully art-directable in a real 3D tool.

---

## 2. The Stack (pinned, battle-tested)

| Layer | Package | Version | Why |
|---|---|---|---|
| Framework | `next` | 16.2.2 | App Router, RSC, image optimization |
| UI | `react` | 19.2.4 | Concurrent features |
| Styling | `tailwindcss` | v4 | `@import "tailwindcss"`, `@theme inline` |
| Animation | `framer-motion` | 12.38.0 | Reveals, AnimatePresence, springs |
| Smooth scroll | `lenis` | 1.3.21 | Physics-based, Safari-safe |
| Icons | `@phosphor-icons/react` | 2.1.10 | SSR-safe via `/dist/ssr` |
| Fonts | `geist` | 1.7.0 | Clean sans + mono |

> ⚠️ **Pin these.** Next.js 16 has breaking changes from 13/14/15 — older training data lies. Read `node_modules/next/dist/docs/` before writing routes/metadata/image configs.

**Optional add-ons** (only when explicitly needed):
- `three` + `@react-three/fiber` + `@react-three/drei` — true interactive 3D
- `gsap` + `ScrollTrigger` — when you want pinning/scrubbing without the sticky-canvas trick

### Install

```bash
npx create-next-app@latest my-3d-site --typescript --tailwind --app --src-dir
cd my-3d-site
npm install framer-motion lenis @phosphor-icons/react geist
```

---

## 3. Build Order (do not deviate)

Build sections one at a time, top to bottom, **and check each in a real browser before moving on**. Skipping ahead always backfires — scroll-math bugs are hard to debug against a half-built page.

1. **Scaffold** — `create-next-app`, install deps, set up `layout.tsx` with Geist + `SmoothScrollProvider`.
2. **Design tokens** — Neumorphic shadow stack, palette, font vars in `globals.css`. Everything pulls from here.
3. **Primitives** — `AnimatedSection`, `AnimatedItem`, `Button`, `EyebrowBadge`. Reused everywhere.
4. **Hero (frame-sequence canvas)** — The signature section. Hardest part; anchors the page. Get it right first.
5. **ProjectsShowcase / Tunnel** — Same pattern, different frame set.
6. **Supporting sections** — Bento features, services, process, testimonials, FAQ. Framer Motion + neumorphic cards.
7. **Final CTA** — SVG path animation (CPU-architecture style) or dramatic horizon reveal.
8. **Polish** — Navbar scroll detection, mobile hamburger, Calendly/contact, real-device responsive review.

---

## 4. Frame-Sequence Engine — the core technique

Get it right and everything feels premium. Get it wrong and it stutters on every scroll.

### 4.1 Structure

```tsx
<section style={{ height: "400vh" }} className="scroll-animation">
  <div className="sticky top-0 h-screen">
    <canvas ref={canvasRef} className="h-full w-full" />
    {/* Annotation cards positioned absolutely over the canvas */}
  </div>
</section>
```

- Outer section `400vh` (or `500vh` for longer animations) creates scroll distance.
- Inner wrapper `sticky top-0 h-screen` pins to viewport while parent scrolls.
- Canvas fills the pinned wrapper.

### 4.2 Responsive heights

```css
@media (max-width: 1024px) { .scroll-animation { height: 350vh !important; } }
@media (max-width: 768px)  { .scroll-animation { height: 300vh !important; } }
```

### 4.3 Frame preloading (mandatory)

```tsx
const FRAME_COUNT = 106;

useEffect(() => {
  let loadedCount = 0;
  const imgs: HTMLImageElement[] = [];
  for (let i = 1; i <= FRAME_COUNT; i++) {
    const img = new Image();
    img.src = `/frames/frame_${String(i).padStart(4, "0")}.jpg`;
    img.onload = () => {
      loadedCount++;
      setLoadProgress(loadedCount / FRAME_COUNT);   // drives loading bar
      if (loadedCount === FRAME_COUNT) setLoaded(true);
    };
    imgs.push(img);
  }
  framesRef.current = imgs;
}, []);
```

Show a loading overlay with **real progress** until `loaded === true`. Skipping this = blank flashing canvas = broken-looking site.

### 4.4 The four things the scroll handler does

```tsx
const tickingRef = useRef(false);

const handleScroll = () => {
  if (tickingRef.current) return;       // ① guard against stacked RAFs
  tickingRef.current = true;

  requestAnimationFrame(() => {
    // ② Compute progress
    const rect = section.getBoundingClientRect();
    const scrollableHeight = section.offsetHeight - window.innerHeight;
    const progress = Math.min(1, Math.max(0, -rect.top / scrollableHeight));

    // ③ Pick a frame
    const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
    drawFrame(frameIndex);

    // ④ Update text opacity (direct DOM, no React state)
    if (heroTextRef.current) {
      heroTextRef.current.style.opacity = String(Math.max(0, 1 - progress / 0.08));
    }

    // ⑤ Toggle visible cards (React state ONLY when set actually changes)
    const newIds = [...newVisible].sort().join(",");
    if (newIds !== prevVisibleIdsRef.current) {
      prevVisibleIdsRef.current = newIds;
      setVisibleCards(newVisible);
    }

    tickingRef.current = false;
  });
};

window.addEventListener("scroll", handleScroll, { passive: true });
```

### 4.5 Cover-fit drawing + DPR scaling

```tsx
const drawFrame = (index: number) => {
  const img = framesRef.current[index];
  if (!img?.complete) return;
  const cw = canvas.width, ch = canvas.height;
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = cw / ch;
  let drawW, drawH;
  if (canvasRatio > imgRatio) { drawW = cw; drawH = cw / imgRatio; }
  else                         { drawH = ch; drawW = ch * imgRatio; }
  if (window.innerWidth <= 768) { drawW *= 1.3; drawH *= 1.3; }   // mobile zoom
  ctx.drawImage(img, (cw - drawW) / 2, (ch - drawH) / 2, drawW, drawH);
};

const resizeCanvas = () => {
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = window.innerWidth  * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width  = window.innerWidth  + "px";
  canvas.style.height = window.innerHeight + "px";
};
```

### 4.6 Annotation cards — visibility zones

```tsx
const annotations = [
  { id: "card-1", show: 0.10, hide: 0.30 },
  { id: "card-2", show: 0.35, hide: 0.55 },
  { id: "card-3", show: 0.60, hide: 0.80 },
];
// Use CSS transitions (not Framer Motion) for these — lighter on hot path
className={`transition-all duration-400 ${visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
```

### 4.7 Non-negotiable performance rules

- ✅ **RAF + ticking ref.** One queued callback at a time.
- ✅ **Direct DOM for hot updates.** Canvas, opacity, transform — via refs only.
- ✅ **React state only for discrete state changes** (visible-card set, CTA shown). Diff before `setState`.
- ✅ **Preload all frames** with a real progress bar.
- ✅ **DPR-aware canvas.** `canvas.width = innerWidth * dpr`.
- ✅ **Passive scroll listeners.** `{ passive: true }`.
- ✅ **Hardware accel** on sticky containers: `will-change: transform; transform: translateZ(0)`.

---

## 5. Smooth Scroll (Lenis)

Wrap the app in a `SmoothScrollProvider` client component. Lenis integrates naturally with RAF scroll handlers — no special bridge.

```tsx
"use client";
import { ReactLenis } from "lenis/react";

const options = {
  lerp: 0.1,           // higher = snappier; Safari-safe
  smoothWheel: true,
  syncTouch: false,    // disable on iOS to prevent stutter
};

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return <ReactLenis root options={options}>{children}</ReactLenis>;
}
```

**Get this in place BEFORE building the hero** — the scroll math feels different with Lenis vs native.

---

## 6. Framer Motion patterns (non-canvas animations)

### 6.1 AnimatedSection + AnimatedItem (foundation)

```tsx
const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
};

<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
>
  <motion.div variants={itemVariants}>...</motion.div>
</motion.div>
```

### 6.2 Spring config reference

| Use case | stiffness | damping |
|---|---|---|
| Default scroll reveal | 100 | 20 |
| Soft hero entrance | 80 | 20 |
| FAQ accordion (snappy) | 200 | 25 |
| Mobile menu (fast) | 300 | 30 |
| Slow dramatic reveal | 60 | 18 |

### 6.3 Infinite rotations

```tsx
<motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} />
```

### 6.4 CSS 3D cube (no WebGL)

```tsx
<div style={{ perspective: 600 }}>
  <motion.div
    style={{ transformStyle: "preserve-3d", width: 120, height: 120 }}
    animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    <div style={{ ...face, transform: "translateZ(60px)" }} />
    <div style={{ ...face, transform: "rotateY(180deg) translateZ(60px)" }} />
    <div style={{ ...face, transform: "rotateY(90deg) translateZ(60px)" }} />
    <div style={{ ...face, transform: "rotateY(-90deg) translateZ(60px)" }} />
    <div style={{ ...face, transform: "rotateX(90deg) translateZ(60px)" }} />
    <div style={{ ...face, transform: "rotateX(-90deg) translateZ(60px)" }} />
  </motion.div>
</div>
```

### 6.5 SVG `offset-path` traveling dots

```css
.cpu-line-1 {
  offset-path: path("M 10 20 h 79.5 q 5 0 5 5 v 30");
  animation: cpu-path-animation 5s cubic-bezier(0.75,-0.01,0,0.99) infinite;
}
@keyframes cpu-path-animation { 0% { offset-distance: 0%; } 100% { offset-distance: 100%; } }
```

### 6.6 FAQ accordion

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    />
  )}
</AnimatePresence>
```

---

## 7. Design System

### 7.1 Neumorphic shadow (the signature)

```css
--card-shadow:
  0px 0.7px  0.7px  -0.67px rgba(0,0,0,0.08),
  0px 1.8px  1.8px  -1.33px rgba(0,0,0,0.08),
  0px 3.6px  3.6px  -2px    rgba(0,0,0,0.07),
  0px 6.9px  6.9px  -2.67px rgba(0,0,0,0.07),
  0px 13.6px 13.6px -3.33px rgba(0,0,0,0.05),
  0px 30px   30px   -4px    rgba(0,0,0,0.02),
  inset 0px 3px 1px 0px rgba(255,255,255,1);
```

⚠️ **Don't replace this with a single shadow.** The 6-layer stack + inset highlight is what makes it feel 3D.

### 7.2 Glassmorphism

| Use | Classes |
|---|---|
| Eyebrow badge | `bg-white/40 backdrop-blur-md border border-white/60` |
| Navbar (light) | `bg-white/40 backdrop-blur-2xl backdrop-saturate-150 border-white/30` |
| Navbar (over dark) | `bg-black/70 backdrop-blur-xl border-white/15` |
| Project card (dark) | `bg-black/50 backdrop-blur-2xl border border-white/10` |

### 7.3 Palette

| Variable | Value | Usage |
|---|---|---|
| `--background` | `#f5f5f5` | Page background |
| `--foreground` | `#09090b` | Primary text |
| `--card-bg` | `#ffffff` | Cards |
| `--muted` | `#71717a` | Secondary text |

Zinc 50–950 for neutrals. Accent: `indigo-500` → `violet-500` gradient. `amber-400` for ratings. **Don't add extra colors.**

### 7.4 Typography (Geist)

| Element | Classes |
|---|---|
| H1 hero | `text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tighter` |
| H2 section | `text-3xl md:text-5xl font-semibold tracking-tighter` |
| H3 card | `text-lg font-semibold tracking-tight` |
| Body | `text-lg leading-relaxed` |
| Eyebrow | `text-[10px] font-medium tracking-wider uppercase` |

Max-widths: headings `18–22ch`, body `48–55ch`, container `max-w-[1400px]`.

### 7.5 Spacing & layout

```tsx
// Section
className="px-6 py-24 md:px-8 md:py-32"
// Container
className="mx-auto max-w-[1400px]"
// Cards
className="p-7 max-md:p-4 rounded-[20px]"
```

### 7.6 Avoid (always)

- Cheap neon overload
- Unreadable motion
- Too many colors
- Hard cuts in looping visuals
- Heavy assets without optimization
- Single flat shadow on cards (kills the neumorphic feel)

---

## 8. Component Architecture

```
src/
├── app/
│   ├── layout.tsx          ← fonts, providers, metadata
│   ├── page.tsx            ← composes sections in order
│   └── globals.css         ← tokens, utilities
├── components/
│   ├── sections/           ← Hero, ProjectsShowcase, BentoFeatures, FAQ, FinalCTA, …
│   ├── ui/                 ← AnimatedSection, Button, EyebrowBadge, NeumorphicAssets
│   └── providers/          ← SmoothScrollProvider, CalendlyProvider
└── lib/
    └── calendly.ts
public/
├── frames/                 ← 100+ hero frames
└── tunnel-frames/          ← 90+ tunnel frames
```

### SSR rules (the #1 source of bugs)

- Any component using `useState`/`useEffect`/`useRef`/Framer Motion → **`"use client"`**.
- Phosphor icons in **server** components: `import { ... } from "@phosphor-icons/react/dist/ssr"`.
- Phosphor icons in **client** components: regular path.
- `metadata` export must come from a server component. If the page needs client features, render a `<ClientPage />` inside.

### Naming

| Type | Convention | Example |
|---|---|---|
| Section | PascalCase descriptive | `CoreServices`, `ProjectsShowcase` |
| UI primitive | PascalCase generic | `Button`, `AnimatedSection` |
| Hook | camelCase, `use` prefix | `useCalendly`, `useTypewriter` |
| CSS class | kebab-case | `card-surface`, `scroll-animation` |
| Constant | UPPER_SNAKE | `FRAME_COUNT`, `HOLD_DURATION` |

---

## 9. Asset Pipeline — creating frame sequences

You **cannot** do this from code alone. You need a 3D tool.

1. Animate in **Blender / Cinema 4D** (or AE for 2.5D). Aim for ~4s @ 24–30 fps = 96–120 frames.
2. Export as **image sequence** — JPG 80–85% for opaque, PNG for alpha. 1920×1080 desktop.
3. Pad names: `frame_0001.jpg`, `frame_0002.jpg`, …
4. Place in `public/frames/` (or `public/tunnel-frames/` for a second animation).
5. Update `FRAME_COUNT` and path in the Hero component.

**If the user has no frames yet**, give them three honest options:
- (a) render their own in Blender
- (b) commission a 3D freelancer (1–2 days)
- (c) buy a stock product-animation sequence

Don't pretend frames come from nowhere. Build with placeholders → swap in real frames later.

---

## 10. Performance Hardening Checklist (verify before claiming done)

- [ ] All frames preload with a **real-progress** loading bar
- [ ] Scroll handler uses **RAF + ticking ref** (no dropped frames in DevTools Performance)
- [ ] Canvas scaled for **`devicePixelRatio`** (no blur on retina)
- [ ] Canvas updates go **direct to DOM**, not React state
- [ ] Visible-card `setState` only fires when the **set actually changes**
- [ ] **Passive** scroll listeners everywhere
- [ ] Lenis configured **Safari-safe** (`lerp: 0.1`, `syncTouch: false`); tested on iOS
- [ ] Mobile canvas: **1.3× zoom** + shorter section height (`350vh` / `300vh`)
- [ ] Sticky containers: `will-change: transform; transform: translateZ(0)`
- [ ] **Production build** (`next build && next start`) tested — some bugs only show up there
- [ ] Lighthouse: **85+ desktop, 70+ mobile**

---

## 11. Common Pitfalls (check these first when things break)

1. **Missing `"use client"`** → hydration mismatch / "useState is not a function". Fix: add the directive.
2. **Phosphor icons in server components** → RSC build error. Fix: import from `/dist/ssr`.
3. **Frames not preloading** → blank flashing canvas. Fix: `await` all `img.onload` before `setLoaded(true)`.
4. **React state on scroll value** → jank, high CPU. Fix: refs + direct DOM.
5. **Canvas blurry on retina** → DPR not applied. Fix: multiply `canvas.width`/`height` by `devicePixelRatio`.
6. **Safari smooth-scroll stutter** → Lenis defaults wrong. Fix: `lerp: 0.1`, `syncTouch: false`.
7. **Next.js 16 API drift** → training-data Next 13/14 patterns. Fix: read `node_modules/next/dist/docs/`.
8. **Skipping the loading bar** → site feels broken for 2 seconds. Always show real progress.
9. **Replacing the 6-layer shadow with a single shadow** → flat, generic look. Don't.

---

## 12. Implementation Principles (for every project)

When building a site with this skill:

1. **Inspect the existing project structure first.** Identify the framework before scaffolding new files.
2. **Propose the implementation plan briefly** before mass-editing.
3. **Build sections one at a time**, top to bottom, browser-tested between each.
4. **Reuse primitives** — `AnimatedSection`, `Button`, `EyebrowBadge` are not optional.
5. **Responsive from day one** — mobile-first, then `md:` and `lg:` overrides.
6. **Graceful fallback** for low-perf devices and `prefers-reduced-motion`.
7. **Optimize 3D assets and animations** — JPG quality, frame count, mobile heights.
8. **Explain how to run the project** at the end.

---

## 13. Prompting Tips (teach the user the vocabulary)

If the user says vague things like "もっとカッコよくして" / "make it look nice", push back gently and ask for specifics — then teach them the vocabulary. Good prompts mention:

- **Spring config:** `stiffness: 100, damping: 20`
- **Design tokens:** `var(--card-shadow)`, `var(--background)`
- **Performance pattern:** "RAF + ticking ref, direct DOM via ref"
- **Existing components:** `<AnimatedSection>`, `<Button variant="primary">`
- **Concrete tokens:** `bg-white/40 backdrop-blur-md`, `text-zinc-500`

---

## 14. Example Requests

### 例1: 日本語のシンプルな依頼

> "3d-scroll-website skill を使って、AI系のヒーロー演出を作って"

**作るもの:**
- 抽象的な AI core(コア演出)
- パーティクル粒子レイヤー
- 深度感のある背景
- スクロール駆動のスムーズなカメラ移動
- ガラスモーフィズムの UI パネル
- 一貫したミニマルなデザイン
- `prefers-reduced-motion` 対応

### Example 2: Full agency landing page

> "Build a premium 3D scroll-animated landing page for a design agency called 'Northlight'. Use the 3d-scroll-website skill. Hero with canvas frame sequence, then projects showcase, bento features, testimonials, FAQ, final CTA."

**Order of work:** Section 3 build order, top to bottom. Use placeholder frames if real ones aren't ready.

### Example 3: Section-by-section

> "Scaffold a new 3D scroll site using the 3d-scroll-website skill. I'll tell you what I want section by section."

→ Scaffold Next.js, install deps, wire up Lenis + tokens + primitives, then wait.

---

## 15. Scroll Animation Pattern (the cinematic feel)

The continuous experience the user should feel:

- First viewport: futuristic abstract 3D scene
- As they scroll: camera moves slowly forward through depth
- UI panels appear from depth, float in
- Background particles drift subtly
- Objects rotate slightly based on scroll progress
- Sections feel **connected** as one continuous experience — no hard cuts

---

## 🏁 One more thing

Ship in the order given. Check each section in a **real browser, with real scroll**, before moving on. When something feels off, diagnose against the rules in this doc before reaching for clever workarounds — nine times out of ten the fix is already listed above.

Build something that makes people stop scrolling. 🚀
