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

export type SelectedWork = {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  summary: string;
  tags: readonly string[];
  themeClass: "theme-drone" | "theme-pdm" | "theme-anomaly" | "theme-eltres";
  href: string;
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
    href: "https://www.linkedin.com/in/kondo-yuta-985430317",
    label: "LinkedIn",
    description: "活動全体を俯瞰して見せる外部プロフィール",
    detail:
      "研究、制作、プロフィールをまとめて見せる窓口として運用しています。",
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
  body: "良いエンジニアリングは、ただ動くものを作ることではなく、現場で実際に使えるシステムを設計することだと考えています。だからこそ、センサ取得、エッジ推論、通信、API、可視化までを横断し、必要な情報だけを送る省通信設計と、運用へつなげるイベント設計をひとつの体験として組み立てています。",
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
      "狭小インフラ空間での点検を想定し、Spresense ベースで画像取得、IMU 記録、保存、通知をつなげた研究です。",
    pageSummary:
      "空間の制約が大きい点検現場で、機体側がどこまで判断できるかを探る研究です。画像、IMU、保存、通知、軽量推論をひとつの飛行体へ載せる前提で構成を整理しています。",
    heroKicker: "Skyborne Inspection",
    heroEnglish: "Read the scene before the signal is lost.",
    themeClass: "theme-drone",
    ambientClass: "ambient-clouds",
    tags: [
      "Spresense",
      "Drone",
      "BLE",
      "TensorFlow Lite Micro",
      "MobileNetV2",
      "Inspection",
    ],
    links: [
      {
        href: "https://github.com/YUTAKONDO1205/DroneInspector",
        label: "GitHub Repository",
      },
      {
        href: "https://elchika.com/article/663a49cf-c895-44d7-a989-6e45e7d92056/",
        label: "Elchika Article",
      },
    ],
    sections: [
      {
        title: "着眼点",
        body:
          "トンネルや水道管のような通信条件の悪い場所では、単に撮影して持ち帰るだけでは作業の負荷が大きく残ります。そこで、機体側で画像取得と証跡保存を完結させつつ、損傷検出時のみ「画像 + 位置 + 確信度」を扱う省通信設計に寄せています。",
      },
      {
        title: "構成",
        body:
          "ファームウェア側では JPEG 保存、IMU 記録、microSD 保存、BLE 通知、TensorFlow Lite Micro の読み込みを一連化しています。学習済みモデルを `.tflite` から C++ 配列へ変換する流れも切り分けています。",
      },
      {
        title: "現在地",
        body:
          "現状は取得、保存、ログ化の流れが安定しており、完全な機体側推論へ向けて生画像経路とメモリ調整を詰めている段階です。",
      },
    ],
    highlights: [
      "画像保存と IMU ログ取得を止めないフォールバック設計",
      "camera / imu / ble / storage を分割した確認しやすい構成",
      "必要な情報だけを送る省通信前提のアーキテクチャ",
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
      "予兆保全を現場寄りに考えるために、重い解析を避けつつ異常兆候の差をどこまで拾えるかを探った研究です。波形から周波数特徴を作り、固定長の特徴として軽量実装へ寄せています。",
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
        label: "GitHub Repository",
      },
      {
        href: "https://elchika.com/article/7301ab59-0921-4ba7-9935-b9309cf8c59c/",
        label: "Elchika Article",
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
        label: "GitHub Repository",
      },
    ],
    sections: [
      {
        title: "着眼点",
        body:
          "現場で本当に必要なのは、判定の有無だけではなく、その結果を保存し、見返し、状態を変えられることだと考えています。そのため異常検知をイベント運用へつなげ、リアルタイムに価値へ変換する仕組みとして設計しています。",
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
      "Spresense と ELTRES を組み合わせ、CO2 濃度と位置情報を交互に送信して都市と郊外の濃度差を可視化した研究です。",
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
        label: "GitHub Repository",
      },
      {
        href: "https://elchika.com/article/504f286c-413b-47d3-89f9-38920ca5e5c7/",
        label: "Elchika Article",
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
          "Spresense でセンサ値と位置情報を交互に取得し、ELTRES アドオンで送信します。クラウド側では CLIP Viewer Lite API から MATLAB で取得し、Web ダッシュボードで可視化しています。",
      },
      {
        title: "現在地",
        body:
          "通信、解析、表示までが一連でつながり、センサデータを「見える価値」に変える環境モニタリングの基礎構成として位置づいています。",
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
    subtitle: "AI 生成コード向けセキュリティ診断基盤",
    summary:
      "開発中（VS Code）・閲覧中（Chrome）・マージ前（GitHub Actions / CLI）の 3 段階で同一の解析コアを使い、AI が書いたコードの典型的な地雷を検出する統合診断基盤です。GitHub Marketplace にも公開しています。",
    tags: [
      "TypeScript",
      "SARIF",
      "GitHub Actions",
      "VS Code",
      "Chrome",
      "AI Code Review",
    ],
    themeClass: "theme-anomaly",
    href: "https://github.com/YUTAKONDO1205/VibeGuard",
  },
  {
    slug: "travel-app-patch",
    category: "LLM Multi-Agent",
    title: "Maison Passage",
    subtitle: "片道航空券 2 枚で組み立てる海外旅行プランナー",
    summary:
      "海外旅行を「2 枚の片道航空券」として検索するプレミアム旅行プランナーです。Codex の Planner / Generator / Evaluator マルチエージェントハーネスをローカルで運用し、スプリント単位で機能を進化させています。",
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
  },
  {
    slug: "mountain-supply-system",
    category: "Business System",
    title: "Mountain Supply System",
    subtitle: "山小屋補給品の在庫・受注・売上管理",
    summary:
      "Java / Spring Boot / SQL / テストを盛り込んだ業務アプリ風ミニシステムです。商品マスタ、入出庫履歴、注文ヘッダと明細、ユーザー認証を分離した正規化設計と、JOIN・GROUP BY を中心とした集計 SQL を組み合わせています。",
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
      "免許不要ドローン、軽量な Spresense、現実のインフラ課題との接続が評価された受賞です。",
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
