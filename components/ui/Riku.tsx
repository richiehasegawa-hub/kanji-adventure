/**
 * components/ui/Riku.tsx
 * キャラクター「リク」— 7表情 SVG アイコン
 *
 * 表情一覧:
 *   normal   — 通常・待機
 *   happy    — 正解・達成（ガッツポーズ）
 *   excited  — 完了・連続正解（両手バンザイ）
 *   thinking — 考え中（あごに手）
 *   worried  — 不正解・ヒント（困り顔）
 *   sleepy   — 未ログイン（zzz）
 *   waving   — 起動・終了（手を振る）
 */

export type RikuMood =
  | "normal"
  | "happy"
  | "excited"
  | "thinking"
  | "worried"
  | "sleepy"
  | "waving";

interface RikuProps {
  mood?: RikuMood;
  size?: number;
}

export function Riku({ mood = "normal", size = 80 }: RikuProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`リク（${mood}）`}
    >
      <RikuBody mood={mood} />
    </svg>
  );
}

// ─────────────────────────────────────────
// 共通パーツ
// ─────────────────────────────────────────

const SKIN = "#FFDBB5";
const SKIN_DARK = "#F5B987";
const HAIR = "#5C3A1E";
const SHIRT_BLUE = "#5B9BD5";
const SHIRT_DARK = "#3A7BBF";
const EYE = "#333";
const CHEEK = "#FFAAAA";

function Body({ shirtColor = SHIRT_BLUE }: { shirtColor?: string }) {
  return (
    <>
      {/* 胴体 */}
      <ellipse cx="40" cy="62" rx="14" ry="10" fill={shirtColor} />
      {/* 首 */}
      <rect x="36" y="50" width="8" height="8" rx="2" fill={SKIN} />
    </>
  );
}

function Head() {
  return (
    <>
      {/* 頭 */}
      <ellipse cx="40" cy="34" rx="18" ry="18" fill={SKIN} />
      {/* 髪 */}
      <ellipse cx="40" cy="20" rx="18" ry="10" fill={HAIR} />
      <ellipse cx="26" cy="27" rx="5" ry="8" fill={HAIR} />
      <ellipse cx="54" cy="27" rx="5" ry="8" fill={HAIR} />
    </>
  );
}

function Cheeks() {
  return (
    <>
      <ellipse cx="28" cy="38" rx="5" ry="3" fill={CHEEK} opacity="0.6" />
      <ellipse cx="52" cy="38" rx="5" ry="3" fill={CHEEK} opacity="0.6" />
    </>
  );
}

// ─────────────────────────────────────────
// 表情別コンポーネント
// ─────────────────────────────────────────

function NormalFace() {
  return (
    <>
      {/* 目 */}
      <ellipse cx="33" cy="33" rx="3" ry="3.5" fill={EYE} />
      <ellipse cx="47" cy="33" rx="3" ry="3.5" fill={EYE} />
      {/* ハイライト */}
      <circle cx="34.2" cy="31.8" r="1" fill="white" />
      <circle cx="48.2" cy="31.8" r="1" fill="white" />
      {/* 口 — ゆるスマイル */}
      <path d="M34 41 Q40 46 46 41" stroke="#C0776A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Cheeks />
    </>
  );
}

function HappyFace() {
  return (
    <>
      {/* 目 — アーチ（うれしい目） */}
      <path d="M30 33 Q33 29 36 33" stroke={EYE} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M44 33 Q47 29 50 33" stroke={EYE} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* 口 — 大きい笑顔 */}
      <path d="M32 40 Q40 49 48 40" stroke="#C0776A" strokeWidth="2.2" fill="#FFAAAA" strokeLinecap="round" />
      <Cheeks />
    </>
  );
}

function ExcitedFace() {
  return (
    <>
      {/* 目 — キラキラ星形 */}
      <text x="28" y="37" fontSize="10" fill="#FFD700" textAnchor="middle">★</text>
      <text x="52" y="37" fontSize="10" fill="#FFD700" textAnchor="middle">★</text>
      {/* 口 — 大笑い */}
      <path d="M30 40 Q40 52 50 40" stroke="#C0776A" strokeWidth="2.2" fill="#FF9999" strokeLinecap="round" />
      <Cheeks />
    </>
  );
}

function ThinkingFace() {
  return (
    <>
      {/* 目 — 少し細め */}
      <ellipse cx="33" cy="33" rx="3" ry="2.5" fill={EYE} />
      <ellipse cx="47" cy="33" rx="3" ry="2.5" fill={EYE} />
      <circle cx="34.2" cy="32" r="1" fill="white" />
      <circle cx="48.2" cy="32" r="1" fill="white" />
      {/* 口 — 片側上がり */}
      <path d="M34 42 Q38 44 44 41" stroke="#C0776A" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* 眉 — ひとつ上がり */}
      <path d="M30 26 Q33 23 36 26" stroke={HAIR} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M44 25 Q47 22 50 25" stroke={HAIR} strokeWidth="2" fill="none" strokeLinecap="round" />
      <Cheeks />
    </>
  );
}

function WorriedFace() {
  return (
    <>
      {/* 目 — 下がり目 */}
      <ellipse cx="33" cy="34" rx="3" ry="3" fill={EYE} />
      <ellipse cx="47" cy="34" rx="3" ry="3" fill={EYE} />
      <circle cx="34.2" cy="32.5" r="1" fill="white" />
      <circle cx="48.2" cy="32.5" r="1" fill="white" />
      {/* 汗 */}
      <ellipse cx="55" cy="28" rx="2" ry="3" fill="#88CCFF" opacity="0.8" />
      {/* 口 — 逆アーチ（への字） */}
      <path d="M34 43 Q40 39 46 43" stroke="#C0776A" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* 眉 — ハの字 */}
      <path d="M30 27 Q33 24 36 27" stroke={HAIR} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M44 27 Q47 24 50 27" stroke={HAIR} strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  );
}

function SleepyFace() {
  return (
    <>
      {/* 目 — 半目 */}
      <path d="M30 34 Q33 31 36 34" stroke={EYE} strokeWidth="2.5" fill={SKIN} strokeLinecap="round" />
      <path d="M44 34 Q47 31 50 34" stroke={EYE} strokeWidth="2.5" fill={SKIN} strokeLinecap="round" />
      {/* 口 — ぽかーん */}
      <ellipse cx="40" cy="43" rx="4" ry="3" fill="#C0776A" />
      {/* zzz */}
      <text x="54" y="28" fontSize="8" fill="#888" fontWeight="bold">z</text>
      <text x="58" y="22" fontSize="10" fill="#888" fontWeight="bold">z</text>
      <text x="63" y="15" fontSize="12" fill="#888" fontWeight="bold">Z</text>
    </>
  );
}

function WavingFace() {
  return (
    <>
      {/* 目 — 細い笑顔目 */}
      <path d="M30 33 Q33 30 36 33" stroke={EYE} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M44 33 Q47 30 50 33" stroke={EYE} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* 口 — スマイル */}
      <path d="M33 41 Q40 47 47 41" stroke="#C0776A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Cheeks />
    </>
  );
}

// ─────────────────────────────────────────
// 腕・ポーズ
// ─────────────────────────────────────────

function ArmsNormal() {
  return (
    <>
      <line x1="26" y1="58" x2="18" y2="68" stroke={SHIRT_DARK} strokeWidth="6" strokeLinecap="round" />
      <line x1="54" y1="58" x2="62" y2="68" stroke={SHIRT_DARK} strokeWidth="6" strokeLinecap="round" />
      {/* 手 */}
      <circle cx="18" cy="69" r="4" fill={SKIN_DARK} />
      <circle cx="62" cy="69" r="4" fill={SKIN_DARK} />
    </>
  );
}

function ArmsHappy() {
  return (
    <>
      {/* 右腕ガッツポーズ */}
      <line x1="54" y1="58" x2="64" y2="46" stroke={SHIRT_DARK} strokeWidth="6" strokeLinecap="round" />
      <circle cx="64" cy="44" r="5" fill={SKIN_DARK} />
      {/* 左腕 — 腰に */}
      <line x1="26" y1="58" x2="20" y2="66" stroke={SHIRT_DARK} strokeWidth="6" strokeLinecap="round" />
      <circle cx="19" cy="67" r="4" fill={SKIN_DARK} />
    </>
  );
}

function ArmsExcited() {
  return (
    <>
      {/* 両手バンザイ */}
      <line x1="26" y1="58" x2="14" y2="44" stroke={SHIRT_DARK} strokeWidth="6" strokeLinecap="round" />
      <circle cx="13" cy="42" r="5" fill={SKIN_DARK} />
      <line x1="54" y1="58" x2="66" y2="44" stroke={SHIRT_DARK} strokeWidth="6" strokeLinecap="round" />
      <circle cx="67" cy="42" r="5" fill={SKIN_DARK} />
    </>
  );
}

function ArmsThinking() {
  return (
    <>
      {/* 左腕 — あごに手 */}
      <line x1="26" y1="58" x2="30" y2="46" stroke={SHIRT_DARK} strokeWidth="6" strokeLinecap="round" />
      <circle cx="32" cy="44" r="5" fill={SKIN_DARK} />
      {/* 右腕 — 下げ */}
      <line x1="54" y1="58" x2="62" y2="68" stroke={SHIRT_DARK} strokeWidth="6" strokeLinecap="round" />
      <circle cx="62" cy="69" r="4" fill={SKIN_DARK} />
    </>
  );
}

function ArmsWorried() {
  return (
    <>
      {/* 両腕 — 下げて困り気味 */}
      <line x1="26" y1="58" x2="16" y2="70" stroke={SHIRT_DARK} strokeWidth="6" strokeLinecap="round" />
      <circle cx="15" cy="71" r="4" fill={SKIN_DARK} />
      <line x1="54" y1="58" x2="64" y2="70" stroke={SHIRT_DARK} strokeWidth="6" strokeLinecap="round" />
      <circle cx="65" cy="71" r="4" fill={SKIN_DARK} />
    </>
  );
}

function ArmsSleepy() {
  return (
    <>
      {/* 腕だらん */}
      <line x1="26" y1="60" x2="18" y2="72" stroke={SHIRT_DARK} strokeWidth="6" strokeLinecap="round" />
      <circle cx="17" cy="73" r="4" fill={SKIN_DARK} />
      <line x1="54" y1="60" x2="62" y2="72" stroke={SHIRT_DARK} strokeWidth="6" strokeLinecap="round" />
      <circle cx="63" cy="73" r="4" fill={SKIN_DARK} />
    </>
  );
}

function ArmsWaving() {
  return (
    <>
      {/* 右腕 — 手を振る */}
      <line x1="54" y1="57" x2="68" y2="48" stroke={SHIRT_DARK} strokeWidth="6" strokeLinecap="round" />
      <circle cx="69" cy="46" r="5" fill={SKIN_DARK} />
      {/* 左腕 — 普通 */}
      <line x1="26" y1="58" x2="18" y2="68" stroke={SHIRT_DARK} strokeWidth="6" strokeLinecap="round" />
      <circle cx="17" cy="69" r="4" fill={SKIN_DARK} />
    </>
  );
}

// ─────────────────────────────────────────
// まとめてレンダリング
// ─────────────────────────────────────────

function RikuBody({ mood }: { mood: RikuMood }) {
  const faces: Record<RikuMood, React.ReactNode> = {
    normal: <NormalFace />,
    happy: <HappyFace />,
    excited: <ExcitedFace />,
    thinking: <ThinkingFace />,
    worried: <WorriedFace />,
    sleepy: <SleepyFace />,
    waving: <WavingFace />,
  };

  const arms: Record<RikuMood, React.ReactNode> = {
    normal: <ArmsNormal />,
    happy: <ArmsHappy />,
    excited: <ArmsExcited />,
    thinking: <ArmsThinking />,
    worried: <ArmsWorried />,
    sleepy: <ArmsSleepy />,
    waving: <ArmsWaving />,
  };

  return (
    <>
      <Body />
      {arms[mood]}
      <Head />
      {faces[mood]}
    </>
  );
}
