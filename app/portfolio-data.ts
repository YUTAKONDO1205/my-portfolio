import { aiLeaders2026Deck, type SlideDeck } from "./slide-decks";

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

/** A paper as published in the proceedings. `citation` keeps the
    proceedings title as printed; `href` is the publisher's record page. */
export type PaperRef = {
  citation: string;
  source: string;
  href: string;
};

export type Recognition = {
  year: string;
  award: string;
  project: string;
  organization: string;
  note: string;
  href: string;
  paper?: PaperRef;
};

export type ResearchProject = {
  slug: string;
  year: string;
  title: string;
  subtitle: string;
  cardSummary: string;
  pageSummary: string;
  /** meta description of the research page: 1–2 sentences, 50–90 characters */
  description: string;
  heroKicker: string;
  heroEnglish: string;
  themeClass:
    | "theme-drone"
    | "theme-pdm"
    | "theme-anomaly"
    | "theme-eltres"
    | "theme-supercap";
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
  /** Optional: the presentation deck, shown in a page-by-page viewer */
  slides?: SlideDeck;
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
    description: "AI エージェントの設計記事",
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
    "SPRESENSE 上でセンサ信号を処理する研究が 3 件、検知結果を運用で利用するための API が 1 件、回路シミュレーション上で AI どうしを対戦させる自律実験が 1 件あります。",
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
  title: "プロフィールと連絡先",
  body: "開発したものが動作しても、現場で使われなければ意味がないと考えています。そのため、センサ、端末上の推論、通信、API、画面までを一通り自分で実装しています。送信するデータは必要な範囲に絞り、検知結果は記録して、あとから参照できるようにしています。",
  english:
    "I build things until they can actually be used in the field.",
} as const;

// Official page (results not posted there as of 2026-11-05; prize per the owner).
const aiLeadersAwardUrl = "https://events.nikkeibp.co.jp/xtechnext/2026tky/ailaward/";

export const researchProjects: readonly ResearchProject[] = [
  // Numbers: final-review deck 学生AIリーダーズ大賞2026_最終審査_近藤悠太.pptx
  // (2026-10-24 build), main slides 2–15. All are circuit/battery simulation values.
  {
    slug: "self-play-autonomous-experiment",
    year: "2026",
    title: "自己対戦型自律実験",
    subtitle: "AI が見つけた充電制御則を、別の AI に反証させる",
    cardSummary:
      "AI が見つけた最適な充電制御則が、部品の製造ばらつきの内側で安全制約に違反する問題を扱った研究です。発見 AI と反証 AI を対戦させ、反証 AI が違反を見つけた部品の値の組み合わせ（個体）を学習用の個体に加えて再探索します。実験はすべて回路シミュレーションで、実機では検証していません。",
    pageSummary:
      "最適化で得た解は制約の境界付近に集まるため、学習に使った個体（部品の値の組み合わせ 1 組）では安全でも、製造ばらつきの内側にある別の個体では制約に違反することがあります。この研究では、スーパーキャパシタ 4 個を直並列に切り替えて充電する回路を対象に、効率が最大の充電制御則（以下、充電則）を探す発見 AI と、その充電則が違反する個体を公差の範囲から探す反証 AI を対戦させました。",
    description:
      "近藤悠太の研究「自己対戦型自律実験」のページです。AI が見つけた充電制御則の違反を別の AI に探させる手順と、回路シミュレーションでの結果を掲載しています。",
    heroKicker: "スーパーキャパシタ・自己対戦",
    heroEnglish: "Falsify the optimum before adopting it.",
    themeClass: "theme-supercap",
    ambientClass: "ambient-machine",
    tags: [
      "LTspice",
      "Bayesian Optimization",
      "Supercapacitor",
      "Adversarial Search",
      "Claude",
      "PyBaMM",
    ],
    links: [
      {
        href: aiLeaders2026Deck.pdfHref,
        label: "発表スライド（PDF）",
      },
      {
        href: aiLeadersAwardUrl,
        label: "学生AIリーダーズ大賞の公式ページ",
      },
    ],
    slides: aiLeaders2026Deck,
    sections: [
      {
        title: "対象と安全制約",
        body:
          "対象は、入力 5\u00a0V の降圧回路でセル 4 個を充電し、途中で 4 直列から 2 直列 2 並列へ 1 回切り替える回路です。セルは 20\u00a0mF 級のスケールモデルです。安全制約は、入力ピーク電流 1.0\u00a0A 以下、切替時の突入電流 0.5\u00a0A 以下、充電時間 0.28 秒以下の 3 本です。切替を遅らせるほど効率は上がりますが、セルの個体差による突入電流は大きくなります。",
      },
      {
        title: "構成",
        body:
          "発見 AI はベイズ最適化（ガウス過程）で、直並列を切り替える電圧（切替電圧）1 個、電流の境界 3 個、電流指令 4 個の計 8 個の定数を探します。反証 AI は同じ探索器で探す向きを反転し、その充電則が違反する個体を、容量の公差 ±10% の範囲から探します。違反が見つかれば、その個体を学習用の個体（学習個体）に加えて再探索し、評価用の 20 個体で違反が見つからなくなるまで繰り返します。ロバスト最適化と敵対的訓練そのものは、機械学習では既知の手法です。この研究では、既知の最悪条件探索を、反証 AI として自律実験のループに組み込みました。実験はすべて LTspice 上で実行し、回路モデルと探索コードの実装から結果の回収までを、Claude で自動化しています。",
      },
      {
        title: "結果",
        body:
          "発見 AI の最適解を、学習に使っていない個体で検査しました。人手で選んだ 3 個体では突入電流の違反が見つからず（最大 0.49\u00a0A）、公差の範囲から無作為に選んだ 24 個体では 7 個体が違反しました。反証 AI は、容量の小さい組と大きい組を並列にした瞬間に 1.21\u00a0A（上限の 2.4 倍）が流れる個体を見つけました。この個体を学習個体に加えた 2 ラウンド目では、評価用の 20 個体で違反が見つからず、無作為の 24 個体での違反は 7 個体から 0 個体になりました。その代わりに、充電効率は約 1.2 ポイント低下しました（学習個体 1 つでの値で 95.86% から 94.64%）。",
      },
      {
        title: "追加の検証",
        body:
          "インダクタンスと巻線抵抗の ±20% を加えた 12 次元のばらつきでは、10 次元のばらつきに対してロバスト化した充電則が、4,096 コーナー（各部品の値を上限か下限に置いた組み合わせ）中 2,288 で違反しました。充電則はそのままで電流フィードバックを加えると、違反は 0 になりました（電流を誤差なく測るモデルでの値）。同じ手順をリチウムイオン電池の急速充電（PyBaMM の電気化学モデル）に移すと、違反は 256 コーナー中 214 から 0 になり、充電時間は 2.73 倍になりました。数値はすべてシミュレーションの値で、評価した個体とコーナーでの結果です。公差の範囲にあるすべての個体で安全を保証するものではなく、実機と実際の電池では検証していません。",
      },
    ],
    highlights: [
      "発見 AI と反証 AI に同じベイズ最適化を使い、探す向きだけを反転させています。",
      "人手で選んだ 3 個体では見逃し、無作為の 24 個体では大きさを過小評価した突入電流の違反を、反証 AI が見つけました。",
      "自己対戦の 2 ラウンドで、無作為の 24 個体での違反は 7 個体から 0 個体になりました。最終の充電則は定数 8 個で、16 バイトに収まります。",
      "応募書の主張 43 件を再実行して確認し、3 件の不一致を訂正しました。安全な条件をランダム探索の 2.8 倍見つけたという主張は、乱数の種を変えると約 1.6 倍でした。",
      "学生AIリーダーズ大賞 2026（日経BP）の自然科学部門で、最優秀賞を受賞しました。",
    ],
  },
  {
    slug: "drone-inspector",
    year: "2026",
    title: "DroneInspector",
    subtitle: "インフラ点検向けエッジ AI ドローン",
    cardSummary:
      "狭小なインフラ空間の点検を想定した研究です。SPRESENSE 上で、撮像、画質ゲート、分類、証跡の保存、監督制御までを実行します。ぼけた画像や白飛びした画像を、分類へ渡す前に画質ゲートで検出することを重視しました。",
    pageSummary:
      "空間の制約が大きい点検現場では、品質基準を満たさないフレームをその場で棄却する人がいません。ぼけた画像や白飛びした画像にも分類器はスコアを返すため、棄却も人への委譲もないまま陰性と判定された損傷は、誰にも気づかれない見逃し（silent miss）になります。この研究は、画質ゲートと棄却が監督制御の判断へどう伝播するかを、固定した証拠の上で 1 層ずつ入れ替えて測定し、その結果に基づいてファームウェアを実装したものです。",
    description:
      "近藤悠太の研究「DroneInspector」のページです。SPRESENSE 上で撮像から監督制御までを実行する、インフラ点検向けドローンの構成と測定結果を掲載しています。",
    heroKicker: "ドローン・画像",
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
        label: "測定・解析データ（research/）",
      },
      {
        href: "https://elchika.com/article/663a49cf-c895-44d7-a989-6e45e7d92056/",
        label: "Elchika 記事",
      },
    ],
    sections: [
      {
        title: "背景",
        body:
          "トンネルや水道管のような通信条件の悪い場所では、撮影して持ち帰るだけでは作業の負荷が大きく残ります。さらに問題となるのは、品質基準を満たさないフレームをその場で棄却する人がいないことです。画質ゲートも棄却も既知の手法ですが、それらが監督制御の判断へどう伝播するかは、測定しなければ分かりません。この研究では、固定した証拠を用いてこの伝播を測定しました。",
      },
      {
        title: "構成",
        body:
          "撮像、ハッシュ、画質指標 q の算出、分類、証跡コミット、5 状態の監督制御の順に処理が進むよう、ファームウェアを構成しています。監督制御は受理、再撮像、安全停止に分岐します。再撮像は N_max\u00a0=\u00a02 で飽和し、安全停止はラッチして、解除コマンドを受信するまで点検を再開しません。証跡ストアは 1 レコードを 1 つの不変ファイルとして保存し、索引は保存せずに起動時の走査で再構築します。",
      },
      {
        title: "測定結果",
        body:
          "凍結チェックポイントで採点し直した 1,000 枚のコンクリートパッチを固定した証拠として、6 つの候補改善（E1〜E6）を 1 層ずつ入れ替えて比較しました。6 つのうち 5 つは、事前の想定と異なる挙動を示しました。たとえば、証跡バッファは保管では優位でしたが、到達では優位ではありませんでした。配備フォーマットの整数化は、同じ画素に対して 13,638 件の監督判断を変えました。判定が出た時点で機体は既に通過しており、1,000 レコード中 387 件は別の面を指していました。",
      },
      {
        title: "現状",
        body:
          "機体プロセッサ上での MobileNetV2 int8 推論、走査による索引の再構築、ケーブルを実際に抜く電源断、監督判断の経路の最悪実行時間（WCET）までを実機で測定しました。索引は 40 回の試行すべてで 4,000 件を回復しました。18 回の電源断では、書きかけのまま開けるレコードは 0 件で、索引を別ファイルに持つ方式は 18 回すべてで索引とレコードが食い違いました。一方で、機体プロセッサ上での推論は 160×160 画素の 1 枚あたり 94.3 秒（中央値）かかり、リアルタイムではありません。消費電力と現場での精度は未測定です。検証は台上の条件に限られ、飛行時と現場での性能はまだ確認できていません。",
      },
    ],
    highlights: [
      "画質ゲート、分類、証跡、5 状態の監督制御の処理順を、不変条件として定義しました。",
      "証跡ストアは索引を保存しません。起動時の走査で再構築すると、40 回の試行すべてで索引が回復しました。",
      "6 つの候補改善（E1〜E6）を 1 層ずつ入れ替えて比較し、5 つが事前の想定と異なる挙動を示すことを実測しました。",
      "STPA + FMEA、Simulink/Stateflow モデル、飛行 SIL までを含む一次資料を公開しています。",
      "2025 年 SPRESENSE 活用コンテストで、クレイン電子 BLEアドオンボード特別賞を受賞しました。",
    ],
  },
  {
    slug: "pdm-edge",
    year: "2026",
    title: "pdm_edge",
    subtitle: "加速度・音響を用いた異常検知エッジ AI",
    cardSummary:
      "加速度 3 軸と音響の 4 チャンネルを FFT で特徴量に変換し、SPRESENSE 上で動作する軽量な異常検知モデルを構築しました。",
    pageSummary:
      "計算量の大きい解析を用いずに、異常の兆候をどこまで検出できるかを検討した研究です。波形から周波数特徴を生成し、固定長の特徴量として軽量な実装で扱えるようにしました。",
    description:
      "近藤悠太の研究「pdm_edge」のページです。加速度と音響を FFT で特徴量に変換し、SPRESENSE 上で異常の兆候を判定する構成を掲載しています。",
    heroKicker: "振動・音響",
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
        title: "背景",
        body:
          "通信を前提とした大規模な解析系は用いず、設備の近傍で異常の兆候を検出できる最小構成を目指しました。現場に設置できる軽量さと再現性を優先しています。",
      },
      {
        title: "構成",
        body:
          "1 kHz で取得した時系列を FFT で周波数特徴へ変換し、0〜500 Hz を固定したビンに集約して Random Forest へ渡します。学習後のモデルはヘッダファイルに変換し、SPRESENSE に組み込めるようにしています。",
      },
      {
        title: "現状",
        body:
          "学習、評価、ヘッダの再生成、SPRESENSE 側からの呼び出しまで動作しています。異常の見逃しを減らすため、再現率を優先した構成です。",
      },
    ],
    highlights: [
      "4 チャンネルを同時に処理し、設備の状態変化を複数の信号から捉えます。",
      "特徴量を固定長にして、組み込み環境へ移植しやすくしました。",
      "2024 年の LoRa 振動解析から継続しているテーマです。",
      "2025 年の電気学会 C部門大会で、学生ポスター（PS8-8）として発表しました。",
    ],
  },
  {
    slug: "anomaly-event-api",
    year: "2026",
    title: "anomaly-event-api",
    subtitle: "異常検知の結果をイベントとして運用する API",
    cardSummary:
      "画像のアップロード、異常検知、判定の説明、イベントの保存、ダッシュボード表示を 1 つの API として実装しました。検知後の運用までを対象としています。",
    pageSummary:
      "判定結果を返したあと、イベントとして保存し、確認し、状態を更新するところまでを実装しました。ローカル環境と AWS のどちらでも、同じ操作で検証できます。",
    description:
      "近藤悠太の研究「anomaly-event-api」のページです。異常検知の結果をイベントとして保存し、対応状況を管理する API の構成を掲載しています。",
    heroKicker: "API・運用",
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
        title: "背景",
        body:
          "現場では、判定そのものに加えて、結果を保存して参照し、対応状況を更新できることが必要だと考えました。このため、検知結果をイベントとして扱い、運用上の判断に利用できる形で記録しています。",
      },
      {
        title: "構成",
        body:
          "Node.js + TypeScript の API 層に Python の推論処理を接続し、Grad-CAM、focus regions、attention grid といった説明情報も返すようにしています。ローカル環境と AWS の動作の違いは、サービス層で吸収しています。",
      },
      {
        title: "現状",
        body:
          "検知、イベント化、可視化、ローカル環境と AWS の切り替えまで動作しています。",
      },
    ],
    highlights: [
      "ローカル環境と AWS のどちらでも、同じ操作で動作します。",
      "対応状況を NEW / CHECKING / RESOLVED の 3 状態で管理します。",
      "判定の説明（Grad-CAM など）とイベント管理を、同じ画面で扱えます。",
    ],
  },
  {
    slug: "eltres-co2-mapping",
    year: "2025",
    title: "Eltres_CO2_Mapping",
    subtitle: "ELTRES 通信による CO2 濃度マッピング",
    cardSummary:
      "SPRESENSE と ELTRES で CO2 濃度と位置情報を交互に送信し、都市部と郊外の濃度差を地図上に可視化しました。",
    pageSummary:
      "通信、解析、表示までを一貫して実装した環境モニタリングの研究です。CO2 濃度と位置情報を ELTRES で送り、CLIP Viewer Lite API から MATLAB で取得し、Web ダッシュボードに表示しています。",
    description:
      "近藤悠太の研究「Eltres_CO2_Mapping」のページです。SPRESENSE と ELTRES で CO2 濃度と位置情報を送信し、地図上に可視化する構成を掲載しています。",
    heroKicker: "CO2・位置情報",
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
        title: "背景",
        body:
          "目に見えない CO2 濃度の差を、エリアごとに把握できるようにすることが目的です。現場で計測した値を、その場で確認できるところまで実装しました。",
      },
      {
        title: "構成",
        body:
          "SPRESENSE でセンサ値と位置情報を交互に取得し、ELTRES アドオンで送信します。クラウド側では CLIP Viewer Lite API から MATLAB で取得し、Web ダッシュボードで可視化しています。",
      },
      {
        title: "現状",
        body:
          "通信、解析、表示までを接続し、センサの値をエリアごとの濃度差として地図上に表示できます。",
      },
    ],
    highlights: [
      "送信データを最小限に抑えたまま、空間分布を取得できます。",
      "MATLAB から Web ダッシュボードまでの可視化を一通り実装しました。",
      "2024 年 SPRESENSE 活用コンテストで、クレスコ ELTRESアドオンボード優秀賞を受賞しました。",
    ],
  },
] as const;

export const selectedWorks: readonly SelectedWork[] = [
  {
    slug: "vibeguard",
    category: "Security Tooling",
    title: "VibeGuard",
    subtitle: "AI 生成コードの脆弱性を 3 つの場面で検出する診断ツール",
    summary:
      "コードを書くとき（VS Code / Open VSX）、読むとき（Chrome）、マージする前（GitHub Actions / CLI）の 3 つの場面で、同じ解析エンジン（analyzer-core）が動作します。インジェクション、秘密情報の埋め込み、認証の省略、スタブのままの実装を、同じ基準で検出します。解析は手元の端末で完結し、コードを外部へ送信しません。",
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
      "解析エンジンは analyzer-core の 1 つだけです。4 つのストアのどれから導入しても、判定は同じです。",
      "2026 年 9 月 11 日に SES2026（慶應義塾大学 日吉キャンパス）で一般論文を発表し、10 月 22 日に CSS2026（浜松）で一般発表を行いました。",
      "検出ルールは 85 件（単一ファイル 74 件、ファイル横断 11 件）で、11 言語に対応しています。対象言語は c / cpp / csharp / go / java / javascript / kotlin / php / python / ruby / typescript です。",
      "自動修正は 7 件あります。確認なしで適用できるものは 1 件だけで、残りの 6 件は needs-review と表示し、適用するかを人が判断します。",
      "公式サイトのルール一覧、検出例、バージョンは、リポジトリから自動生成しています。手入力の数値はありません。",
      "MCP サーバを提供しています。エージェントがファイルを書き込む前に同じ解析エンジンへ問い合わせ、ALLOWED / REFUSED を返します。",
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
    subtitle: "点検データから作業指示を生成する保全向けマルチエージェント",
    summary:
      "異常検知後の作業までを対象とする、Azure ベースの保全 AI です。センサ、画像、点検メモ、マニュアル、故障履歴を 8 つのエージェントで処理し、リスク判定、原因の推定、作業指示、報告書を出力します。出力した結果に対して、人が承認、修正依頼、却下のいずれかを選択します。この操作は監査ログに記録します。",
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
      "片道航空券 2 枚の組み合わせで海外旅行を検索するプランナーです。Codex の Planner / Generator / Evaluator の 3 役をローカルで反復実行して開発しています。仕様は specs/spec.json の 1 ファイルで管理し、スプリントごとに機能を追加しています。現在はスプリント 10（複数地域をまたぐ経路の現実性と、ラベルの整合）に取り組んでいます。",
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
    subtitle: "図面業務を大規模言語モデル（LLM）で半自動化する実験基盤",
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
      "カメラ、BLE、エッジ AI、軽量ドローンを組み合わせ、機体側で判断するインフラ点検を試作した作品の解説記事です。",
    tags: ["AI", "BLE", "SPRESENSE", "Edge AI", "Drone"],
    awards: ["2025 年 SPRESENSE 活用コンテスト クレイン電子 BLEアドオンボード特別賞"],
    href: "https://elchika.com/article/663a49cf-c895-44d7-a989-6e45e7d92056/",
  },
  {
    id: "publication-pdm-edge",
    date: "2026-01-31",
    dateLabel: "2026.01.31",
    title: "加速度・音響信号を活用した異常検知エッジAIモデルの構築",
    summary:
      "加速度と音響を 1 kHz で取得し、FFT による特徴量から軽量に異常の兆候を判定する構成を整理した記事です。",
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
      "LoRa と振動解析を組み合わせ、遠隔から設備の状態を監視する作品の解説記事です。",
    tags: ["Arduino", "IoT", "LoRa", "MPU6050", "SPRESENSE"],
    awards: [
      "2024 年 SPRESENSE 活用コンテスト LoRa活用アイデア賞",
      "2024 年 SPRESENSE 活用コンテスト JBAT Qanat Universe賞",
    ],
    href: "https://elchika.com/article/ac986cc9-5c24-4778-952d-a3ec8dca25d0/",
  },
  {
    id: "publication-co2",
    date: "2025-01-31",
    dateLabel: "2025.01.31",
    title: "SPRESENSEとELTRES通信でCO2濃度をマッピング",
    summary:
      "ELTRES とセンシングを組み合わせ、都市部と郊外の CO2 濃度差を可視化した作品の解説記事です。",
    tags: ["ELTRES", "IoT", "MATLAB", "SPRESENSE", "Sensor"],
    awards: ["2024 年 SPRESENSE 活用コンテスト クレスコ ELTRESアドオンボード優秀賞"],
    href: "https://elchika.com/article/504f286c-413b-47d3-89f9-38920ca5e5c7/",
  },
] as const;

// IPSJ record 2011748 (issued 2026-09-03). Full text is free from 2028-09-03.
const ses2026Paper: PaperRef = {
  citation: "ソフトウェアエンジニアリングシンポジウム2026論文集、pp. 78–85",
  source: "情報処理学会 電子図書館",
  href: "https://ipsj.ixsq.nii.ac.jp/records/2011748",
};

export const recognitions: readonly Recognition[] = [
  {
    year: "2026",
    award: "学生AIリーダーズ大賞 2026 自然科学部門 最優秀賞",
    project:
      "AIの発見をAIに反証させる自己対戦型自律実験：製造公差にロバストなスーパーキャパシタ充電制御則の獲得と16バイトへの蒸留",
    organization: "日経BP",
    note:
      "AI が見つけた充電制御則に対し、別の AI が製造公差の範囲内で制約に違反する個体を探し、見つけた個体を学習用の個体に加えて再探索する自己対戦型の自律実験です。回路シミュレーションで検証し、2026 年 10 月 29 日の最終審査で発表しました。",
    href: aiLeadersAwardUrl,
  },
  {
    year: "2026",
    award: "CSS2026 一般発表 4D2-3",
    project:
      "VibeGuard Compiler：コンパイラ最適化におけるセキュリティ性質消失の追跡と第一喪失点の特定",
    organization: "コンピュータセキュリティシンポジウム 2026（浜松）",
    note:
      "コンパイラ最適化の過程でセキュリティ性質が失われる様子を追跡し、最初に失われる工程（第一喪失点）を特定する方式を、2026 年 10 月 22 日にセキュア開発セッションで発表しました。",
    href: "https://www.iwsec.org/css/2026/program.html",
  },
  {
    year: "2026",
    award: "SES2026 一般論文",
    project:
      "AI生成コードの採用判断点に基づくマルチコンテキストセキュリティ診断配置方式の提案とVibeGuardによる検証",
    organization: "ソフトウェアエンジニアリングシンポジウム 2026（慶應義塾大学 日吉キャンパス）",
    note:
      "AI 生成コードの安全確認を採用判断点への診断配置の問題として扱い、VibeGuard の実装と測定で検証した単著論文を 2026 年 9 月 11 日に発表しました。",
    href: "https://ses.sigse.jp/2026/program.html",
    paper: ses2026Paper,
  },
  {
    year: "2026",
    award: "Microsoft Agent Hackathon 2026 特別賞（個人部門）",
    project: "EdgeOps Command Agent",
    organization: "Microsoft Agent Hackathon powered by Tokyo Electron Device",
    note:
      "点検データからリスク判定、原因の推定、作業指示、報告書までを出力する 8 エージェントの保全 AI です。出力ごとに人が承認、修正依頼、却下を選び、その操作を監査ログに記録します。",
    href: "https://zenn.dev/kd_yuta/articles/edgeops-command-agent",
  },
  {
    year: "2026",
    award: "SecHack365 2026 トレーニー採択",
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
      "振動・音響センサによる異常兆候の検知と AI 識別モデルの構築について、学生ポスターセッション（PS8-8）で発表しました。",
    href: "https://www.iee.jp/blog/c-taikai-2025/",
  },
  {
    year: "2025",
    award: "電気学会 U-21 学生研究発表会 奨励賞",
    project: "LoRa通信とAIを活用した振動検知による異常予知システムの構築",
    organization: "電気学会",
    note:
      "LoRa 通信と AI を組み合わせた振動検知システムで受賞しました。",
    href: "https://www.iee.jp/u-21-2025-award/",
  },
  {
    year: "2025",
    award: "クレイン電子 BLEアドオンボード特別賞",
    project: "SPRESENSEでインフラ点検向けのエッジAIドローン",
    organization: "2025 年 SPRESENSE 活用コンテスト",
    note:
      "免許が不要な軽量ドローンと SPRESENSE で、インフラ点検の課題を扱った点が評価されました。",
    href: "https://elchika.com/promotion/spresense2025/winner/#nav",
  },
  {
    year: "2024",
    award: "クレスコ ELTRESアドオンボード優秀賞",
    project: "SPRESENSEとELTRES通信でCO2濃度をマッピング",
    organization: "2024 年 SPRESENSE 活用コンテスト",
    note:
      "エリアごとの CO2 濃度を地図上に可視化した点が評価されました。",
    href: "https://elchika.com/promotion/spresense2024/winner/#nav",
  },
  {
    year: "2024",
    award: "LoRa活用アイデア賞、JBAT Qanat Universe賞",
    project: "SPRESENSEと振動解析による設備保全の最前線",
    organization: "2024 年 SPRESENSE 活用コンテスト",
    note:
      "LoRa で設備の振動を遠隔から監視する構成で、両賞を受賞しました。",
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
  paper?: PaperRef;
};

export const talks: readonly Talk[] = [
  {
    id: "talk-css2026",
    date: "2026-10-22",
    dateLabel: "2026.10.22",
    status: "presented",
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
    paper: ses2026Paper,
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
    session: "2D-2、奨励賞",
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
  base: string;
  facts: readonly ProfileFact[];
};

export const profile: Profile = {
  nameJa: "近藤悠太",
  nameEn: "Kondo Yuta",
  role: "エッジ AI、組み込み、AI 生成コードのセキュリティ",
  base: "広島",
  facts: [
    {
      label: "資格",
      value: "AWS Certified Solutions Architect – Associate",
    },
    { label: "英語", value: "TOEIC 880" },
    { label: "アカウント", value: "YUTAKONDO1205（GitHub）、kd_yuta（Elchika、Zenn）" },
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
  headlineJa: "マイコン上で動作する AI と、AI 生成コードの診断ツールを開発しています。",
  headlineEn: "Sense. Decide. Share.",
  subJa:
    "研究では、振動、音響、画像を SPRESENSE 上で判定しています。診断ツールの VibeGuard は 4 つのストアで公開しており、2026 年 9 月に SES2026、10 月に CSS2026 で発表しました。",
  subEn:
    "Edge AI, from the lab to the marketplace.",
  primaryCta: {
    label: "VibeGuard を試す",
    href: "https://vibeguard-site.kondo-yuta-02.workers.dev",
  },
  secondaryCta: { label: "研究を読む", href: "/research" },
  latestUpdate: {
    dateLabel: "2026.10.29",
    title: "日経BP 学生AIリーダーズ大賞 2026 の自然科学部門で、最優秀賞を受賞しました。",
    href: aiLeadersAwardUrl,
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
    organization: "学生AIリーダーズ大賞（日経BP）",
    award: "自然科学部門 最優秀賞",
    href: aiLeadersAwardUrl,
  },
  {
    year: "2026",
    organization: "コンピュータセキュリティシンポジウム 2026",
    award: "CSS2026 一般発表 4D2-3",
    href: "https://www.iwsec.org/css/2026/program.html",
    kind: "presentation",
  },
  {
    year: "2026",
    organization: "ソフトウェアエンジニアリングシンポジウム 2026",
    award: "SES2026 一般論文",
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
    organization: "NICT（情報通信研究機構）",
    award: "SecHack365 2026 トレーニー",
    href: "https://sechack365.nict.go.jp/",
    kind: "selection",
  },
  {
    year: "2025",
    organization: "電気学会 電子・情報・システム部門大会",
    award: "学生ポスター（PS8-8）",
    href: "https://www.iee.jp/blog/c-taikai-2025/",
    kind: "presentation",
  },
  {
    year: "2025",
    organization: "電気学会 U-21 学生研究発表会",
    award: "奨励賞",
    href: "https://www.iee.jp/u-21-2025-award/",
  },
  {
    year: "2025",
    organization: "SPRESENSE 活用コンテスト",
    award: "クレイン電子 BLEアドオンボード特別賞",
    href: "https://elchika.com/promotion/spresense2025/winner/#nav",
  },
  {
    year: "2024",
    organization: "SPRESENSE 活用コンテスト",
    award: "クレスコ ELTRESアドオンボード優秀賞",
    href: "https://elchika.com/promotion/spresense2024/winner/#nav",
  },
  {
    year: "2024",
    organization: "SPRESENSE 活用コンテスト",
    award: "LoRa活用アイデア賞",
    href: "https://elchika.com/promotion/spresense2024/winner/#nav",
  },
  {
    year: "2024",
    organization: "SPRESENSE 活用コンテスト",
    award: "JBAT Qanat Universe賞",
    href: "https://elchika.com/promotion/spresense2024/winner/#nav",
  },
] as const;

/** True for an actual prize (受賞) — excludes selections (採択) / presentations
    (発表). Single source of truth for the "受賞 N 件" count across the site. */
export function isAwardPrize(badge: AwardBadge): boolean {
  return badge.kind === undefined || badge.kind === "award";
}

/** Canonical 受賞 count (currently 7). Use this everywhere "受賞 N 件" appears. */
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
        "SPRESENSE 上の FFT、Random Forest、TFLite Micro。.tflite は C++ ヘッダに変換",
    },
    {
      key: "ship",
      labelEn: "Ship to Market",
      labelJa: "製品の公開",
      score: 8,
      evidence:
        "VibeGuard v0.3.6 を GitHub Marketplace、VS Code、Chrome Web Store、Open VSX で公開",
    },
    {
      key: "research",
      labelEn: "Public Research",
      labelJa: "研究の公開",
      score: 9,
      evidence:
        "記事 5 本、受賞 7 件、SES2026・CSS2026 発表、電気学会 2 件、SecHack365 2026",
    },
    {
      key: "ops",
      labelEn: "Operationalization",
      labelJa: "運用への組み込み",
      score: 8,
      evidence:
        "EdgeOps の承認と監査のワークフロー、anomaly-event-api の 3 状態管理",
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
