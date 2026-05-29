/**
 * ものがたり漢字アドベンチャー — 型定義
 * src/types/index.ts
 */

// ============================================================
// RubyText — ルビ付きテキストの基本単位
// ============================================================

/** 1つの文字セグメント */
export interface RubySegment {
  /** 表示テキスト（漢字またはひらがな） */
  text: string;
  /** ふりがな（漢字のときのみ） */
  ruby?: string;
}

/** ルビ付きテキスト配列 */
export type RubyText = RubySegment[];

// 例：「リクの手に地図があった」
// [
//   { text: "リクの" },
//   { text: "手", ruby: "て" },
//   { text: "に" },
//   { text: "地図", ruby: "ちず" },
//   { text: "があった" }
// ]

// ============================================================
// Kanji — 漢字データ
// ============================================================

export interface Kanji {
  /** 漢字ID（例: "kanji_te"） */
  id: string;
  /** 漢字本体（例: "手"） */
  character: string;
  /** 音読み（例: ["しゅ"]） */
  onyomi: string[];
  /** 訓読み（例: ["て"]） */
  kunyomi: string[];
  /** 意味（例: "手・てのひら"） */
  meaning: string;
  /** 学年 */
  gradeLevel: 1 | 2;
  /** 画数 */
  strokeCount: number;
  /** 例語リスト */
  exampleWords: {
    word: string;     // 例: "握手"
    reading: string;  // 例: "あくしゅ"
    meaning: string;  // 例: "手をにぎること"
  }[];
  /** 例文（ルビ付き） */
  exampleSentence: {
    ruby: RubyText;
    plain: string;    // 例: "リクの手に地図があった"
  };
  /** 覚えコツ（例: "5本指を広げた形"） */
  mnemonicHint: string;
  /** 登場エピソードIDリスト */
  episodeIds: string[];
}

// ============================================================
// Episode — エピソードデータ
// ============================================================

export type AreaType = "factory" | "map" | "library";

export interface Episode {
  /** エピソードID（例: "ep01"） */
  id: string;
  /** 所属エリア */
  area: AreaType;
  /** エピソード番号 */
  episodeNumber: number;
  /** タイトル */
  title: string;
  /** あらすじ */
  synopsis: string;
  /** 物語テキスト（ルビ付き） */
  storyText: RubyText;
  /** 重点漢字IDリスト（5〜6字） */
  focusKanjiIds: string[];
  /** クイズ問題リスト */
  quizzes: Quiz[];
}

// ============================================================
// Quiz — クイズデータ
// ============================================================

export type QuizType = "multiple-choice" | "matching" | "fill-blank";

export interface QuizOption {
  label: string;
  value: string;
}

export interface Quiz {
  /** クイズID */
  id: string;
  /** 種別 */
  type: QuizType;
  /** 問題文（ルビ付き） */
  question: RubyText;
  /** 選択肢リスト */
  options: QuizOption[];
  /** 正解のvalue */
  correctAnswer: string;
  /** ヒント文 */
  hint: string;
}

// ============================================================
// UserProgress — 学習進捗
// ============================================================

export interface UserProgress {
  /** LocalStorage用（匿名ID） */
  userId: string;
  /** 現在学習中のエピソードID */
  currentEpisodeId: string;
  /** 完了済みエピソードIDリスト */
  completedEpisodes: string[];
  /** 習得済み漢字IDリスト */
  masteredKanji: string[];
  /** 学習中漢字IDリスト */
  learningKanji: string[];
  /** 連続学習日数 */
  streakDays: number;
  /** 最終学習日（ISO8601） */
  lastStudyDate: string;
  /** エピソード別完了STEP番号（episodeId → 完了STEP番号） */
  stepProgress: Record<string, number>;
  /** 累計学習時間（分） */
  totalStudyMinutes: number;
}

// ============================================================
// キャラクター「リク」関連
// ============================================================

export type RikuMood =
  | "normal"    // 通常・待機（デフォルト）
  | "happy"     // 正解・達成時（ガッツポーズ）
  | "excited"   // 連続正解・完了時（両手バンザイ）
  | "thinking"  // クイズ中・考え中（あごに手）
  | "worried"   // 不正解・ヒント時（困り顔）
  | "sleepy"    // 3日以上未ログイン（zzz）
  | "waving";   // 起動時・終了時（手を振る）

export type ReactionEvent =
  | "correct"
  | "incorrect"
  | "complete"
  | "hint"
  | "start"
  | "end";

// ============================================================
// STEP — 画面ステップ
// ============================================================

export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface StepProps {
  episodeId: string;
  onComplete: () => void;
}
