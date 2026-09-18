import { Fragment, createElement } from "react";
import { loadDefaultJapaneseParser } from "budoux";

/* 和文 has no spaces, so a browser is free to break a line between any two
   characters — which is how a headline ends up as 「届 / いている」. BudouX
   segments the text into phrases (文節); <Ja> allows a break only between
   them. It renders the same on the server and in every browser, unlike
   `word-break: auto-phrase`, which is Chromium-only. */
const parser = loadDefaultJapaneseParser();

/* must not begin a line — BudouX occasionally splits before these */
const NO_BREAK_BEFORE = /^[、。，．・：；？！）〕］｝〉》」』】’”ー)\],.;:?!]/;

/* Compounds BudouX splits but a reader would not. */
const KEEP_TOGETHER = ["研究駆動コース"];

const KATAKANA = /[ァ-ヶー]/;
const KANJI = /[一-龠々]/;
const LONG_PHRASE = 9;

/* Paper titles run compounds together — 「マルチコンテキストセキュリティ診断
   配置方式の」 is a single phrase to BudouX and wider than most columns. A long
   phrase gets one more break opportunity wherever katakana meets kanji, which
   is where a reader would pause anyway. */
function splitLongPhrase(phrase: string): string[] {
  const chars = Array.from(phrase);
  if (chars.length <= LONG_PHRASE) return [phrase];

  const parts: string[] = [];
  let current = chars[0];
  for (let i = 1; i < chars.length; i += 1) {
    const prev = chars[i - 1];
    const next = chars[i];
    const boundary =
      (KATAKANA.test(prev) && KANJI.test(next)) ||
      (KANJI.test(prev) && KATAKANA.test(next));
    const insideKept = KEEP_TOGETHER.some((word) => {
      const at = phrase.indexOf(word);
      const offset = chars.slice(0, i).join("").length;
      return at >= 0 && offset > at && offset < at + word.length;
    });
    // never strand fewer than three characters on either side
    if (boundary && !insideKept && Array.from(current).length >= 3 && chars.length - i >= 3) {
      parts.push(current);
      current = next;
    } else {
      current += next;
    }
  }
  parts.push(current);
  return parts;
}

function rejoin(phrases: string[]): string[] {
  let out = [...phrases];
  for (const word of KEEP_TOGETHER) {
    const at = out.join("").indexOf(word);
    if (at < 0) continue;
    // merge every phrase the word overlaps, however many pieces it was cut into
    const merged: string[] = [];
    let pos = 0;
    let open = false;
    for (const phrase of out) {
      const from = pos;
      const to = pos + phrase.length;
      pos = to;
      const overlaps = from < at + word.length && to > at;
      if (overlaps && open) {
        merged[merged.length - 1] += phrase;
      } else {
        merged.push(phrase);
      }
      open = overlaps;
    }
    out = merged;
  }
  return out;
}

const cache = new Map<string, readonly string[]>();

export function phrasesOf(text: string): readonly string[] {
  const hit = cache.get(text);
  if (hit) return hit;

  const merged: string[] = [];
  for (const phrase of parser.parse(text)) {
    const last = merged.length - 1;
    // keep closing punctuation with the phrase it closes, and never leave a
    // single character stranded as its own phrase
    if (
      last >= 0 &&
      (NO_BREAK_BEFORE.test(phrase) || Array.from(merged[last]).length === 1)
    ) {
      merged[last] += phrase;
    } else {
      merged.push(phrase);
    }
  }

  // A space between 和文 and Latin inside a phrase (「22 日には」「VibeGuard の」)
  // is 和欧間 spacing, not a place to break. Spaces between two Latin tokens
  // (「c / cpp / go」) stay breakable, or a whole list becomes one long word.
  // A hyphen inside a Latin word (needs-review, What-if) must not break either.
  const result = rejoin(merged)
    .flatMap(splitLongPhrase)
    .map((phrase) =>
      phrase
        .replace(/(?<=[ぁ-んァ-ヶー一-龠々）」]) (?=\S)|(?<=\S) (?=[ぁ-んァ-ヶ一-龠々（「])/g, "\u00a0")
        .replace(/(?<=[A-Za-z0-9])-(?=[A-Za-z0-9])/g, "-\u2060"),
    );
  cache.set(text, result);
  return result;
}

/* Rendered as a custom element rather than a <span>: the stylesheets here
   style descendants by tag (`.sectionHeader span`, `.stageCaption span`), and
   a span wrapper would inherit looks that were never meant for it. */
export function Ja({ children }: { children: string }) {
  const phrases = phrasesOf(children);
  return createElement(
    "ja-text",
    null,
    phrases.map((phrase, index) => (
      <Fragment key={index}>
        {index > 0 && <wbr />}
        {phrase}
      </Fragment>
    )),
  );
}
