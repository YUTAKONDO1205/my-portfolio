import Link from "next/link";

const quickLinks = [
  {
    href: "https://github.com/YUTAKONDO1205",
    label: "GitHub",
    description: "コード、実験、制作ログ",
  },
  {
    href: "https://elchika.com/user/kd_yuta/?page=0",
    label: "Elchika",
    description: "ハードウェア開発の記録",
  },
  {
    href: "https://www.linkedin.com/in/kondo-yuta-985430317",
    label: "LinkedIn",
    description: "プロフィールと経歴",
  },
] as const;

const focusAreas = [
  {
    label: "Sensing",
    title: "現場の変化を捉えるセンサ設計",
    description:
      "振動、環境情報、位置や通信状態など、現場で起きている変化をデータとして取り出す入口を設計します。",
  },
  {
    label: "Analytics",
    title: "信号処理と AI による異常把握",
    description:
      "時系列データの特徴抽出や解析を通して、設備保全や状態推定に使える判断材料へ変換します。",
  },
  {
    label: "Embedded",
    title: "組み込み実装と通信までつなぐ",
    description:
      "SPRESENSE や ELTRES などを活用し、机上の検証で終わらないプロトタイプを素早く形にします。",
  },
] as const;

const featuredWorks = [
  {
    category: "Equipment Maintenance",
    title: "SPRESENSE と振動解析による設備保全",
    description:
      "振動データを使って設備状態の兆候を可視化し、保全判断につながる情報へ落とし込む研究・制作。",
    href: "https://elchika.com/article/d760ab22-a6dd-49f7-a879-c3f68da4ac65/",
    cta: "Elchika で見る",
  },
  {
    category: "Environmental Mapping",
    title: "SPRESENSE と ELTRES 通信で CO2 濃度をマッピング",
    description:
      "低消費電力通信とセンシングを組み合わせ、環境データを広域で取得して把握するためのアプローチ。",
    href: "https://elchika.com/article/2d7629c9-4e56-4eb8-aa03-120bc9ec5eb7/",
    cta: "Elchika で見る",
  },
  {
    category: "Open Development",
    title: "GitHub で公開している制作・検証ログ",
    description:
      "試作の過程やコードの積み上げを継続的に公開し、研究と実装の両輪でアウトプットを残しています。",
    href: "https://github.com/YUTAKONDO1205",
    cta: "GitHub を開く",
  },
] as const;

const profilePoints = [
  "センシング",
  "組み込み開発",
  "AI / データ解析",
  "無線通信",
] as const;

const perspectiveNotes = [
  "ハードウェア起点で考える",
  "データから現場に戻す",
  "試作を公開しながら磨く",
] as const;

export default function Home() {
  return (
    <main className="portfolio-home">
      <section className="shell hero">
        <div className="hero-topbar">
          <div>
            <p className="site-mark">KY / Portfolio</p>
            <p className="site-caption">Research, Prototyping, Embedded AI</p>
          </div>
          <nav className="hero-nav" aria-label="ページ内ナビゲーション">
            <a href="#focus">Focus</a>
            <a href="#works">Works</a>
            <Link href="/research">Research</Link>
          </nav>
        </div>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Portfolio 2026</p>
            <h1>
              Build the signal.
              <br />
              Shape the insight.
            </h1>
            <p className="hero-lead">
              近藤悠太のポートフォリオサイト。センシング、AI、通信技術を横断しながら、
              現場の課題を捉える研究とプロトタイピングに取り組んでいます。
            </p>

            <div className="hero-actions">
              <Link href="/research" className="button-link button-link-primary">
                研究ページを見る
              </Link>
              <a
                href="https://www.linkedin.com/in/kondo-yuta-985430317"
                className="button-link button-link-secondary"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <aside className="signal-panel" aria-label="活動の要約">
            <div className="signal-card signal-card-featured">
              <p className="signal-label">Current Perspective</p>
              <p className="signal-title">
                実装と検証を往復しながら、
                <br />
                データを価値に変える。
              </p>
            </div>

            <div className="signal-card">
              <p className="signal-label">Primary Fields</p>
              <ul className="signal-list">
                {profilePoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="signal-card">
              <p className="signal-label">Approach</p>
              <ul className="signal-list">
                {perspectiveNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <div className="quick-link-grid">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="quick-link-card"
              target="_blank"
              rel="noreferrer"
            >
              <span className="quick-link-label">{link.label}</span>
              <strong>{link.description}</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="shell section profile-section">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Profile</p>
          <h2>研究と開発の両方を前に進めるための、個人の実験室。</h2>
        </div>

        <div className="profile-grid">
          <div className="profile-copy">
            <p>
              センサから取得した生の情報を、そのままではなく意思決定に使える形へ変えていくことに関心があります。
              組み込み実装、通信、データ解析までを一連の流れとして扱い、検証可能なプロトタイプとして成立させることを大切にしています。
            </p>
            <p>
              このサイトでは、GitHub に蓄積しているコード、Elchika にまとめた制作記事、そして LinkedIn
              上のプロフィールを一本のストーリーとして見せることを目指しています。
            </p>
          </div>

          <div className="profile-panel">
            <div className="profile-panel-row">
              <span>Name</span>
              <strong>近藤悠太 / Yuta Kondo</strong>
            </div>
            <div className="profile-panel-row">
              <span>Keywords</span>
              <strong>SPRESENSE, ELTRES, AI, Sensing</strong>
            </div>
            <div className="profile-panel-row">
              <span>Output</span>
              <strong>Research Notes, Prototypes, Public Code</strong>
            </div>
          </div>
        </div>
      </section>

      <section id="focus" className="shell section">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Focus</p>
          <h2>注力しているテーマ</h2>
        </div>

        <div className="focus-grid">
          {focusAreas.map((area) => (
            <article key={area.title} className="focus-card">
              <p className="card-label">{area.label}</p>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="works" className="shell section showcase-section">
        <div className="section-heading section-heading-inverse">
          <p className="eyebrow">Selected Works</p>
          <h2>公開している制作・研究アウトプット</h2>
        </div>

        <div className="work-grid">
          {featuredWorks.map((work) => (
            <article key={work.title} className="work-card">
              <p className="card-label card-label-inverse">{work.category}</p>
              <h3>{work.title}</h3>
              <p>{work.description}</p>
              <a href={work.href} target="_blank" rel="noreferrer">
                {work.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="shell section platform-section">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Platforms</p>
          <h2>活動をたどるためのリンク</h2>
        </div>

        <div className="platform-grid">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="platform-card"
              target="_blank"
              rel="noreferrer"
            >
              <span>{link.label}</span>
              <strong>{link.description}</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="shell section cta-section">
        <div className="cta-panel">
          <div>
            <p className="eyebrow eyebrow-dark">Next View</p>
            <h2>研究ページで、公開中のテーマをまとめて見られます。</h2>
          </div>
          <Link href="/research" className="button-link button-link-dark">
            Research Archive
          </Link>
        </div>
      </section>
    </main>
  );
}
