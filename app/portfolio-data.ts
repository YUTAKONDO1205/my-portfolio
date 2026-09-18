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
  /** Optional: an award the work received, shown as a lead line on the card */
  award?: { label: string; href: string };
};

export const platformLinks: readonly PlatformLink[] = [
  {
    href: "https://github.com/YUTAKONDO1205",
    label: "GitHub",
    description: "コードと測定データ",
    detail:
      "研究の途中経過も含めて公開しています。組み込み、機械学習、API、実験用スクリプトを掲載しています。",
  },
  {
    href: "https://elchika.com/user/kd_yuta/?page=0",
    label: "Elchika",
    description: "作品ごとの解説記事",
    detail:
      "課題、構成、評価、今後の予定を、作品ごとに記載しています。",
  },
  {
    href: "https://zenn.dev/kd_yuta",
    label: "Zenn",
    description: "LLM エージェントの設計記事",
    detail:
      "Microsoft Agent Hackathon に提出した EdgeOps Command Agent の設計と、承認ゲートや監査ログの考え方を記載しています。",
  },
  {
    href: "https://vibeguard-site.kondo-yuta-02.workers.dev",
    label: "VibeGuard 公式サイト",
    description: "ルール一覧と検出例",
    detail:
      "検出ルールの一覧、実際の検出例、リリース履歴を掲載しています。内容はリポジトリから自動生成しています。",
  },
] as const;

export const focusAreas: readonly FocusArea[] = [
  {
    label: "Signal",
    title: "現場の信号を取る",
    description:
      "画像、振動、音響、位置情報を、現場に設置できるセンサで計測します。",
  },
  {
    label: "Edge",
    title: "軽量に判断する",
    description:
      "SPRESENSE のメモリと演算性能に収まるよう、FFT、Random Forest、MobileNetV2 を用いて端末上で判定します。",
  },
  {
    label: "Open",
    title: "公開しながら磨く",
    description:
      "コードと記事を、研究の途中から公開しています。",
  },
] as const;

export const siteAxis: SiteAxis = {
  label: "Research Flow",
  title: "研究テーマ",
  summary:
    "SPRESENSE 上でセンサ信号を処理する研究が 3 件、検知結果を運用で利用するための API が 1 件あります。",
  detail:
    "いずれの研究も、信号の計測、端末上での判定、公開の順に進めています。背景の粒子は、この 3 段階に対応する形へ変化します。",
  steps: [
    {
      en: "Sense",
      ja: "現場での計測",
      description:
        "画像、振動、音響、位置情報、CO2 濃度を、現場に設置したセンサで計測します。",
    },
    {
      en: "Decide",
      ja: "端末上での判定",
      description:
        "SPRESENSE のメモリと演算性能に収まるよう、FFT による特徴量と軽量なモデルで判定します。",
    },
    {
      en: "Share",
      ja: "公開",
      description:
        "コードは GitHub で、経緯と評価は Elchika と Zenn で公開しています。学会でも発表しています。",
    },
  ],
} as const;

export const philosophy: Philosophy = {
  label: "Philosophy",
  title: "開発の方針",
  body: "開発したものが動作しても、現場で使われなければ意味がないと考えています。そのため、センサ、端末上の推論、通信、API、画面までを一通り自分で実装しています。送信するデータは必要な分に絞り、検知結果は記録して、あとから参照できるようにしています。",
  english:
    "I build things until they can actually be used in the field.",
} as const;

export const researchProjects: readonly ResearchProject[] = [
  {
    slug: "drone-inspector",
    year: "2026",
    title: "DroneInspector",
    subtitle: "インフラ点検向けエッジAIドローン",
    cardSummary:
      "狭小なインフラ空間の点検を想定した研究です。SPRESENSE 上で、撮像、画質ゲート、分類、証跡の保存、監督制御までを実行します。ぼけた画像や白飛びした画像を、検知しないまま分類へ渡さないことを重視しました。",
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
          "トンネルや水道管のような通信条件の悪い場所では、撮影して持ち帰るだけでは作業の負荷が大きく残ります。さらに問題となるのは、品質基準を満たさないフレームをその場で棄却する人がいないことです。品質ゲートも棄却も既知の手法ですが、それらが監督制御の判断へどう伝播するかは、測定しなければ明らかになりません。この研究では、固定した証拠を用いてこの伝播を測定しました。",
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
      "画質ゲート → 分類 → 証跡 → 5 状態の監督制御を、1 本の不変条件として固定しました。",
      "証跡ストアは索引を保存しません。走査による再構築は、40/40 試行で完全に回復しました。",
      "6 層の入れ替え比較 (E1–E6) を行い、5 つが想定と異なる挙動を示すことを実測しました。",
      "STPA + FMEA、Simulink/Stateflow モデル、飛行 SIL までを含む一次資料を公開しています。",
      "2025 年 SPRESENSE 活用コンテストで特別賞を受賞しました。",
    ],
  },
  {
    slug: "pdm-edge",
    year: "2026",
    title: "pdm_edge",
    subtitle: "加速度・音響を用いた異常検知エッジAI",
    cardSummary:
      "加速度 3 軸と音響の 4 チャンネルを FFT で特徴量に変換し、SPRESENSE 上で動作する軽量な異常検知を構築しました。",
    pageSummary:
      "計算量の大きい解析を用いずに、異常の兆候をどこまで検出できるかを検討した研究です。波形から周波数特徴を生成し、固定長の特徴量として軽量な実装で扱えるようにしました。",
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
          "通信を前提とした大規模な解析系は用いず、設備の近傍で異常の兆候を検出できる最小構成を目指しました。現場に設置できる軽量さと再現性を優先しています。",
      },
      {
        title: "構成",
        body:
          "1 kHz の時系列を FFT で周波数特徴へ変換し、0 から 500 Hz を固定 bin に要約して Random Forest へ渡します。学習後はヘッダ化して SPRESENSE へ持ち込めるようにしています。",
      },
      {
        title: "現在地",
        body:
          "学習、評価、ヘッダの再生成、SPRESENSE 側からの呼び出しまで動作しています。異常の見逃しを減らすため、再現率を優先した構成です。",
      },
    ],
    highlights: [
      "4 チャンネルを同時に処理し、設備の状態変化を複数の信号から捉えます。",
      "特徴量を固定長にして、組み込み環境へ移植しやすくしました。",
      "2024 年の LoRa 振動解析から継続しているテーマです。",
    ],
  },
  {
    slug: "anomaly-event-api",
    year: "2026",
    title: "anomaly-event-api",
    subtitle: "異常検知をイベント運用までつなぐ API",
    cardSummary:
      "画像のアップロード、異常検知、判定の説明、イベントの保存、ダッシュボード表示を 1 つの API として実装しました。検知後の運用までを対象としています。",
    pageSummary:
      "判定結果を返したあと、イベントとして保存し、確認し、状態を更新するところまでを実装しました。ローカル環境と AWS のどちらでも、同じ操作で検証できます。",
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
          "現場では、判定そのものに加えて、結果を保存して参照し、対応状況を更新できることが必要だと考えました。このため検知結果をイベントとして扱い、運用上の判断に利用できる形で記録しています。",
      },
      {
        title: "構成",
        body:
          "Node.js + TypeScript の API 層に Python 推論を接続し、Grad-CAM、focus regions、attention grid といった説明情報も返すようにしています。local と AWS のモード差もサービス層で吸収しています。",
      },
      {
        title: "現在地",
        body:
          "検知、イベント化、可視化、provider の切り替えまで動作しています。",
      },
    ],
    highlights: [
      "local と AWS のどちらでも、同じ操作で動作します。",
      "対応状況を NEW / CHECKING / RESOLVED の 3 状態で管理します。",
      "判定の説明（Grad-CAM など）とイベント管理を、同じ画面で扱えます。",
    ],
  },
  {
    slug: "eltres-co2-mapping",
    year: "2025",
    title: "Eltres_CO2_Mapping",
    subtitle: "ELTRES通信によるCO2濃度マッピング",
    cardSummary:
      "SPRESENSE と ELTRES で CO2 濃度と位置情報を交互に送信し、都市部と郊外の濃度差を地図上に可視化しました。",
    pageSummary:
      "通信、解析、表示までを一貫して実装した環境モニタリングの研究です。CO2 濃度と位置情報を ELTRES で送り、CLIP Viewer Lite API から MATLAB で取得し、Web ダッシュボードに表示しています。",
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
          "目に見えない CO2 濃度を、エリアごとの差として把握できるようにすることが目的です。現場で計測した値を、その場で確認できるところまで実装しました。",
      },
      {
        title: "構成",
        body:
          "SPRESENSE でセンサ値と位置情報を交互に取得し、ELTRES アドオンで送信します。クラウド側では CLIP Viewer Lite API から MATLAB で取得し、Web ダッシュボードで可視化しています。",
      },
      {
        title: "現在地",
        body:
          "通信、解析、表示までが接続され、センサの値をエリアごとの濃度差として地図上に表示できます。環境モニタリングの基礎となる構成です。",
      },
    ],
    highlights: [
      "送信データを最小限に抑えたまま、空間分布を取得できます。",
      "MATLAB から Web ダッシュボードまでの可視化を一通り実装しました。",
      "クレスコ ELTRESアドオンボード優秀賞を受賞したテーマです。",
    ],
  },
] as const;

export const selectedWorks: readonly SelectedWork[] = [
  {
    slug: "vibeguard",
    category: "Security Tooling",
    title: "VibeGuard",
    subtitle: "AI 生成コードの脆弱性を 3 か所で検出する診断ツール",
    summary:
      "書くとき（VS Code / Open VSX）、読むとき（Chrome）、マージする前（GitHub Actions / CLI）の 3 か所で、同じ analyzer-core が動作します。注入、秘密情報の埋め込み、認証の省略、スタブのままの実装を、同じ基準で検出します。解析は手元の端末で完結し、コードを外部へ送信しません。",
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
      "解析コアは 1 つです。同じ analyzer-core を 4 つの配布先で提供し、どこで実行しても同じ判定になります。",
      "SES2026 で一般論文として発表しました（2026.09.11、慶應日吉）。CSS2026 では、一般発表 4D2-3 に採択されています（2026.10.22、浜松）。",
      "85 ルール、11 言語に対応しています。内訳は単一ファイル 74、ファイル横断 11 です。対象言語は c / cpp / csharp / go / java / javascript / kotlin / php / python / ruby / typescript です。",
      "自動修正は 7 件あります。確認なしで適用できるものは 1 件のみで、残りは needs-review と表示し、人が判断します。",
      "公式サイトのルール一覧、検出例、バージョンは、リポジトリから自動生成しています。手入力の数値はありません。",
      "MCP サーバを提供しています。エージェントがファイルを書き込む前に同じエンジンへ問い合わせ、ALLOWED / REFUSED を返します。",
      "テレメトリも外部送信もありません。ネットワークを遮断しても結果がバイト単位で一致することを、CI で検証しています。",
      "PR の追加行だけを走査し、SARIF 形式で GitHub Code Scanning に出力します。",
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
    subtitle: "点検データから作業指示までを出力する保全向けマルチエージェント",
    summary:
      "異常検知後の作業までを対象とする、Azure ベースの保全 AI です。センサ、画像、点検メモ、マニュアル、故障履歴を 8 つのエージェントで処理し、リスク判定、原因の推定、作業指示、報告書を出力します。結果は、人が承認、修正依頼、却下のいずれかを選択する前提で、操作は監査ログに記録されます。",
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
      "8 エージェントで構成しています。処理順は Intake、Signal、Vision、Manual RAG、Root Cause、Action、What-if、Governance です。",
      "Azure OpenAI / Semantic Kernel / Azure AI Search を用いて、RAG と画像解析を行います。",
      "SPRESENSE などのエッジ機器のデータを、Event Hubs 経由で取り込みます。",
      "承認と監査のワークフローを備えています。実行履歴を Cosmos DB に記録し、Teams へ通知します。",
      "20 シナリオ × 4 深刻度を、108 項目のポリシーチェックで検証しました（全項目 pass）。",
    ],
    award: {
      label: "Microsoft Agent Hackathon 2026 特別賞（個人部門）",
      href: "https://zenn.dev/kd_yuta/articles/edgeops-command-agent",
    },
  },
  {
    slug: "travel-app-patch",
    category: "LLM Multi-Agent",
    title: "Maison Passage",
    subtitle: "片道航空券 2 枚で組み立てる海外旅行プランナー",
    summary:
      "片道航空券 2 枚の組み合わせで海外旅行を検索するプランナーです。Codex の Planner / Generator / Evaluator の 3 役をローカルで反復実行して開発しています。仕様は specs/spec.json の 1 ファイルで管理し、スプリントごとに機能を追加しています。現在は Sprint 10（複数地域をまたぐ経路の現実性と、ラベルの整合）に取り組んでいます。",
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
      "Planner / Generator / Evaluator の 3 役をローカルの Codex で反復実行し、PASS / FAIL のレポートを成果物として記録します。",
      "複数月 × 滞在日数の幅で検索できます。最安の往路日を選択し、滞在日数を加えて復路を検索します。",
      "概算の見積もりと、事業者から取得した実際の運賃を、画面上で区別して表示します。取得できなかった場合は、その旨を表示します。",
    ],
  },
  {
    slug: "mountain-supply-system",
    category: "Business System",
    title: "Mountain Supply System",
    subtitle: "山小屋補給品の在庫・受注・売上管理",
    summary:
      "山小屋の補給品を管理する小規模な業務システムです。Java と Spring Boot で開発し、SQL とテストまで一通り実装しました。商品マスタ、入出庫履歴、注文ヘッダと明細、ユーザー認証を別のテーブルに分離し、集計は JOIN と GROUP BY で記述しています。",
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
      "注文の状態遷移は CONFIRMED → SHIPPED / CANCELLED に固定しています。確定後の再操作は 400 で拒否します。",
      "在庫は入出庫履歴から動的に算出します。キャンセルは ORDER_CANCEL として戻し入庫します。",
      "単体テストと結合テストを正常系 / 異常系に分け、Basic 認証つきの REST API まで通して検証しました。",
    ],
  },
  {
    slug: "zumen-llm-docker",
    category: "LLM Workflow",
    title: "Zumen LLM Docker Lab",
    subtitle: "図面業務を LLM で半自動化する実験基盤",
    summary:
      "図面画像の説明生成、判定理由の文章化、プロンプトのバージョン管理、顧客別の用語集、評価データの自動採点、監査ログを、1 つの FastAPI + htmx アプリとして実装しました。Docker / Dev Container で再現でき、LLM は mock と OpenAI 互換 API を切り替えられます。",
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
      "プロンプトを SQLite に version として保存し、改善案をそのまま新しい version として有効化できます。",
      "評価データセットに JSON アサーションの自動採点を設け、active な prompt version で pass / fail を集計します。",
      "顧客別の用語集を説明生成へ自動で組み込み、入力と出力を監査ログとして CSV 出力できます。",
    ],
  },
] as const;

export const publicationTimeline: readonly PublicationEntry[] = [
  {
    id: "publication-edgeops-zenn",
    date: "2026-06-01",
    dateLabel: "2026.06.01",
    title:
      "異常検知で終わらせない。現場保全の判断と行動を支援するAIエージェントをAzureで作った",
    summary:
      "Microsoft Agent Hackathon 2026 に提出した EdgeOps Command Agent の設計記事です。8 エージェント構成、承認ゲート、監査ログの考え方を Zenn にまとめています。",
    tags: ["Azure", "Semantic Kernel", "Multi-Agent", "Anomaly", "Dashboard"],
    awards: ["Microsoft Agent Hackathon 2026 特別賞（個人部門）"],
    href: "https://zenn.dev/kd_yuta/articles/edgeops-command-agent",
  },
  {
    id: "publication-drone",
    date: "2026-01-31",
    dateLabel: "2026.01.31",
    title: "SPRESENSEでインフラ点検向けのエッジAIドローン",
    summary:
      "カメラ、BLE、エッジ AI、軽量ドローンを組み合わせ、機体側で判断するインフラ点検を試作した作品です。",
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
      "LoRa と振動解析を組み合わせ、遠隔から設備の状態を監視する作品です。",
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
    award: "CSS2026 一般発表 採択（4D2-3）",
    project:
      "VibeGuard Compiler：コンパイラ最適化におけるセキュリティ性質消失の追跡と第一喪失点の特定",
    organization: "コンピュータセキュリティシンポジウム 2026（浜松）",
    note:
      "コンパイラ最適化の過程でセキュリティ性質が失われる点を追跡し、第一喪失点を特定する方式を、セキュア開発セッションで 2026 年 10 月 22 日に発表予定です。",
    href: "https://www.iwsec.org/css/2026/program.html",
  },
  {
    year: "2026",
    award: "SES2026 一般論文 発表",
    project:
      "AI生成コードの採用判断点に基づくマルチコンテキストセキュリティ診断配置方式の提案とVibeGuardによる検証",
    organization: "ソフトウェアエンジニアリングシンポジウム 2026（慶應義塾大学 日吉）",
    note:
      "AI 生成コードの安全確認を採用判断点への診断配置の問題として扱い、VibeGuard の実装と測定で検証した単著論文を 2026 年 9 月 11 日に発表しました。",
    href: "https://ses.sigse.jp/2026/program.html",
  },
  {
    year: "2026",
    award: "Microsoft Agent Hackathon 2026 特別賞（個人部門）",
    project: "EdgeOps Command Agent",
    organization: "Microsoft Agent Hackathon powered by Tokyo Electron Device",
    note:
      "点検データからリスク判定、原因の推定、作業指示、報告書までを出力する 8 エージェントの保全 AI です。人の承認を挟む構成と監査ログが評価されました。",
    href: "https://zenn.dev/kd_yuta/articles/edgeops-command-agent",
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
      "LoRa 通信と AI を組み合わせた振動検知システムで受賞しました。",
    href: "https://www.iee.jp/u-21-2025-award/",
  },
  {
    year: "2025",
    award: "クレイン電子 BLEアドオンボード特別賞",
    project: "SPRESENSEでインフラ点検向けのエッジAIドローン",
    organization: "2025年 SPRESENSE 活用コンテスト",
    note:
      "免許のいらない軽量ドローンと SPRESENSE で、インフラ点検の課題を扱った点が評価されました。",
    href: "https://elchika.com/promotion/spresense2025/winner/#nav",
  },
  {
    year: "2024",
    award: "クレスコ ELTRESアドオンボード優秀賞",
    project: "SPRESENSEとELTRES通信でCO2濃度をマッピング",
    organization: "2024年 SPRESENSE 活用コンテスト",
    note:
      "エリアごとの CO2 濃度を地図にした点が評価されました。",
    href: "https://elchika.com/promotion/spresense2024/winner/#nav",
  },
  {
    year: "2024",
    award: "LoRa活用アイデア賞 / JBAT Qanat Universe賞",
    project: "SPRESENSEと振動解析による設備保全の最前線",
    organization: "2024年 SPRESENSE 活用コンテスト",
    note:
      "遠隔から設備を監視する構成で、LoRa 活用と IoT 活用の 2 つの賞を受賞しました。",
    href: "https://elchika.com/promotion/spresense2024/winner/#nav",
  },
] as const;

// ============================================================================
// Talks & papers — refereed venues, in chronological order
// ============================================================================

export type Talk = {
  id: string;
  /** ISO date used only for ordering; `dateLabel` is what is displayed */
  date: string;
  dateLabel: string;
  status: "presented" | "upcoming";
  venueShort: string;
  venue: string;
  kind: string;
  session?: string;
  place?: string;
  title: string;
  project: string;
  href: string;
};

export const talks: readonly Talk[] = [
  {
    id: "talk-css2026",
    date: "2026-10-22",
    dateLabel: "2026.10.22",
    status: "upcoming",
    venueShort: "CSS2026",
    venue: "コンピュータセキュリティシンポジウム 2026",
    kind: "一般発表",
    session: "4D2-3 セキュア開発 2",
    place: "浜松",
    title:
      "VibeGuard Compiler：コンパイラ最適化におけるセキュリティ性質消失の追跡と第一喪失点の特定",
    project: "VibeGuard Compiler",
    href: "https://www.iwsec.org/css/2026/program.html",
  },
  {
    id: "talk-ses2026",
    date: "2026-09-11",
    dateLabel: "2026.09.11",
    status: "presented",
    venueShort: "SES2026",
    venue: "ソフトウェアエンジニアリングシンポジウム 2026",
    kind: "一般論文",
    session: "コード解析・セキュリティ・テスト支援",
    place: "慶應義塾大学 日吉キャンパス",
    title:
      "AI生成コードの採用判断点に基づくマルチコンテキストセキュリティ診断配置方式の提案とVibeGuardによる検証",
    project: "VibeGuard",
    href: "https://ses.sigse.jp/2026/program.html",
  },
  {
    id: "talk-ieej-c-2025",
    date: "2025-08-28",
    dateLabel: "2025.08",
    status: "presented",
    venueShort: "IEEJ C部門大会 2025",
    venue: "電気学会 電子・情報・システム部門大会",
    kind: "学生ポスター",
    session: "PS8-8",
    place: "金沢工業大学",
    title:
      "振動・音響センサを用いた異常兆候検知システムの開発と AI 識別モデル構築",
    project: "pdm_edge",
    href: "https://www.iee.jp/blog/c-taikai-2025/",
  },
  {
    id: "talk-ieej-u21-2025",
    date: "2025-03-01",
    dateLabel: "2025",
    status: "presented",
    venueShort: "IEEJ U-21 2025",
    venue: "電気学会 U-21 学生研究発表会",
    kind: "学生研究発表",
    session: "2D-2 · 奨励賞",
    title: "LoRa通信とAIを活用した振動検知による異常予知システムの構築",
    project: "振動解析による設備保全",
    href: "https://www.iee.jp/u-21-2025-award/",
  },
] as const;

// ============================================================================
// Profile
// ============================================================================

export type ProfileFact = { label: string; value: string };

export type Profile = {
  nameJa: string;
  nameEn: string;
  role: string;
  affiliation: string;
  grade: string;
  base: string;
  facts: readonly ProfileFact[];
};

export const profile: Profile = {
  nameJa: "近藤悠太",
  nameEn: "Kondo Yuta",
  role: "Edge AI / 組み込みエンジニア",
  affiliation: "近畿大学 工学部 電子情報工学科 電気電子コース",
  grade: "学部 4 年（2027 年 3 月 卒業見込み）",
  base: "広島",
  facts: [
    { label: "Program", value: "SecHack365 2026 研究駆動コース トレーニー" },
    {
      label: "Certification",
      value: "AWS Certified Solutions Architect – Associate",
    },
    { label: "English", value: "TOEIC 880" },
    { label: "Handles", value: "GitHub YUTAKONDO1205 · Elchika / Zenn kd_yuta" },
  ],
} as const;

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
  headlineJa: "現場の信号をマイコン上で判定するエッジ AI",
  headlineEn: "Sense. Decide. Share.",
  subJa:
    "振動、音響、画像をマイコン上で判定する研究に取り組んでいます。AI 生成コードの診断ツール VibeGuard を開発して 4 つのストアで公開し、SES2026 で論文を発表しました。",
  subEn:
    "Edge AI, from the lab to the marketplace.",
  primaryCta: {
    label: "VibeGuard を試す",
    href: "https://vibeguard-site.kondo-yuta-02.workers.dev",
  },
  secondaryCta: { label: "研究を読む", href: "/research" },
  latestUpdate: {
    dateLabel: "2026.09.11",
    title: "SES2026 で VibeGuard の論文を発表しました。次は CSS2026（10.22 浜松）です。",
    href: "https://ses.sigse.jp/2026/program.html",
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
    organization: "CSS2026 · セキュア開発",
    award: "一般発表 採択 4D2-3",
    href: "https://www.iwsec.org/css/2026/program.html",
    kind: "presentation",
  },
  {
    year: "2026",
    organization: "SES2026 · 慶應日吉",
    award: "一般論文 発表",
    href: "https://ses.sigse.jp/2026/program.html",
    kind: "presentation",
  },
  {
    year: "2026",
    organization: "Microsoft Agent Hackathon",
    award: "特別賞（個人部門）",
    href: "https://zenn.dev/kd_yuta/articles/edgeops-command-agent",
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

/** VibeGuard shipping stats — from CHANGELOG.md of the v0.3.6 release
    (2026-08-17). Re-check against the repository before bumping. */
export const vibeguardStats = {
  version: "0.3.6",
  rules: 85,
  singleFileRules: 74,
  crossFileRules: 11,
  languages: 11,
  fixers: 7,
  safeFixers: 1,
} as const;

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
  title: "自己評価（5 軸）",
  thesisJa:
    "組み込みの研究に取り組みながら、VibeGuard を 4 つのストアで公開しています。下の 5 軸は自己評価です。",
  thesisEn:
    "Embedded research on one side, a shipped product on the other.",
  axes: [
    {
      key: "signal",
      labelEn: "Signal Breadth",
      labelJa: "信号の幅",
      score: 9,
      evidence:
        "画像、振動、音響、GPS+CO2、AI 生成コードの 5 種類",
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
        "VibeGuard v0.3.6 live: GitHub Marketplace, VS Code, Chrome Web Store, Open VSX + 公式サイト",
    },
    {
      key: "research",
      labelEn: "Public Research",
      labelJa: "公開研究の継続性",
      score: 9,
      evidence:
        "記事 5 本 + 受賞 6 件 + SES2026 発表 + CSS2026 採択 + 電気学会 2 件 + SecHack365 '26",
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
