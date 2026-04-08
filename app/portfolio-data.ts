export type PlatformLink = {
  href: string;
  label: string;
  description: string;
  detail: string;
  status: string;
  accent: string;
};

export type FocusArea = {
  label: string;
  title: string;
  description: string;
};

export type ResearchFlowStep = {
  label: string;
  title: string;
  description: string;
};

export type ResearchProject = {
  id: string;
  year: string;
  phase: string;
  title: string;
  subtitle: string;
  summary: string;
  problem: string;
  approach: string;
  currentState: string;
  stack: readonly string[];
  highlights: readonly string[];
  links: readonly {
    href: string;
    label: string;
  }[];
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

export const platformLinks: readonly PlatformLink[] = [
  {
    href: "https://github.com/YUTAKONDO1205",
    label: "GitHub",
    description: "コード、検証、設計断面を残す公開リポジトリ",
    detail:
      "組み込み、機械学習、API、検証用スクリプトまでを含めて、研究の現在地をコード単位で公開しています。",
    status: "継続公開中 / 最新テーマを集約",
    accent: "Code Archive",
  },
  {
    href: "https://elchika.com/user/kd_yuta/?page=0",
    label: "Elchika",
    description: "試作の背景と評価を文章で残す技術ノート",
    detail:
      "問題設定、ハード構成、評価観点、改善案までを日本語で整理し、作品単位で読み解けるようにしています。",
    status: "最新公開日 2026.01.31",
    accent: "Public Notes",
  },
  {
    href: "https://www.linkedin.com/in/kondo-yuta-985430317",
    label: "LinkedIn",
    description: "活動全体のプロフィールと対外向けの窓口",
    detail:
      "研究・制作・プロフィールを俯瞰して見せるための外部導線として運用しています。",
    status: "Profile / Career Window",
    accent: "External Profile",
  },
] as const;

export const focusAreas: readonly FocusArea[] = [
  {
    label: "Sensing",
    title: "現場の信号を取り出す計測設計",
    description:
      "加速度、音響、画像、位置情報のような異なる信号を、現場で扱える解像度とコスト感に落として取得します。",
  },
  {
    label: "Edge Intelligence",
    title: "軽量な推論と説明可能性の両立",
    description:
      "SPRESENSE 級の制約下でも扱える特徴量設計やモデル構成を選び、異常の理由が追える形を重視します。",
  },
  {
    label: "Public Research",
    title: "実装と公開を往復する研究スタイル",
    description:
      "コード、記事、作品説明を同時に積み上げることで、再現性と次の改善点が見える研究アーカイブにしています。",
  },
] as const;

export const researchFlow: readonly ResearchFlowStep[] = [
  {
    label: "01 Sense",
    title: "計測と取得",
    description:
      "現場の状態を多面的に捉えるために、画像、加速度、音響、位置情報を取得する入口を設計します。",
  },
  {
    label: "02 Infer",
    title: "軽量推論へ落とし込む",
    description:
      "FFT 特徴、Random Forest、MobileNetV2、Grad-CAM などを使い、デバイス側で意味のある判定に変換します。",
  },
  {
    label: "03 Operate",
    title: "運用できる形に残す",
    description:
      "イベント化、ダッシュボード化、公開記事化までつなげ、研究を単発で終わらせず継続改善可能な形にします。",
  },
] as const;

export const researchProjects: readonly ResearchProject[] = [
  {
    id: "drone-inspector",
    year: "2026",
    phase: "Latest Research 01",
    title: "DroneInspector",
    subtitle: "インフラ点検向けエッジAIドローン",
    summary:
      "狭小インフラ空間を対象に、Sony Spresense ベースで画像取得、IMU 記録、microSD 保存、BLE 通知を行う点検支援システムです。",
    problem:
      "トンネルや水道管のような閉鎖空間では通信が不安定で、人が入るコストも高く、単に撮影して持ち帰るだけでは点検効率が上がりません。",
    approach:
      "組み込みファームウェアと学習済みモデル変換フローを分離し、機体側では JPEG 保存、IMU ログ、BLE 通知、TensorFlow Lite Micro の読込までを一連化しています。",
    currentState:
      "現時点では画像保存と証跡取得の流れが動いており、完全な機体側推論には 160x160 モデル入力へつなぐ生画像経路の追加が次段階です。",
    stack: [
      "Sony Spresense",
      "HDR Camera Board",
      "Multi-IMU",
      "BLE1507",
      "TensorFlow Lite Micro",
      "MobileNetV2",
      "microSD",
    ],
    highlights: [
      "JPEG 保存と IMU CSV ログを止めないフォールバック設計",
      "camera / BLE / IMU / storage を分割した検証しやすい構成",
      "ひび割れ分類モデルを `.tflite` から C++ 配列へ変換する流れを整理",
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
  },
  {
    id: "pdm-edge",
    year: "2026",
    phase: "Latest Research 02",
    title: "pdm_edge",
    subtitle: "加速度・音響信号を活用した異常検知エッジAI",
    summary:
      "加速度 3 軸とマイクの 4 チャンネル波形から FFT 特徴を生成し、SPRESENSE 上で異常判定できる軽量構成へ落とし込んだ研究です。",
    problem:
      "予兆保全ではデータが取れても判断が属人的になりやすく、通信前提の重い解析は現場の電力制約やネットワーク制約とぶつかります。",
    approach:
      "1 kHz サンプリングの波形を 50 bin のスペクトルへ要約し、4 チャンネルを連結した 200 次元特徴を Random Forest で分類します。学習後はヘッダとして再出力し、SPRESENSE へ移植可能にしています。",
    currentState:
      "学習、評価、ヘッダ再生成、SPRESENSE 側呼び出しまでが整理されており、軽量性と再現性を優先した構成としてまとまっています。",
    stack: [
      "Sony Spresense",
      "MPU6050",
      "MAX4466",
      "FFT",
      "RandomForestClassifier",
      "Python",
      "Header Export",
    ],
    highlights: [
      "4 チャンネル同時処理で設備状態の変化を多面的に取得",
      "0 から 500 Hz を 50 等分する固定長特徴で組み込み実装を簡素化",
      "テスト 600 件で正確度 92.0 パーセント、異常再現率 100 パーセントを記録",
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
  },
  {
    id: "anomaly-event-api",
    year: "2026",
    phase: "Latest Research 03",
    title: "anomaly-event-api",
    subtitle: "異常検知イベントを扱う API と運用 UI",
    summary:
      "画像アップロード、異常検知、Grad-CAM による説明、イベント保存、ダッシュボード可視化までを一体化した運用寄りの研究実装です。",
    problem:
      "推論結果が出るだけでは現場運用に乗らず、保存、状態管理、再確認、閾値確認、ローカル検証とクラウド検証をつなぐ仕組みが必要になります。",
    approach:
      "Node.js + TypeScript の API 層に、Python + PyTorch の MobileNetV2 Transfer Learning と Grad-CAM を接続し、local / AWS の両モードで同じ UI と API 体験を提供します。",
    currentState:
      "検知、イベント化、ダッシュボード、provider 切り替え、AWS への展開までを見据えた責務分離ができており、研究から運用への橋渡しを担う位置づけです。",
    stack: [
      "Node.js",
      "TypeScript",
      "Python",
      "PyTorch",
      "MobileNetV2",
      "Grad-CAM",
      "AWS SAM",
      "DynamoDB",
      "S3",
    ],
    highlights: [
      "local と AWS の両方で同じ操作感を保つ runtime mode 設計",
      "event status を `NEW` / `CHECKING` / `RESOLVED` で扱う運用視点",
      "heatmap、focusRegions、attentionGrid を返す説明可能な検知フロー",
    ],
    links: [
      {
        href: "https://github.com/YUTAKONDO1205/anomaly-event-api",
        label: "GitHub Repository",
      },
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
      "カメラ、BLE、エッジAI、軽量ドローンを組み合わせ、狭小インフラ空間で機体側が判断する意義を掘り下げた作品です。",
    tags: ["AI", "BLE", "SPRESENSE", "エッジAI", "ドローン"],
    awards: ["2025年 SPRESENSE 活用コンテスト クレイン電子 BLEアドオンボード特別賞"],
    href: "https://elchika.com/article/663a49cf-c895-44d7-a989-6e45e7d92056/",
  },
  {
    id: "publication-pdm-edge",
    date: "2026-01-31",
    dateLabel: "2026.01.31",
    title: "加速度・音響信号を活用した 異常検知エッジAIモデルの構築",
    summary:
      "1 kHz 計測、FFT、200 次元特徴、Random Forest を通して、マイコン実装を意識した予兆保全の最小構成をまとめています。",
    tags: ["AI", "SPRESENSE", "エッジAI", "センサー", "音響工学"],
    awards: [],
    href: "https://elchika.com/article/7301ab59-0921-4ba7-9935-b9309cf8c59c/",
  },
  {
    id: "publication-vibration",
    date: "2025-01-31",
    dateLabel: "2025.01.31",
    title: "SPRESENSEと振動解析による設備保全の最前線",
    summary:
      "LoRa と MPU6050 を使った遠隔振動監視を軸に、災害検知と設備保全の両面へ展開可能なシステムを提示した作品です。",
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
      "ELTRES と MATLAB を組み合わせ、都市部と郊外の CO2 濃度差を遠隔取得・可視化した環境モニタリング研究です。",
    tags: ["ELTRES", "IoT", "MATLAB", "SPRESENSE", "センサー"],
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
      "LoRa 通信と AI を組み合わせた振動検知システムとして、研究テーマの社会実装性が評価された受賞例です。",
    href: "https://www.iee.jp/u-21-2025-award/",
  },
  {
    year: "2025",
    award: "クレイン電子 BLEアドオンボード特別賞",
    project: "SPRESENSEでインフラ点検向けのエッジAIドローン",
    organization: "2025年 SPRESENSE 活用コンテスト",
    note:
      "免許不要ドローン、軽量な Spresense、実践的なインフラ点検課題への接続が評価され、ひび割れの見落としまで想像を掻き立てる作品として講評されています。",
    href: "https://elchika.com/promotion/spresense2025/winner/#nav",
  },
  {
    year: "2024",
    award: "クレスコ ELTRESアドオンボード優秀賞",
    project: "SPRESENSEとELTRES通信でCO2濃度をマッピング",
    organization: "2024年 SPRESENSE 活用コンテスト",
    note:
      "エリアごとの CO2 濃度を可視化することで社会課題への認識変化を促す点が評価されました。",
    href: "https://elchika.com/promotion/spresense2024/winner/#nav",
  },
  {
    year: "2024",
    award: "LoRa活用アイデア賞 / JBAT Qanat Universe賞",
    project: "SPRESENSEと振動解析による設備保全の最前線",
    organization: "2024年 SPRESENSE 活用コンテスト",
    note:
      "遠隔監視と設備保全をつなぐ発想が評価され、LoRa 活用と IoT 応用の両面から受賞につながっています。",
    href: "https://elchika.com/promotion/spresense2024/winner/#nav",
  },
] as const;
