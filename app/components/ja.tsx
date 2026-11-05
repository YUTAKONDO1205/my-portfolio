import { Fragment, createElement } from "react";
import { loadDefaultJapaneseParser } from "budoux";

/* 和文 has no spaces, so a browser is free to break a line between any two
   characters — which is how a headline ends up as 「届 / いている」. BudouX
   segments the text into phrases (文節); <Ja> allows a break only between
   them. It renders the same on the server and in every browser, unlike
   `word-break: auto-phrase`, which is Chromium-only. */
const parser = loadDefaultJapaneseParser();

/* must not begin a line — BudouX occasionally splits before these, and
   before 「ほど」 and the 「中」 of 「1,000 レコード中 387 件」 */
const NO_BREAK_BEFORE = /^(?:[、。，．・：；？！）〕］｝〉》」』】’”ー)\],.;:?!]|ほど|中(?=[\s \d]))/;

/* Compounds BudouX splits but a reader would not. */
const KEEP_TOGETHER = [
  "研究駆動コース",
  "クレイン電子",
  "活用アイデア賞",
  "ばらつき",
  "発見 AI",
  "反証 AI",
  "切り替え",
  "その場",
  "読むとき",
  "マージする前",
  "見つからなく",
  "ファイル横断",
  "セキュア開発",
  "活用コンテスト",
  "日吉キャンパス",
  "学生AIリーダーズ大賞",
  "AI 生成コード",
];

/* Katakana compounds too long for a phone-width line, and the joints where
   they may break; without these the browser cut 「シンポジ / ウム」. */
const KATAKANA_JOINTS = [
  "ソフトウェア|エンジニアリング|シンポジウム",
  "コンピュータ|セキュリティ|シンポジウム",
  "セキュリティ|イノベーター",
];

function splitJoints(phrase: string): string[] {
  for (const joint of KATAKANA_JOINTS) {
    const word = joint.replace(/\|/g, "");
    const at = phrase.indexOf(word);
    if (at < 0) continue;
    const pieces = joint.split("|");
    const last = pieces.length - 1;
    return [
      phrase.slice(0, at) + pieces[0],
      ...pieces.slice(1, last),
      ...splitJoints(pieces[last] + phrase.slice(at + word.length)),
    ];
  }
  return [phrase];
}

/* Latin names a line must not split (「Spring / Boot」「EdgeOps / Command
   Agent」). Only short names, about 22 characters at most: a longer one such
   as "AWS Certified Solutions Architect" has to stay breakable or it overflows
   a phone-width column. */
const KEEP_LATIN = [
  "Spring Boot",
  "Open VSX",
  "VS Code",
  "GROUP BY",
  "Dev Container",
  "GitHub Actions",
  "Random Forest",
  "EdgeOps Command Agent",
  "Tokyo Electron Device",
  "JBAT Qanat Universe",
  "CLIP Viewer Lite API",
  "MobileNetV2 int8",
  "focus regions",
  "attention grid",
];
const KEEP_LATIN_RE = new RegExp(KEEP_LATIN.join("|"), "g");

const KATAKANA = /[ァ-ヶー]/;
const KANJI = /[一-龠々]/;
const DIGIT = /[0-9]/;
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
      (KANJI.test(prev) && KATAKANA.test(next)) ||
      // 「シンポジウム2026論文集」: a year after a katakana word
      (KATAKANA.test(prev) && DIGIT.test(next)) ||
      // 「シンポジウム 2026（慶應…」: without this the phrase has no break at
      // all, and a narrow column splits the year itself (「202 / 6」)
      ((KATAKANA.test(prev) || KANJI.test(prev)) && next === " ");
    const insideKept = KEEP_TOGETHER.some((word) => {
      const at = phrase.indexOf(word);
      const offset = chars.slice(0, i).join("").length;
      return at >= 0 && offset > at && offset < at + word.length;
    });
    // nor start a piece with what must not begin a line (「コーナー / 中 214」)
    const startsBadly = NO_BREAK_BEFORE.test(chars.slice(i).join(""));
    // never strand fewer than three characters on either side
    if (boundary && !insideKept && !startsBadly && Array.from(current).length >= 3 && chars.length - i >= 3) {
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
  for (const word of [...KEEP_TOGETHER, ...KEEP_LATIN]) {
    // every occurrence, not only the first
    for (let at = out.join("").indexOf(word); at >= 0; at = out.join("").indexOf(word, at + word.length)) {
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
  }
  return out;
}

/* BudouX sometimes cuts a compound particle after its first kana —
   「振動解析に / よる設備保全」「問題と / して扱い」. Move that kana to the
   phrase it belongs to. */
const COMPOUND_PARTICLES: readonly [string, RegExp][] = [
  ["に", /^(よる|より|よって|ついて|おける|おいて|対する|対して|関する|基づ)/],
  ["と", /^して/],
];

function regroupParticles(phrases: string[]): string[] {
  const out = [...phrases];
  for (let i = 1; i < out.length; i += 1) {
    const prev = out[i - 1];
    for (const [head, rest] of COMPOUND_PARTICLES) {
      if (rest.test(out[i]) && prev.endsWith(head) && Array.from(prev).length > 2) {
        out[i - 1] = prev.slice(0, -1);
        out[i] = `${head}${out[i]}`;
        break;
      }
    }
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
  // A hyphen inside a Latin word (needs-review, What-if) must not break either,
  // nor a range (1–15, 0〜500, pp. 78–85).
  const result = regroupParticles(rejoin(merged))
    .flatMap(splitLongPhrase)
    .flatMap(splitJoints)
    .map((phrase) =>
      phrase
        .replace(/(?<=[ぁ-んァ-ヶー一-龠々）」]) (?=\S)|(?<=\S) (?=[ぁ-んァ-ヶ一-龠々（「])/g, "\u00a0")
        .replace(/(?<=[A-Za-z0-9])([-\u2013\u301c\uff5e])(?=[A-Za-z0-9])/g, "$1\u2060")
        // a number stays with its unit (\u300c500 / Hz\u300d\u300c2.9 / MB\u300d)
        .replace(/(?<=[0-9]) (?=(?:[kMGm]?(?:Hz|V|A|W|F|B))(?![A-Za-z]))/g, "\u00a0")
        .replace(KEEP_LATIN_RE, (name) => name.replace(/ /g, "\u00a0"))
        .replace(/\bpp\. (?=\d)/g, "pp.\u00a0")
        // in a run of names (\u300cc / cpp / go\u300d) the slash stays with the name
        // before it, so a wrapped line never starts with \u300c/ python\u300d
        .replace(/(?<=[A-Za-z0-9)\uff09]) \/ /g, "\u00a0/ "),
    );
  cache.set(text, result);
  return result;
}

/* Latin project names like "Eltres_CO2_Mapping" have no natural break
   points — insert zero-width spaces after underscores so wrapping happens
   there instead of orphaning a single character. */
export function softBreakTitle(title: string) {
  return title.replace(/_/g, "_​");
}

/* A list of tags set as 「SPRESENSE / FFT / Random Forest」. Each slash stays
   with the tag before it and a tag never splits, so a wrapped line ends with
   a slash instead of starting with one. */
export function tagLine(tags: readonly string[]) {
  return tags
    .map((tag) => tag.replace(/ /g, " ").replace(/-/g, "-⁠"))
    .join(" / ");
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
