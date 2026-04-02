import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Research",
  description:
    "近藤悠太の研究・制作実績をまとめたページです。センシング、振動解析、ELTRES 通信を軸にした公開中のアウトプットを紹介します。",
  alternates: {
    canonical: "/research",
  },
  openGraph: {
    title: "Research | 近藤悠太",
    description:
      "近藤悠太の研究・制作実績をまとめたページです。センシング、振動解析、ELTRES 通信を軸にした公開中のアウトプットを紹介します。",
    url: "/research",
    type: "article",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Research | 近藤悠太",
    description:
      "近藤悠太の研究・制作実績をまとめたページです。センシング、振動解析、ELTRES 通信を軸にした公開中のアウトプットを紹介します。",
  },
};

const researchItems = [
  {
    label: "Equipment Maintenance",
    title: "SPRESENSE と振動解析による設備保全",
    description:
      "設備の状態を振動データから把握し、保全の判断材料へつなげる取り組み。センシングと解析の両面から検証を進めています。",
    href: "https://elchika.com/article/d760ab22-a6dd-49f7-a879-c3f68da4ac65/",
    cta: "Elchika article",
  },
  {
    label: "Environmental Mapping",
    title: "SPRESENSE と ELTRES 通信で CO2 濃度をマッピング",
    description:
      "センシングと省電力広域通信を組み合わせて、環境データをマッピングするための試作。広い空間をどう可視化するかに焦点を当てています。",
    href: "https://elchika.com/article/2d7629c9-4e56-4eb8-aa03-120bc9ec5eb7/",
    cta: "Elchika article",
  },
  {
    label: "Public Development",
    title: "GitHub 上での継続的な公開と検証",
    description:
      "成果物だけでなく、試行錯誤の過程をコードとして残しながら、研究テーマの具体化と再現性の確保につなげています。",
    href: "https://github.com/YUTAKONDO1205",
    cta: "GitHub profile",
  },
] as const;

export default function ResearchPage() {
  return (
    <main className="subpage">
      <section className="shell subpage-hero">
        <div className="subpage-topbar">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Research</span>
        </div>

        <p className="eyebrow eyebrow-dark">Research Archive</p>
        <h1>公開している研究と制作のメモ。</h1>
        <p className="subpage-lead">
          センシング、組み込み実装、データ解析をまたぐテーマを、記事とコードの両方で積み上げています。
          Elchika と GitHub を行き来しながら、取り組みの輪郭が見える構成にしています。
        </p>
      </section>

      <section className="shell section profile-section">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Overview</p>
          <h2>研究ページの見方</h2>
        </div>

        <div className="research-summary">
          <p>
            ここでは、外部に公開している研究・制作アウトプットを中心にまとめています。現場の課題をセンシングで捉え、
            通信や解析を通じて意味のある情報へ変えていく流れを、テーマごとに整理しています。
          </p>

          <div className="research-note">
            <strong>主なキーワード</strong>
            <p>SPRESENSE / ELTRES / 振動解析 / CO2 計測 / Embedded AI</p>
          </div>
        </div>
      </section>

      <section className="shell section showcase-section">
        <div className="section-heading section-heading-inverse">
          <p className="eyebrow">Published Work</p>
          <h2>外部公開しているアウトプット</h2>
        </div>

        <div className="work-grid">
          {researchItems.map((item) => (
            <article key={item.title} className="work-card">
              <p className="card-label card-label-inverse">{item.label}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <a href={item.href} target="_blank" rel="noreferrer">
                {item.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="shell section cta-section">
        <div className="cta-panel">
          <div>
            <p className="eyebrow eyebrow-dark">Back To Home</p>
            <h2>トップページでは全体像を、研究ページでは公開成果を一覧できます。</h2>
          </div>
          <Link href="/" className="button-link button-link-dark">
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}
