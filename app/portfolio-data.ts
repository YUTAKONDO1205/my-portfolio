export type PlatformLink = {
  href: string;
  label: string;
  description: string;
  detail: string;
};

export type FocusArea = {
  label: string;
  title: string;
  description: string;
};

export type SiteAxisStep = {
  en: string;
  ja: string;
  description: string;
};

export type SiteAxis = {
  label: string;
  title: string;
  summary: string;
  detail: string;
  steps: readonly SiteAxisStep[];
};

export type Philosophy = {
  label: string;
  title: string;
  body: string;
  english: string;
};

export type PublicationEntry = {
  id: string;
  date: string;
  dateLabel: string;
  title: string;
  summary: string;
  tags: readonly string[];
  awards: readonly string[];
  href: string;
};

export type Recognition = {
  year: string;
  award: string;
  project: string;
  organization: string;
  note: string;
  href: string;
};

export type ResearchProject = {
  slug: string;
  year: string;
  title: string;
  subtitle: string;
  cardSummary: string;
  pageSummary: string;
  heroKicker: string;
  heroEnglish: string;
  themeClass: "theme-drone" | "theme-pdm" | "theme-anomaly" | "theme-eltres";
  ambientClass:
    | "ambient-clouds"
    | "ambient-machine"
    | "ambient-server"
    | "ambient-tunnel";
  tags: readonly string[];
  links: readonly {
    href: string;
    label: string;
  }[];
  sections: readonly {
    title: string;
    body: string;
  }[];
  highlights: readonly string[];
};

export type SelectedWorkDistribution = {
  label: string;
  href?: string;
  status?: "live" | "pending";
};

export type SelectedWork = {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  summary: string;
  tags: readonly string[];
  themeClass: "theme-drone" | "theme-pdm" | "theme-anomaly" | "theme-eltres";
  href: string;
  /** Optional: 3–6 short bullets shown on the card */
  highlights?: readonly string[];
  /** Optional: distribution channels (Marketplace / Web Store / etc.) with per-link status */
  distribution?: readonly SelectedWorkDistribution[];
  /** Optional: feature flag — when true, card may render larger / span more columns */
  feature?: boolean;
  /** Optional: the product's own public site, shown as a lead link on the card */
  siteLink?: { href: string; label: string };
};

export const platformLinks: readonly PlatformLink[] = [
  {
    href: "https://github.com/YUTAKONDO1205",
    label: "GitHub",
    description: "コードと検証ログを残す公開リポジトリ",
    detail:
      "研究の途中経過まで含めて公開し、組み込み、機械学習、API、実験スクリプトを横断して整理しています。",
  },
  {
    href: "https://elchika.com/user/kd_yuta/?page=0",
    label: "Elchika",
    description: "背景と評価を日本語でまとめた制作ノート",
    detail:
      "課題設定、構成、評価、今後の展望を記事として残し、作品単位で読めるようにしています。",
  },
  {
    href: "https://vibeguard-site.kondo-yuta-02.workers.dev",
    label: "VibeGuard 公式サイト",
    description: "出荷中のプロダクトをそのまま読める公開サイト",
    detail:
      "検出ルール一覧、実際の検出例、リリース履歴を、リポジトリの中身から自動生成して掲載しています。",
  },
] as const;

export const focusAreas: readonly FocusArea[] = [
  {
    label: "Signal",
    title: "現場の信号を取る",
    description:
      "画像、振動、音響、位置情報のような異なる信号を、現場で扱える粒度と実装コストで取得します。",
  },
  {
    label: "Edge",
    title: "軽量に判断する",
    description:
      "SPRESENSE 級の制約を前提に、FFT、Random Forest、MobileNetV2 などを使って判断をデバイス側へ寄せます。",
  },
  {
    label: "Open",
    title: "公開しながら磨く",
    description:
      "コード、記事、受賞歴を切り離さず、研究の流れそのものが伝わるように公開を続けています。",
  },
] as const;

export const siteAxis: SiteAxis = {
  label: "Research Flow",
  title: "現場の信号を、判断と公開へつないでいく",
  summary:
    "このサイトの軸は、センサで拾った信号をエッジで読み、必要な情報だけを送り、公開しながら次の研究へつなげる流れです。",
  detail:
    "現場で信号を取り、軽量に判断し、通信制約を前提にデータを設計し、GitHub と Elchika で公開するまでの流れを、このサイト全体の軸にしています。",
  steps: [
    {
      en: "Sense",
      ja: "現場で拾う",
      description:
        "画像、振動、音響、位置情報のような信号を、実験だけで終わらない粒度で現場から取る。",
    },
    {
      en: "Decide",
      ja: "軽量に判断する",
      description:
        "SPRESENSE 級の制約を前提に、特徴量設計や軽量モデルで判断をデバイス側へ寄せる。",
    },
    {
      en: "Share",
      ja: "公開して次へつなぐ",
      description:
        "GitHub、Elchika、受賞歴まで含めて研究の流れを公開し、次のテーマに接続していく。",
    },
  ],
} as const;

export const philosophy: Philosophy = {
  label: "Philosophy",
  title: "「どう動くか」だけでなく「どう使われるか」まで設計する",
  body: "良いエンジニアリングは、ただ動くものを作ることではなく、現場で実際に使えるシステムを設計することだと考えています。そのため、センサ取得、エッジ推論、通信、API、可視化までを横断し、必要な情報だけを送る省通信設計と、運用へつなげるイベント設計をひとつの体験として組み立てています。",
  english:
    "Good engineering is not only about making something work — it is about designing systems that can actually be used in the real world.",
} as const;

export const researchProjects: readonly ResearchProject[] = [
  {
    slug: "drone-inspector",
    year: "2026",
    title: "DroneInspector",
    subtitle: "インフラ点検向けエッジAIドローン",
    cardSummary:
      "狭小インフラ空間での点検を想定し、SPRESENSE ベースで撮像・画質ゲート・分類・証跡保存・監督制御をつないだ研究です。品質基準を満たさないフレームを、検知しないまま通過させないことを設計の中心に置いています。",
    pageSummary:
      "空間の制約が大きい点検現場では、品質基準を満たさないフレームをその場で棄却する人がいません。ぼけた画像や白飛びした画像にも分類器はスコアを返すため、棄却も委譲もないまま陰性と判定された損傷は silent miss になります。この研究は、画質ゲートと棄却が監督制御の判断へどう伝播するかを、固定した証拠の上で 1 層ずつ入れ替えて測定し、その結果に基づいてファームウェアを実装したものです。",
    heroKicker: "Skyborne Inspection",
    heroEnglish: "Read the scene before the signal is lost.",
    themeClass: "theme-drone",
    ambientClass: "ambient-clouds",
    tags: [
      "SPRESENSE",
      "Drone",
      "TensorFlow Lite Micro",
      "MobileNetV2",
      "Quality Gate",
      "Runtime Supervision",
    ],
    links: [
      {
        href: "https://github.com/YUTAKONDO1205/DroneInspector",
        label: "GitHub リポジトリ",
      },
      {
        href: "https://github.com/YUTAKONDO1205/DroneInspector/tree/main/research",
        label: "測定・解析データ (research/)",
      },
      {
        href: "https://elchika.com/article/663a49cf-c895-44d7-a989-6e45e7d92056/",
        label: "Elchika 記事",
      },
    ],
    sections: [
      {
        title: "着眼点",
        body:
          "トンネルや水道管のような通信条件の悪い場所では、撮影して持ち帰るだけでは作業の負荷が大きく残ります。さらに問題となるのは、品質基準を満たさないフレームをその場で棄却する人がいないことです。品質ゲートも棄却も既知の手法ですが、それらが監督制御の判断へどう伝播するかは、測定しなければ明らかになりません。固定した証拠の上でこれを確かめることを研究の中心に置いています。",
      },
      {
        title: "構成",
        body:
          "撮像 → ハッシュ → 画質指標 q → 分類 → 証跡コミット → 5 状態の監督制御、という一本道でファームウェアを構成しています。監督制御は受理 / 再撮像 / 安全停止に分岐し、再撮像は N_max = 2 で飽和、安全停止はラッチして解除コマンドが来るまで点検を再開しません。証跡ストアは 1 レコード 1 不変ファイルで、索引は保存せず起動時の走査で再構築します。",
      },
      {
        title: "測定結果",
        body:
          "凍結チェックポイントで採点し直した 1,000 枚のコンクリートパッチを固定証拠として、6 つの候補改善 (E1–E6) を 1 層ずつ入れ替えて比較しました。結果として 6 つのうち 5 つが、改善を動機づけた想定とは異なる挙動を示しました。証跡バッファは保管では優位だが到達では優位でない、配備フォーマットの整数化は同一画素で 13,638 件の監督判断を変える、判定が出た時点で機体は既に通過しており 1,000 レコード中 387 が別の面を指す、といった結果です。",
      },
      {
        title: "現在地",
        body:
          "機体プロセッサ上での MobileNetV2 int8 推論、索引の走査再構築 (40/40 試行で 4,000 件を完全回復)、実ケーブル抜きに対する証跡の耐久 (18/18)、監督判断経路の WCET まで実機で測り切っています。一方でオンターゲット推論は 94.3 秒でリアルタイムではなく、消費電力と現場精度は未測定です。検証は台上条件に限られ、飛行や現場試験はまだ主張していません。",
      },
    ],
    highlights: [
      "画質ゲート → 分類 → 証跡 → 5 状態監督制御を 1 本の不変条件として固定",
      "索引を保存しない証跡ストア — 走査による再構築が 40/40 試行で完全回復",
      "6 層の入れ替え比較 (E1–E6) で、5 つが想定と異なる挙動を示すことを実測",
      "STPA + FMEA、Simulink/Stateflow モデル、飛行 SIL まで含む一次資料を公開",
      "受賞作品として外部からの評価も得ている点検テーマ",
    ],
  },
  {
    slug: "pdm-edge",
    year: "2026",
    title: "pdm_edge",
    subtitle: "加速度・音響を用いた異常検知エッジAI",
    cardSummary:
      "加速度 3 軸と音響の 4 チャンネルを FFT 特徴へ落とし込み、SPRESENSE 上で扱える軽量な異常検知構成としてまとめた研究です。",
    pageSummary:
      "予兆保全を現場寄りに考えるために、重い解析を避けつつ異常兆候の差をどこまで検出できるかを検討した研究です。波形から周波数特徴を生成し、固定長の特徴量として軽量実装へ寄せています。",
    heroKicker: "Signal and Spectrum",
    heroEnglish: "Turn vibration into a readable edge.",
    themeClass: "theme-pdm",
    ambientClass: "ambient-machine",
    tags: [
      "SPRESENSE",
      "FFT",
      "Random Forest",
      "MPU6050",
      "MAX4466",
      "Predictive Maintenance",
    ],
    links: [
      {
        href: "https://github.com/YUTAKONDO1205/pdm_edge",
        label: "GitHub リポジトリ",
      },
      {
        href: "https://elchika.com/article/7301ab59-0921-4ba7-9935-b9309cf8c59c/",
        label: "Elchika 記事",
      },
    ],
    sections: [
      {
        title: "着眼点",
        body:
          "通信前提の大きな解析系ではなく、設備のすぐ近くで異常兆候を拾える最小構成を作ることを目的にしています。現場に置ける軽量さと再現性を優先しています。",
      },
      {
        title: "構成",
        body:
          "1 kHz の時系列を FFT で周波数特徴へ変換し、0 から 500 Hz を固定 bin に要約して Random Forest へ渡します。学習後はヘッダ化して SPRESENSE へ持ち込めるようにしています。",
      },
      {
        title: "現在地",
        body:
          "学習、評価、ヘッダ再生成、SPRESENSE 側呼び出しまでが揃っており、異常再現率を重視した軽量構成としてまとまっています。",
      },
    ],
    highlights: [
      "4 チャンネル同時処理で設備状態の変化を多面的に取得",
      "固定長特徴で組み込み移植をしやすくした構成",
      "LoRa と振動解析の流れにつながる基礎研究として位置づくテーマ",
    ],
  },
  {
    slug: "anomaly-event-api",
    year: "2026",
    title: "anomaly-event-api",
    subtitle: "異常検知をイベント運用までつなぐ API",
    cardSummary:
      "画像アップロード、異常検知、説明、イベント保存、ダッシュボード可視化を一体化し、研究を運用視点まで広げた実装です。",
    pageSummary:
      "判定結果を返すだけで終わらず、イベントとして残し、確認し、状態更新できるところまで視野に入れた研究実装です。ローカル検証と AWS 検証の両方を同じ体験で扱えるようにしています。",
    heroKicker: "Operational Layer",
    heroEnglish: "From anomaly to action.",
    themeClass: "theme-anomaly",
    ambientClass: "ambient-server",
    tags: [
      "Node.js",
      "TypeScript",
      "PyTorch",
      "Grad-CAM",
      "AWS SAM",
      "Dashboard",
    ],
    links: [
      {
        href: "https://github.com/YUTAKONDO1205/anomaly-event-api",
        label: "GitHub リポジトリ",
      },
    ],
    sections: [
      {
        title: "着眼点",
        body:
          "現場で本当に必要なのは、判定の有無だけではなく、その結果を保存し、見返し、状態を変えられることだと考えています。そのため異常検知をイベント運用へつなげ、検知結果を運用上の判断へ変換する仕組みとして設計しています。",
      },
      {
        title: "構成",
        body:
          "Node.js + TypeScript の API 層に Python 推論を接続し、Grad-CAM、focus regions、attention grid といった説明情報も返すようにしています。local と AWS のモード差もサービス層で吸収しています。",
      },
      {
        title: "現在地",
        body:
          "検知、イベント化、可視化、provider 切り替えが揃い、研究の成果を現場オペレーションへ近づける基盤として機能しています。",
      },
    ],
    highlights: [
      "local / AWS の両モードで同じ操作感を保つ構成",
      "NEW / CHECKING / RESOLVED の運用ステータス設計",
      "説明可能性とイベント管理をひとつの体験にまとめた点が特徴",
    ],
  },
  {
    slug: "eltres-co2-mapping",
    year: "2025",
    title: "Eltres_CO2_Mapping",
    subtitle: "ELTRES通信によるCO2濃度マッピング",
    cardSummary:
      "SPRESENSE と ELTRES を組み合わせ、CO2 濃度と位置情報を交互に送信して都市と郊外の濃度差を可視化した研究です。",
    pageSummary:
      "通信、解析、表示を一連でつなぐ環境モニタリング研究です。CO2 濃度と位置情報を ELTRES で送り、CLIP Viewer Lite API から MATLAB で取得し、Web ダッシュボードまでまとめて構築しています。",
    heroKicker: "Atmosphere Mapping",
    heroEnglish: "Make invisible signals visible.",
    themeClass: "theme-eltres",
    ambientClass: "ambient-tunnel",
    tags: [
      "ELTRES",
      "SPRESENSE",
      "MATLAB",
      "IoT",
      "Sensor",
      "Mapping",
    ],
    links: [
      {
        href: "https://github.com/YUTAKONDO1205/Eltres_CO2_Mapping",
        label: "GitHub リポジトリ",
      },
      {
        href: "https://elchika.com/article/504f286c-413b-47d3-89f9-38920ca5e5c7/",
        label: "Elchika 記事",
      },
    ],
    sections: [
      {
        title: "着眼点",
        body:
          "目に見えない CO2 濃度を、エリア単位の差として持ち帰れる形にすることを目的にしています。現場で取った値を、その場で確認できる体験までつなげることを意識しています。",
      },
      {
        title: "構成",
        body:
          "SPRESENSE でセンサ値と位置情報を交互に取得し、ELTRES アドオンで送信します。クラウド側では CLIP Viewer Lite API から MATLAB で取得し、Web ダッシュボードで可視化しています。",
      },
      {
        title: "現在地",
        body:
          "通信、解析、表示までが一連でつながり、センサデータをエリア単位の濃度差として可視化する環境モニタリングの基礎構成として位置づいています。",
      },
    ],
    highlights: [
      "送信データを最小化したまま空間分布を取得できる構成",
      "MATLAB と Web ダッシュボードまで含めた一連の可視化パイプライン",
      "クレスコ ELTRESアドオンボード優秀賞の受賞テーマ",
    ],
  },
] as const;

export const selectedWorks: readonly SelectedWork[] = [
  {
    slug: "vibeguard",
    category: "Security Tooling",
    title: "VibeGuard",
    subtitle: "AI 生成コードの「通ってしまうバグ」を 3 地点で止める",
    summary:
      "書くとき（VS Code / Open VSX）・読むとき（Chrome）・マージ前（GitHub Actions / CLI）の 3 地点に同じ analyzer-core を配り、注入・秘密情報・認証スキップ・スタブ実装の混入を同一基準で止める診断基盤です。公式サイトの数値はすべてリポジトリから自動生成しており、コードは端末から出ません。",
    tags: [
      "TypeScript Monorepo",
      "SARIF",
      "GitHub Action",
      "VS Code Extension",
      "Chrome MV3",
      "MCP Server",
      "AI Code Review",
      "100% Local",
    ],
    themeClass: "theme-anomaly",
    href: "https://github.com/YUTAKONDO1205/VibeGuard",
    feature: true,
    siteLink: {
      href: "https://vibeguard-site.kondo-yuta-02.workers.dev",
      label: "公式サイト",
    },
    highlights: [
      "解析コア共通化 — 同じ analyzer-core を 4 つの配布チャネルに載せ、判定を 3 地点で揃える",
      "85 ルール / 11 言語 — 単一ファイル 74 + ファイル横断 11。注入・認証・秘密情報・暗号・メモリ安全・組込 / RTOS を c / cpp / csharp / go / java / javascript / kotlin / php / python / ruby / typescript で網羅",
      "自動修正 7 件 — うち「読まずに適用してよい」と宣言できるのは 1 件だけ。残りは needs-review として明示し、直す判断は人に残す",
      "公式サイト公開 — ルール一覧・検出例・バージョンをリポジトリから自動生成。手で書いた数値はサイト上に 1 つもない",
      "MCP サーバ — エージェントがファイルを書く「前」に同じエンジンへ問い合わせ、ALLOWED / REFUSED を返す",
      "100% ローカル — テレメトリ・外部送信なし。ネットワーク遮断下で結果がバイト一致することを CI で検証",
      "PR diff スキャン + SARIF — 追加行だけを走査し、GitHub Code Scanning タブへ連携",
    ],
    distribution: [
      {
        label: "GitHub Marketplace (Action)",
        href: "https://github.com/marketplace/actions/vibe-guard-aicoding",
        status: "live",
      },
      {
        label: "VS Code Marketplace",
        href: "https://marketplace.visualstudio.com/items?itemName=yutakondo.vibeguard-aicoding",
        status: "live",
      },
      {
        label: "Chrome Web Store",
        href: "https://chromewebstore.google.com/detail/ggdiodcjmdnkhncnpafcjokgonhmhbdf",
        status: "live",
      },
      {
        label: "Open VSX Registry",
        href: "https://open-vsx.org/extension/yutakondo/vibeguard-aicoding",
        status: "live",
      },
    ],
  },
  {
    slug: "edgeops-command-agent",
    category: "LLM Multi-Agent",
    title: "EdgeOps Command Agent",
    subtitle: "点検データを「意思決定」まで変換する保全マルチエージェント",
    summary:
      "異常検知で終わらせず、センサ・画像・点検メモ・マニュアル・故障履歴を 8 エージェントで統合し、リスク判定・原因推定・作業指示・報告書まで一貫して変換する Azure ベースの保全 AI です。人間の承認（承認 / 修正依頼 / 却下）を前提とした Human-in-the-loop と監査ログを備えます。",
    tags: [
      "Azure OpenAI",
      "Semantic Kernel",
      "Multi-Agent",
      "RAG",
      "FastAPI",
      "Next.js",
      "Human-in-the-loop",
    ],
    themeClass: "theme-anomaly",
    href: "https://github.com/YUTAKONDO1205/EdgeOps-Command-Agent",
    feature: true,
    highlights: [
      "8 エージェント構成 — Intake → Signal → Vision → Manual RAG → Root Cause → Action → What-if → Governance",
      "Azure OpenAI / Semantic Kernel / Azure AI Search による RAG とビジョン解析",
      "SPRESENSE などのエッジ機器から Event Hubs 経由で取り込むエッジ連携",
      "承認・監査ワークフロー — Cosmos DB へ実行履歴を残し Teams へ通知",
      "20 シナリオ × 4 深刻度を 108 項目のポリシーチェックで検証（全項目 pass）",
    ],
    distribution: [
      {
        label: "Microsoft Agent Hackathon 特別賞",
        href: "https://github.com/YUTAKONDO1205/EdgeOps-Command-Agent",
        status: "live",
      },
    ],
  },
  {
    slug: "travel-app-patch",
    category: "LLM Multi-Agent",
    title: "Maison Passage",
    subtitle: "片道航空券 2 枚で組み立てる海外旅行プランナー",
    summary:
      "海外旅行を「2 枚の片道航空券」として検索するプレミアム旅行プランナーです。Codex の Planner / Generator / Evaluator マルチエージェントハーネスをローカルで運用し、`specs/spec.json` を唯一の正としてスプリント単位で機能を進化させています。現在は Sprint 10（多地域コリドーの現実性とラベル整合）まで到達しています。",
    tags: [
      "Next.js",
      "TypeScript",
      "Codex",
      "Multi-Agent",
      "Skyscanner",
      "Travel",
    ],
    themeClass: "theme-drone",
    href: "https://github.com/YUTAKONDO1205/travel_app_patch",
    highlights: [
      "Planner / Generator / Evaluator の 3 役をローカルの Codex で反復実行し、PASS / FAIL レポートを成果物として残す",
      "複数月 × 滞在日数レンジの柔軟検索 — 最安の往路日付を選び、そこへ滞在レンジを足して復路を探す",
      "決定論的見積もりと事業者バックのライブ運賃導線を視覚的に分離し、フォールバックを UI 上で明示",
    ],
  },
  {
    slug: "mountain-supply-system",
    category: "Business System",
    title: "Mountain Supply System",
    subtitle: "山小屋補給品の在庫・受注・売上管理",
    summary:
      "Java / Spring Boot / SQL / テストを一通り用いた、業務アプリケーション相当の小規模システムです。商品マスタ、入出庫履歴、注文ヘッダと明細、ユーザー認証を分離した正規化設計と、JOIN・GROUP BY を中心とした集計 SQL を組み合わせています。",
    tags: [
      "Java 21",
      "Spring Boot",
      "Spring Security",
      "H2",
      "JUnit 5",
      "REST API",
    ],
    themeClass: "theme-pdm",
    href: "https://github.com/YUTAKONDO1205/Mountain-Supply-System",
    highlights: [
      "注文ライフサイクル — CONFIRMED → SHIPPED / CANCELLED を状態遷移として固定し、再操作は 400 で拒否する",
      "在庫は入出庫履歴から動的算出。キャンセルは ORDER_CANCEL として戻し入庫する",
      "単体テストと結合テストを正常系 / 異常系で分け、Basic 認証つき REST API まで通しで検証",
    ],
  },
  {
    slug: "zumen-llm-docker",
    category: "LLM Workflow",
    title: "Zumen LLM Docker Lab",
    subtitle: "図面業務を LLM で半自動化する実験基盤",
    summary:
      "図面画像からの説明生成、判定理由の文章化、プロンプトのバージョン管理、顧客別用語集、評価データセットの自動採点、監査ログまでを 1 つの FastAPI + htmx アプリにまとめた、図面 LLM ワークフローの実験基盤です。Docker / Dev Container で再現でき、LLM プロバイダは mock ↔ OpenAI 互換で切り替えられます。",
    tags: [
      "FastAPI",
      "htmx",
      "SQLite",
      "Docker",
      "LLM",
      "OCR",
      "Prompt Versioning",
    ],
    themeClass: "theme-eltres",
    href: "https://github.com/YUTAKONDO1205/zumen_llm_docker",
    highlights: [
      "プロンプトを SQLite に version 保存し、改善案をそのまま新 version として有効化できる",
      "評価データセットに JSON アサーションの自動採点を付け、active な prompt version で pass / fail を集計",
      "顧客別の用語集を説明生成へ自動で組み込み、入力と出力を監査ログとして CSV 出力できる",
    ],
  },
] as const;

export const publicationTimeline: readonly PublicationEntry[] = [
  {
    id: "publication-drone",
    date: "2026-01-31",
    dateLabel: "2026.01.31",
    title: "SPRESENSEでインフラ点検向けのエッジAIドローン",
    summary:
      "カメラ、BLE、エッジAI、軽量ドローンを組み合わせ、機体側で判断するインフラ点検の可能性を探った作品です。",
    tags: ["AI", "BLE", "SPRESENSE", "Edge AI", "Drone"],
    awards: ["2025年 SPRESENSE 活用コンテスト クレイン電子 BLEアドオンボード特別賞"],
    href: "https://elchika.com/article/663a49cf-c895-44d7-a989-6e45e7d92056/",
  },
  {
    id: "publication-pdm-edge",
    date: "2026-01-31",
    dateLabel: "2026.01.31",
    title: "加速度・音響信号を活用した異常検知エッジAIモデルの構築",
    summary:
      "加速度と音響を 1 kHz で取得し、FFT ベースの特徴から軽量に異常兆候を判定する構成を整理した記事です。",
    tags: ["AI", "SPRESENSE", "FFT", "Sensor", "Audio"],
    awards: [],
    href: "https://elchika.com/article/7301ab59-0921-4ba7-9935-b9309cf8c59c/",
  },
  {
    id: "publication-vibration",
    date: "2025-01-31",
    dateLabel: "2025.01.31",
    title: "SPRESENSEと振動解析による設備保全の最前線",
    summary:
      "LoRa と振動解析を組み合わせ、遠隔監視と設備保全をつなぐ実装としてまとめた作品です。",
    tags: ["Arduino", "IoT", "LoRa", "MPU6050", "SPRESENSE"],
    awards: [
      "2024年 SPRESENSE 活用コンテスト LoRa活用アイデア賞",
      "2024年 SPRESENSE 活用コンテスト JBAT Qanat Universe賞",
    ],
    href: "https://elchika.com/article/ac986cc9-5c24-4778-952d-a3ec8dca25d0/",
  },
  {
    id: "publication-co2",
    date: "2025-01-31",
    dateLabel: "2025.01.31",
    title: "SPRESENSEとELTRES通信でCO2濃度をマッピング",
    summary:
      "ELTRES とセンシングを組み合わせ、都市部と郊外の CO2 濃度差を可視化した環境モニタリング研究です。",
    tags: ["ELTRES", "IoT", "MATLAB", "SPRESENSE", "Sensor"],
    awards: ["2024年 SPRESENSE 活用コンテスト クレスコ ELTRESアドオンボード優秀賞"],
    href: "https://elchika.com/article/504f286c-413b-47d3-89f9-38920ca5e5c7/",
  },
] as const;

export const recognitions: readonly Recognition[] = [
  {
    year: "2026",
    award: "Microsoft Agent Hackathon 特別賞",
    project: "EdgeOps Command Agent",
    organization: "Microsoft Agent Hackathon powered by Tokyo Electron Device",
    note:
      "点検データをリスク判定・原因推定・作業指示・報告まで変換する 8 エージェント保全 AI として、Human-in-the-loop と監査設計が評価された受賞です。",
    href: "https://github.com/YUTAKONDO1205/EdgeOps-Command-Agent",
  },
  {
    year: "2026",
    award: "SecHack365 '26 トレーニー採択",
    project: "セキュリティ開発者育成プログラム",
    organization: "NICT（情報通信研究機構）",
    note:
      "1 年間にわたり開発・研究を継続するセキュリティイノベーター育成プログラムのトレーニーとして採択されました。",
    href: "https://sechack365.nict.go.jp/",
  },
  {
    year: "2025",
    award: "電気学会 C部門大会 学生ポスター発表",
    project: "振動・音響センサを用いた異常兆候検知システムの開発と AI 識別モデル構築",
    organization: "電気学会 電子・情報・システム部門大会（金沢工業大学）",
    note:
      "振動・音響センサによる異常兆候検知と AI 識別モデル構築を、学生ポスターセッション（PS8-8）で発表しました。",
    href: "https://www.iee.jp/blog/c-taikai-2025/",
  },
  {
    year: "2025",
    award: "IEEJ U-21 2025 奨励賞",
    project: "LoRa通信とAIを活用した振動検知による異常予知システムの構築",
    organization: "電気学会 U-21 学生研究発表会",
    note:
      "LoRa 通信と AI を組み合わせた振動検知システムとして、社会実装への接続性が評価された受賞です。",
    href: "https://www.iee.jp/u-21-2025-award/",
  },
  {
    year: "2025",
    award: "クレイン電子 BLEアドオンボード特別賞",
    project: "SPRESENSEでインフラ点検向けのエッジAIドローン",
    organization: "2025年 SPRESENSE 活用コンテスト",
    note:
      "免許不要ドローン、軽量な SPRESENSE、現実のインフラ課題との接続が評価された受賞です。",
    href: "https://elchika.com/promotion/spresense2025/winner/#nav",
  },
  {
    year: "2024",
    award: "クレスコ ELTRESアドオンボード優秀賞",
    project: "SPRESENSEとELTRES通信でCO2濃度をマッピング",
    organization: "2024年 SPRESENSE 活用コンテスト",
    note:
      "エリアごとの CO2 濃度可視化によって社会課題への理解を促す点が評価された受賞です。",
    href: "https://elchika.com/promotion/spresense2024/winner/#nav",
  },
  {
    year: "2024",
    award: "LoRa活用アイデア賞 / JBAT Qanat Universe賞",
    project: "SPRESENSEと振動解析による設備保全の最前線",
    organization: "2024年 SPRESENSE 活用コンテスト",
    note:
      "遠隔監視と設備保全をつなぐ発想が評価され、LoRa 応用と IoT 応用の両面から受賞しています。",
    href: "https://elchika.com/promotion/spresense2024/winner/#nav",
  },
] as const;

export const projectSlugs = researchProjects.map((project) => project.slug);

export function getResearchProject(slug: string) {
  return researchProjects.find((project) => project.slug === slug);
}

// ============================================================================
// Hero rewrite (v2) — content & conversion overhaul
// ============================================================================

export type HeroCopyV2 = {
  eyebrow: string;
  headlineJa: string;
  headlineEn: string;
  subJa: string;
  subEn: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  latestUpdate: { dateLabel: string; title: string; href: string };
};

export const heroCopyV2: HeroCopyV2 = {
  eyebrow: "Embedded × Edge AI",
  headlineJa: "SPRESENSE で動く、エッジAI を作る。",
  headlineEn: "Embedded AI on SPRESENSE — sensor to marketplace.",
  subJa:
    "振動・音響・画像をデバイス上で判断する組み込み AI エンジニア。研究 4 本・受賞 6 件・SecHack365 '26 採択。VibeGuard を 4 マーケットプレイスへ出荷し、Microsoft Agent Hackathon 特別賞も受賞。",
  subEn: "Edge AI from lab to marketplace — 6 awards, 4 live distributions.",
  primaryCta: {
    label: "VibeGuard を試す",
    href: "https://vibeguard-site.kondo-yuta-02.workers.dev",
  },
  secondaryCta: { label: "研究を読む", href: "/research" },
  latestUpdate: {
    dateLabel: "2026.08",
    title: "VibeGuard 公式サイトを公開 — v0.3.6 / 85 ルール",
    href: "https://vibeguard-site.kondo-yuta-02.workers.dev",
  },
} as const;

// ============================================================================
// Awards strip — social proof at-a-glance
// ============================================================================

export type AwardBadge = {
  year: string;
  organization: string;
  award: string;
  href: string;
  /** Distinguishes actual prizes (受賞) from selections/presentations so the
      "受賞 N 件" headline stays consistent across the site. Omitted = award. */
  kind?: "award" | "selection" | "presentation";
};

export const awardBadges: readonly AwardBadge[] = [
  {
    year: "2026",
    organization: "Microsoft Agent Hackathon",
    award: "特別賞",
    href: "https://github.com/YUTAKONDO1205/EdgeOps-Command-Agent",
  },
  {
    year: "2026",
    organization: "SecHack365",
    award: "'26 トレーニー採択",
    href: "https://sechack365.nict.go.jp/",
    kind: "selection",
  },
  {
    year: "2025",
    organization: "IEEJ C部門大会",
    award: "学生ポスター発表",
    href: "https://www.iee.jp/blog/c-taikai-2025/",
    kind: "presentation",
  },
  {
    year: "2025",
    organization: "IEEJ U-21",
    award: "奨励賞",
    href: "https://www.iee.jp/u-21-2025-award/",
  },
  {
    year: "2025",
    organization: "SPRESENSE Contest",
    award: "クレイン電子 BLEアドオンボード特別賞",
    href: "https://elchika.com/promotion/spresense2025/winner/#nav",
  },
  {
    year: "2024",
    organization: "SPRESENSE Contest",
    award: "クレスコ ELTRES優秀賞",
    href: "https://elchika.com/promotion/spresense2024/winner/#nav",
  },
  {
    year: "2024",
    organization: "SPRESENSE Contest",
    award: "LoRa活用アイデア賞",
    href: "https://elchika.com/promotion/spresense2024/winner/#nav",
  },
  {
    year: "2024",
    organization: "SPRESENSE Contest",
    award: "JBAT Qanat Universe賞",
    href: "https://elchika.com/promotion/spresense2024/winner/#nav",
  },
] as const;

/** True for an actual prize (受賞) — excludes selections (採択) / presentations
    (発表). Single source of truth for the "受賞 N 件" count across the site. */
export function isAwardPrize(badge: AwardBadge): boolean {
  return badge.kind === undefined || badge.kind === "award";
}

/** Canonical 受賞 count (currently 6). Use this everywhere "受賞 N 件" appears. */
export const awardPrizeCount = awardBadges.filter(isAwardPrize).length;

// ============================================================================
// Positioning radar — competitor-teardown derived
// ============================================================================

export type PositioningAxis = {
  key: "signal" | "edge" | "ship" | "research" | "ops";
  labelEn: string;
  labelJa: string;
  score: number; // 0-10
  evidence: string;
};

export type PositioningSilhouette = {
  id: "yuta" | "typical-embedded" | "typical-ai";
  label: string;
  scores: Record<PositioningAxis["key"], number>;
  tone: "primary" | "ghost-embedded" | "ghost-ai";
};

export type Positioning = {
  label: string;
  title: string;
  thesisJa: string;
  thesisEn: string;
  axes: readonly PositioningAxis[];
  silhouettes: readonly PositioningSilhouette[];
};

export const positioning: Positioning = {
  label: "Positioning",
  title: "研究と実装と公開を、ひとりで閉じる",
  thesisJa:
    "研究の公開ループも、出荷した製品も、両方ある。組み込みエンジニアの多くは前者で止まり、AI エンジニアの多くは後者を持たない。",
  thesisEn:
    "Most embedded engineers stop at the device. Most AI engineers stop at the notebook. I ship both ends.",
  axes: [
    {
      key: "signal",
      labelEn: "Signal Breadth",
      labelJa: "信号の幅",
      score: 9,
      evidence:
        "画像・振動・音響・GPS+CO2・AI生成コード — 5 modalities",
    },
    {
      key: "edge",
      labelEn: "Edge Constraint",
      labelJa: "エッジ制約下の実装",
      score: 9,
      evidence:
        "SPRESENSE FFT + Random Forest + TFLite Micro + .tflite→C++ header",
    },
    {
      key: "ship",
      labelEn: "Ship to Market",
      labelJa: "市場への到達",
      score: 8,
      evidence:
        "VibeGuard live: GitHub Marketplace, VS Code, Chrome Web Store, Open VSX + 公式サイト",
    },
    {
      key: "research",
      labelEn: "Public Research",
      labelJa: "公開研究の継続性",
      score: 9,
      evidence:
        "4 Elchika 記事 + 受賞 6 件 + 電気学会 C部門発表 + SecHack365 '26 採択",
    },
    {
      key: "ops",
      labelEn: "Operationalization",
      labelJa: "運用接続",
      score: 8,
      evidence:
        "EdgeOps 8-agent + 承認/監査ワークフロー、anomaly-event-api の NEW/CHECKING/RESOLVED",
    },
  ],
  silhouettes: [
    {
      id: "yuta",
      label: "近藤悠太",
      tone: "primary",
      scores: { signal: 9, edge: 9, ship: 8, research: 9, ops: 8 },
    },
    {
      id: "typical-embedded",
      label: "一般的な組み込みエンジニア",
      tone: "ghost-embedded",
      scores: { signal: 5, edge: 8, ship: 3, research: 4, ops: 4 },
    },
    {
      id: "typical-ai",
      label: "一般的な AI エンジニア",
      tone: "ghost-ai",
      scores: { signal: 6, edge: 4, ship: 5, research: 6, ops: 8 },
    },
  ],
} as const;
