/* Slide decks shown on research pages.

   Each deck is the public copy of a presentation: rendered to one 1600×900
   WebP per page (16:9, scaled uniformly from the PDF) plus the PDF itself,
   both under public/slides/<id>/. Page titles are each page's kicker and
   heading, read from the PDF text. */

export type SlideDeck = {
  id: string;
  /** shown above the viewer */
  title: string;
  /** one line under the heading: where and when it was presented */
  context: string;
  /** pages 1..mainPages are the talk; the rest are the Q&A appendix */
  mainPages: number;
  pageTitles: readonly string[];
  pdfHref: string;
  pdfSizeLabel: string;
};

export function slideImageSrc(deck: SlideDeck, page: number) {
  return `/slides/${deck.id}/${String(page).padStart(2, "0")}.webp`;
}

/* Public copy of 学生AIリーダーズ大賞2026_最終審査_近藤悠太.pptx (2026-10-24
   build). Against the original it drops the affiliation line on page 1,
   「学部生」 on page 15 and the note naming lab members on page 21; nothing
   else changed. */
export const aiLeaders2026Deck: SlideDeck = {
  id: "ai-leaders-2026",
  title: "最終審査の発表スライド",
  context: "2026 年 10 月 29 日の学生AIリーダーズ大賞 2026 最終審査",
  mainPages: 15,
  pdfHref: "/slides/ai-leaders-2026/ai-leaders-2026-final.pdf",
  pdfSizeLabel: "2.9 MB",
  pageTitles: [
    "AIの発見をAIに反証させる自己対戦型自律実験",
    "概要：自己対戦による充電則のロバスト化",
    "背景：最適解が違反する仕組み",
    "対象の回路と安全制約：セル4個の直並列切替による充電",
    "提案：発見AIと反証AIの自己対戦ループ",
    "AIの使いどころと理由：工程ごとのAIと人の分担",
    "結果 1／3｜発見：ランダム探索と比べた安全な条件の件数",
    "結果 2／3｜反証：公差の内側での安全制約の違反",
    "結果 3／3｜自己対戦：最適解と最終則の無作為24個体での違反",
    "AI出力をうのみにしない：検証で見つけた問題と対処",
    "応募後の追加検証 1／4｜反証の初期サンプル：生成AIによる違反コーナーの提案",
    "応募後の追加検証 2／4｜ばらつきの範囲：制御の構造を変えた12次元の検証",
    "応募後の追加検証 3／4｜生成AIによる設計：生成AIに設計させた構造の反証",
    "応募後の追加検証 4／4｜応用可能性：リチウムイオン電池の急速充電への転用",
    "まとめ：観点ごとの成果",
    "付録 A：AIが提示した設計の不具合6件",
    "付録 B：物理から逆算した候補を加えた防御の再探索",
    "付録 C：反証AIが見つけた満充電の判定の不備",
    "付録 D：学習個体Aでの探索の設定と試行の分布",
    "付録 E：数値の照合と利用したAI・ソフトウェア",
    "付録 F：既知の手法に対する本研究の寄与",
    "付録 G｜応募後の追加検証：16コーナーと200個体での最終則の違反数",
    "付録 H｜応募後の追加検証：安全な条件の件数での発見AIの優位（6回中5回）",
    "付録 I｜応募後の追加検証：応募時と種を変えた3回の自己対戦",
    "付録 J｜応募後の追加検証：上限に近いが違反しない制約への評価回数の偏り",
    "付録 K｜応募後の追加検証：人が選んだコーナーを使わない4次元の攻撃",
    "付録 L｜応募後の追加検証：量子化と測定誤差の許容（8ビット・±5 mV）",
    "付録 M｜応募後の追加検証：全探索を攻撃側にした10次元の防御",
    "付録 N｜応募時の結果：定数8個・16バイトの最終則",
    "付録 O｜応募後の追加検証：12次元の自己対戦の防御（169候補）",
    "付録 P｜応募後の追加検証：12次元の入力ピーク電流の中身",
    "付録 Q｜応募後の追加検証：生成AIの理由と範囲外の定数の採点",
    "付録 R｜応募後の追加検証：電流フィードバック制御（則は同じ）",
    "付録 S｜応募後の追加検証：電池の充電時間の代償の内訳",
    "付録 T｜応募後の追加検証：電流センサに要る精度（反証からの逆算）",
    "付録 U｜応募後の追加検証：生成AIに足す情報と、防御側の生成AI",
    "付録 V｜応募後の追加検証：組の電圧差で第1段を止める条件（開ループ）",
    "付録 W｜応募後の追加検証：採点を入力する往復で生成AIが再生成した構造",
    "付録 X｜応募後の追加検証：組の電圧差の条件と電流フィードバックの組み合わせ",
  ],
};
