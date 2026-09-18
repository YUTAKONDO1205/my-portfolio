# My Portfolio

開発者: 近藤 悠太 (Kondo Yuta)

個人ポートフォリオサイトのソースコードです。
`Next.js 16` をベースに、`React 19`、`TypeScript`、`Tailwind CSS 4`、`Motion`、`Lenis` で構築しています。

## 公開サイト

https://kondo-yuta-my-portfolio.vercel.app/

## デザインの軸

- **ボイドとコンステレーション** — 地色は一枚の暗い面。装飾はすべて 1px の三角形グリフで、
  ページ全体を貫く一つの粒子場として描かれる（`app/components/site-motion.tsx`）。
- **ヒーローは計器** — 粒子は標本、スクロールはパイプライン。
  Sense（4 チャンネルの生波形）→ Decide（FFT スペクトル）→ Share（1 コア＋4 配布チャネルの網）へ、
  同じ粒子が形を変える（`app/components/frame-sequence-hero.tsx`）。
- **シグナルレール** — ヒーローを抜けた後に現れる右端の固定ナビ。スクロール進捗が線を満たし、
  セクションの位置を三角マーカーで示す（`app/components/signal-rail.tsx`）。
- **背景の粒子場もページを聴く** — セクションが `data-signal="sense|decide|share"` を宣言すると、
  その背後を通る粒子クラスタが波形・スペクトル・網へ形を変え、間では有機的な雲に戻る。
  カーソル近くの三角形はカーソルの方を向いて明るくなる（`site-motion.tsx`）。
- **研究カードは挿絵ではなく計器** — 4 研究それぞれの仕組みを 1px 三角形の語彙で動かす
  手続き的キャンバス（`app/components/research-instrument.tsx`）。詳細ページでも同じ計器を拡大表示。
- **VibeGuard はその場で走る** — リポジトリの実サンプルと実ルール（VG-AUTH-001）で
  読込 → 走査線 → 検出 → 状態確定をループ再生する（`app/components/vibeguard-scan.tsx`）。
- **構造は情報** — 年表の背骨（Talks）や番号（Sense → Decide → Share）は、
  実際に順序を持つ内容にだけ使う。ティッカーもスローガンではなくデータ由来の事実だけを流す。

## ローカル開発

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開くと確認できます。

## 利用可能なスクリプト

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番用ビルドを作成 |
| `npm run start` | 本番ビルドをローカルで起動 |
| `npm run lint` | ESLint による静的解析 |

## 主な構成

- `app/page.tsx` — トップページ（`HomePageView` にデータを渡す）
- `app/layout.tsx` — 共通レイアウト、メタデータ、JSON-LD
- `app/portfolio-data.ts` — 表示データの唯一の正
  （`researchProjects` / `selectedWorks` / `talks` / `recognitions` / `awardBadges` / `profile` / `heroCopyV2` / `positioning`）
- `app/lib/impact-metrics.ts` — ダッシュボード用の集計（データから動的に導出）
- `app/components/` — ヒーロー、アワードストリップ、Talks 年表、ポジショニングレーダー、
  インパクトダッシュボード、シグナルレール
- `app/research/[slug]/page.tsx` — 研究詳細ページ
- `DESIGN.md` — 配色・タイポグラフィ・余白のトークン定義

## 実績データの更新ルール

- 受賞（`kind` 省略）／採択（`selection`）／学会発表（`presentation`）を区別して `awardBadges` に追加する。
  「受賞 N 件」の数はサイト全体で `awardPrizeCount` から導出される。
- 学会発表は `talks` に追加し、`status` を `presented` / `upcoming` で管理する。
- 数値（ルール数・配布チャネル数など）は一次ソース（リポジトリ・公式ページ）で確認してから書く。

## デプロイ

Vercel へのデプロイを想定しています。本番公開先は上記の URL です。
