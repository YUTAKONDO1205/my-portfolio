# My Portfolio

開発者: 近藤悠太 (Kondo Yuta)

このリポジトリは、個人ポートフォリオサイトのソースコードです。  
`Next.js 16` をベースに、`React 19`、`TypeScript`、`Tailwind CSS 4` を使って構築しています。

## 公開サイト

https://kondo-yuta-my-portfolio.vercel.app/

## ローカル開発

まず依存関係をインストールします。

```bash
npm install
```

次に開発サーバーを起動します。

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開くと確認できます。

## 利用可能なスクリプト

```bash
npm run dev
```

開発サーバーを起動します。

```bash
npm run build
```

本番用ビルドを作成します。`postbuild` で `next-sitemap` も実行されます。

```bash
npm run start
```

本番ビルドをローカルで起動します。

```bash
npm run lint
```

ESLint による静的解析を実行します。

## 主な構成

- `app/page.tsx`: トップページ
- `app/layout.tsx`: 共通レイアウトとメタデータ
- `app/portfolio-data.ts`: ポートフォリオ表示用データ
- `app/research/[slug]/page.tsx`: 研究詳細ページ
- `public/`: 静的ファイル

## 技術スタック

- Next.js
- React
- TypeScript
- Tailwind CSS
- Motion
- next-sitemap

## デプロイ

このサイトは Vercel へのデプロイを想定しています。  
本番公開先は上記の URL です。
