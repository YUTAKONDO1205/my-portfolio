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
  themeClass: "theme-drone" | "theme-pdm" | "theme-anomaly";
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
  title: "現場の信号を、判断と公開へつないでいく。",
  summary:
    "このサイトの軸は、センサで拾った信号をエッジで読み、公開しながら次の研究へつなげる流れです。",
  detail:
    "現場で信号を取り、軽量に判断し、GitHub と Elchika で公開するまでの流れを、このサイト全体の軸にしています。",
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
          "トンネルや水道管のような通信条件の悪い場所では、単に撮影して持ち帰るだけでは作業の負荷が大きく残ります。そこで、機体側で画像取得と証跡保存を完結させつつ、必要な情報だけを扱う方向に寄せています。",
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
          "現場で本当に必要なのは、判定の有無だけではなく、その結果を保存し、見返し、状態を変えられることだと考えています。そのため異常検知をイベント運用へつなげています。",
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
