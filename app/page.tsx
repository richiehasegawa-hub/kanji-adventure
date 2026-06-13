/**
 * ものがたり漢字アドベンチャー — メインアプリ
 * app/page.tsx
 *
 * 画面フロー:
 *   world-select → story → kanji-card → quiz → handwriting → complete
 */

"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { WORLDS, WorldData, EpisodeData, KanjiData, QuizQuestion } from "@/data/worlds";
import { useProgressStore } from "@/stores/progressStore";
import { speakKanji, speakText, stopSpeech, isSpeechSupported } from "@/lib/speech";

// ============================================================
// 型
// ============================================================

type Screen = "world-select" | "story" | "kanji-card" | "quiz" | "handwriting" | "complete";
type QuizPhase = "question" | "correct" | "wrong";

// ============================================================
// メインコンポーネント
// ============================================================

export default function Home() {
  const [screen, setScreen] = useState<Screen>("world-select");
  const [selectedWorld, setSelectedWorld] = useState<WorldData | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeData | null>(null);

  const { progress, completeEpisode } = useProgressStore();

  // 漢字カード用
  const [kanjiIndex, setKanjiIndex] = useState(0);

  // クイズ用
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizPhase, setQuizPhase] = useState<QuizPhase>("question");
  const [correctCount, setCorrectCount] = useState(0);

  // 手書き練習用
  const [handwritingIndex, setHandwritingIndex] = useState(0);

  // エピソード選択 → ストーリー画面へ
  function handleEpisodeSelect(world: WorldData, episode: EpisodeData) {
    setSelectedWorld(world);
    setSelectedEpisode(episode);
    setScreen("story");
    setKanjiIndex(0);
    setQuizIndex(0);
    setQuizPhase("question");
    setCorrectCount(0);
    setHandwritingIndex(0);
  }

  // ストーリー → 漢字カード
  function handleStoryComplete() {
    setKanjiIndex(0);
    setScreen("kanji-card");
  }

  // 漢字カード：つぎへ
  function handleKanjiNext() {
    if (!selectedEpisode) return;
    if (kanjiIndex < selectedEpisode.kanjiList.length - 1) {
      setKanjiIndex(kanjiIndex + 1);
    } else {
      setQuizIndex(0);
      setQuizPhase("question");
      setCorrectCount(0);
      setScreen("quiz");
    }
  }

  // クイズ：回答
  function handleQuizAnswer(isCorrect: boolean) {
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      setQuizPhase("correct");
    } else {
      setQuizPhase("wrong");
    }
  }

  // クイズ：つぎへ（正解後）
  function handleQuizNext() {
    if (!selectedEpisode) return;
    const nextIndex = quizIndex + 1;
    if (nextIndex < selectedEpisode.quizzes.length) {
      setQuizIndex(nextIndex);
      setQuizPhase("question");
    } else {
      // クイズ完了 → 手書き練習へ
      setHandwritingIndex(0);
      setScreen("handwriting");
    }
  }

  // クイズ：もういちど（不正解後）
  function handleQuizRetry() {
    setQuizPhase("question");
  }

  // 手書き：つぎへ
  function handleHandwritingNext() {
    if (!selectedEpisode) return;
    const next = handwritingIndex + 1;
    if (next < selectedEpisode.kanjiList.length) {
      setHandwritingIndex(next);
    } else {
      completeEpisode(selectedEpisode.id);
      setScreen("complete");
    }
  }

  // もどる（ストーリー/漢字カード → ワールド選択）
  function handleBack() {
    setScreen("world-select");
  }

  // ============================================================
  // 画面ルーティング
  // ============================================================

  if (screen === "kanji-card" && selectedWorld && selectedEpisode) {
    return (
      <KanjiCardScreen
        world={selectedWorld}
        episode={selectedEpisode}
        kanjiIndex={kanjiIndex}
        onNext={handleKanjiNext}
        onBack={() => setScreen("story")}
      />
    );
  }

  if (screen === "quiz" && selectedWorld && selectedEpisode) {
    return (
      <QuizScreen
        world={selectedWorld}
        episode={selectedEpisode}
        quizIndex={quizIndex}
        quizPhase={quizPhase}
        onAnswer={handleQuizAnswer}
        onNext={handleQuizNext}
        onRetry={handleQuizRetry}
        onBack={() => { setKanjiIndex(0); setScreen("kanji-card"); }}
      />
    );
  }

  if (screen === "handwriting" && selectedWorld && selectedEpisode) {
    return (
      <HandwritingScreen
        world={selectedWorld}
        episode={selectedEpisode}
        handwritingIndex={handwritingIndex}
        onNext={handleHandwritingNext}
        onBack={() => { setQuizIndex(0); setQuizPhase("question"); setScreen("quiz"); }}
      />
    );
  }

  if (screen === "complete" && selectedWorld && selectedEpisode) {
    return (
      <CompleteScreen
        world={selectedWorld}
        episode={selectedEpisode}
        correctCount={correctCount}
        totalQuiz={selectedEpisode.quizzes.length}
        onHome={handleBack}
      />
    );
  }

  if (screen === "story" && selectedWorld && selectedEpisode) {
    return (
      <StoryScreen
        world={selectedWorld}
        episode={selectedEpisode}
        onBack={handleBack}
        onComplete={handleStoryComplete}
      />
    );
  }

  return (
    <WorldSelectScreen
      onEpisodeSelect={handleEpisodeSelect}
      completedEpisodes={progress.completedEpisodes}
    />
  );
}

// ============================================================
// ワールド選択画面
// ============================================================

function WorldSelectScreen({
  onEpisodeSelect,
  completedEpisodes,
}: {
  onEpisodeSelect: (world: WorldData, episode: EpisodeData) => void;
  completedEpisodes: string[];
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1A1A2E",
        padding: "24px 16px 40px",
        fontFamily: "var(--font-noto-sans-jp), 'Noto Sans JP', sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "#FFD700",
          marginBottom: "4px",
          textAlign: "center",
        }}
      >
        ものがたり漢字アドベンチャー
      </h1>
      <p
        style={{
          fontSize: "13px",
          color: "#aaa",
          textAlign: "center",
          marginBottom: "28px",
        }}
      >
        すきなワールドをえらんでね
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        {WORLDS.map((world) => (
          <WorldCard
            key={world.id}
            world={world}
            onEpisodeSelect={onEpisodeSelect}
            completedEpisodes={completedEpisodes}
          />
        ))}
      </div>
    </div>
  );
}

function WorldCard({
  world,
  onEpisodeSelect,
  completedEpisodes,
}: {
  world: WorldData;
  onEpisodeSelect: (world: WorldData, episode: EpisodeData) => void;
  completedEpisodes: string[];
}) {
  return (
    <div
      style={{
        backgroundColor: world.cardColor,
        borderRadius: "20px",
        padding: "20px",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "8px",
        }}
      >
        <span style={{ fontSize: "36px" }}>{world.emoji}</span>
        <div>
          <div style={{ fontSize: "28px", fontWeight: "bold", lineHeight: 1 }}>
            {world.name}
          </div>
          <div style={{ fontSize: "14px", opacity: 0.85, marginTop: "2px" }}>
            ふりがな：{world.reading}
          </div>
        </div>
      </div>

      <p style={{ fontSize: "14px", opacity: 0.85, marginBottom: "12px" }}>
        {world.episodes.length}つのお話（はなし）
      </p>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {world.episodes.map((ep) => {
          const isDone = completedEpisodes.includes(ep.id);
          return (
            <button
              key={ep.id}
              onClick={() => onEpisodeSelect(world, ep)}
              style={{
                position: "relative",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: isDone ? "#4CAF50" : "rgba(255,255,255,0.25)",
                border: isDone ? "2px solid #81C784" : "2px solid rgba(255,255,255,0.6)",
                color: "white",
                fontSize: isDone ? "22px" : "18px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {isDone ? "✓" : ep.number}
            </button>
          );
        })}
        {[...Array(Math.max(0, 3 - world.episodes.length))].map((_, i) => (
          <button
            key={`soon-${i}`}
            disabled
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "2px solid rgba(255,255,255,0.3)",
              color: "rgba(255,255,255,0.4)",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "not-allowed",
            }}
          >
            {world.episodes.length + i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// ストーリー画面（STEP 1）
// ============================================================

function StoryScreen({
  world,
  episode,
  onBack,
  onComplete,
}: {
  world: WorldData;
  episode: EpisodeData;
  onBack: () => void;
  onComplete: () => void;
}) {
  const paragraphs = episode.storyText.split("\n");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#E8EAF6",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-noto-sans-jp), 'Noto Sans JP', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: world.cardColor + "22",
            border: "none",
            color: world.cardColor,
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            minHeight: "40px",
            minWidth: "40px",
          }}
        >
          ◁
        </button>
        <div>
          <div style={{ fontSize: "11px", color: "#888" }}>STEP 1 — ものがたり</div>
          <h2
            style={{
              fontSize: "17px",
              fontWeight: "bold",
              color: "#333",
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            {episode.title}
          </h2>
          {episode.titleKana && (
            <div style={{ fontSize: "11px", color: "#888", marginTop: "1px" }}>
              {episode.titleKana}
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, padding: "20px 16px", overflowY: "auto" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "24px 20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <span style={{ fontSize: "64px" }}>{episode.emoji}</span>
          </div>

          <div style={{ fontSize: "22px", color: "#333", lineHeight: 1.85 }}>
            {paragraphs.map((line, idx) =>
              line === "" ? (
                <div key={idx} style={{ height: "1em" }} />
              ) : (
                <p key={idx} style={{ marginBottom: "8px" }}>
                  {line}
                </p>
              )
            )}
          </div>

          <div
            style={{
              backgroundColor: "#FFF9C4",
              borderRadius: "12px",
              padding: "14px 16px",
              marginTop: "20px",
            }}
          >
            <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.6, margin: 0 }}>
              📖 お話を読んだら「できた！」をおしてね。<br />
              つぎは漢字（かんじ）のカードがでてくるよ！
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "12px 16px 28px",
          display: "flex",
          gap: "12px",
          boxShadow: "0 -1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "14px",
            border: `2px solid ${world.cardColor}`,
            backgroundColor: "white",
            color: world.cardColor,
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            minHeight: "52px",
          }}
        >
          ◁ もどる
        </button>
        <button
          onClick={onComplete}
          style={{
            flex: 2,
            padding: "14px",
            borderRadius: "14px",
            border: "none",
            backgroundColor: world.cardColor,
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            minHeight: "52px",
          }}
        >
          できた！ ▷
        </button>
      </div>
    </div>
  );
}

// ============================================================
// 漢字カード画面（STEP 2）
// ============================================================

function SpeakButton({
  onSpeak,
  color,
}: {
  onSpeak: () => void;
  color: string;
}) {
  const [speaking, setSpeaking] = useState(false);
  const supported = isSpeechSupported();

  const handleClick = useCallback(() => {
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
    } else {
      onSpeak();
      setSpeaking(true);
      // 読み上げ終了を検知（最大10秒でリセット）
      const timer = setTimeout(() => setSpeaking(false), 10000);
      // speechSynthesis は onend を直接ポーリングで確認
      const poll = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          setSpeaking(false);
          clearInterval(poll);
          clearTimeout(timer);
        }
      }, 300);
    }
  }, [speaking, onSpeak]);

  if (!supported) return null;

  return (
    <button
      onClick={handleClick}
      aria-label="よみあげ"
      style={{
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        backgroundColor: speaking ? color : color + "22",
        border: `2px solid ${color}`,
        color: speaking ? "white" : color,
        fontSize: "22px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.2s",
      }}
    >
      {speaking ? "⏸" : "🔊"}
    </button>
  );
}

function KanjiCardScreen({
  world,
  episode,
  kanjiIndex,
  onNext,
  onBack,
}: {
  world: WorldData;
  episode: EpisodeData;
  kanjiIndex: number;
  onNext: () => void;
  onBack: () => void;
}) {
  const kanji = episode.kanjiList[kanjiIndex];
  const isLast = kanjiIndex === episode.kanjiList.length - 1;
  const total = episode.kanjiList.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#E8EAF6",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-noto-sans-jp), 'Noto Sans JP', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: world.cardColor + "22",
            border: "none",
            color: world.cardColor,
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          ◁
        </button>
        <div>
          <div style={{ fontSize: "11px", color: "#888" }}>STEP 2 — 漢字カード</div>
          <h2 style={{ fontSize: "17px", fontWeight: "bold", color: "#333", margin: 0 }}>
            {episode.title}
          </h2>
          {episode.titleKana && (
            <div style={{ fontSize: "11px", color: "#888", marginTop: "1px" }}>
              {episode.titleKana}
            </div>
          )}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
          {episode.kanjiList.map((_, i) => (
            <div
              key={i}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: i <= kanjiIndex ? world.cardColor : "#ddd",
                transition: "background-color 0.3s",
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            padding: "32px 24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          {/* 漢字文字 ＋ 読み上げボタン */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                fontSize: "96px",
                fontWeight: "bold",
                color: world.cardColor,
                lineHeight: 1.1,
              }}
            >
              {kanji.character}
            </div>
            <SpeakButton
              color={world.cardColor}
              onSpeak={() => speakKanji(kanji)}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            {kanji.readings.map((r, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: world.cardColor + "22",
                  color: world.cardColor,
                  borderRadius: "20px",
                  padding: "4px 14px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                {r}
              </span>
            ))}
          </div>

          <div
            style={{
              backgroundColor: "#F5F5F5",
              borderRadius: "12px",
              padding: "14px 16px",
              marginBottom: "12px",
              textAlign: "left",
            }}
          >
            <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>
              ✏️ つかいかた
            </div>
            <div style={{ fontSize: "16px", color: "#333", lineHeight: 1.6 }}>
              {kanji.examples}
            </div>
            {kanji.exampleOnyomi && (
              <div style={{ fontSize: "15px", color: "#555", marginTop: "6px", lineHeight: 1.6 }}>
                {kanji.exampleOnyomi}
              </div>
            )}
          </div>

          {kanji.hint && (
            <div
              style={{
                backgroundColor: "#FFF9C4",
                borderRadius: "12px",
                padding: "12px 16px",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>
                💡 おぼえかた
              </div>
              <div style={{ fontSize: "15px", color: "#555", lineHeight: 1.6 }}>
                {kanji.hint}
              </div>
            </div>
          )}
        </div>

        <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>
          {kanjiIndex + 1} / {total} まい
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "12px 16px 28px",
          display: "flex",
          gap: "12px",
          boxShadow: "0 -1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "14px",
            border: `2px solid ${world.cardColor}`,
            backgroundColor: "white",
            color: world.cardColor,
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            minHeight: "52px",
          }}
        >
          ◁ もどる
        </button>
        <button
          onClick={onNext}
          style={{
            flex: 2,
            padding: "14px",
            borderRadius: "14px",
            border: "none",
            backgroundColor: world.cardColor,
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            minHeight: "52px",
          }}
        >
          {isLast ? "クイズへ！ 🎯" : "つぎへ ▷"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// クイズ画面（STEP 3）
// ============================================================

function QuizScreen({
  world,
  episode,
  quizIndex,
  quizPhase,
  onAnswer,
  onNext,
  onRetry,
  onBack,
}: {
  world: WorldData;
  episode: EpisodeData;
  quizIndex: number;
  quizPhase: QuizPhase;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  onRetry: () => void;
  onBack: () => void;
}) {
  const quiz = episode.quizzes[quizIndex];
  const isLast = quizIndex === episode.quizzes.length - 1;
  const total = episode.quizzes.length;

  const shuffledOptions = useMemo(() => {
    const opts = [...quiz.options];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }, [quiz.id]);

  const correctAnswer = quiz.options[0];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#E8EAF6",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-noto-sans-jp), 'Noto Sans JP', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: world.cardColor + "22",
            border: "none",
            color: world.cardColor,
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          ◁
        </button>
        <div>
          <div style={{ fontSize: "11px", color: "#888" }}>STEP 3 — クイズ</div>
          <h2 style={{ fontSize: "17px", fontWeight: "bold", color: "#333", margin: 0 }}>
            {episode.title}
          </h2>
          {episode.titleKana && (
            <div style={{ fontSize: "11px", color: "#888", marginTop: "1px" }}>
              {episode.titleKana}
            </div>
          )}
        </div>
        <div
          style={{
            marginLeft: "auto",
            backgroundColor: world.cardColor + "22",
            color: world.cardColor,
            borderRadius: "20px",
            padding: "4px 12px",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {quizIndex + 1} / {total}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "480px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "24px 20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <span
            style={{
              backgroundColor: world.cardColor,
              color: "white",
              borderRadius: "8px",
              padding: "3px 10px",
              fontSize: "12px",
              fontWeight: "bold",
              display: "inline-block",
              marginBottom: "12px",
            }}
          >
            {quiz.type}
          </span>

          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: world.cardColor,
              textAlign: "center",
              lineHeight: 1.1,
              marginBottom: "12px",
            }}
          >
            {quiz.targetKanji}
          </div>

          {/* 問題文 ＋ 読み上げボタン */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                color: "#333",
                lineHeight: 1.7,
                textAlign: "center",
                margin: 0,
                flex: 1,
              }}
            >
              {quiz.question}
            </p>
            <SpeakButton
              color={world.cardColor}
              onSpeak={() => speakText(quiz.question)}
            />
          </div>
        </div>

        {quizPhase === "correct" && (
          <div
            style={{
              backgroundColor: "#E8F5E9",
              border: "2px solid #4CAF50",
              borderRadius: "16px",
              padding: "16px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "4px" }}>⭐</div>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#2E7D32" }}>
              せいかい！
            </div>
          </div>
        )}

        {quizPhase === "wrong" && (
          <div
            style={{
              backgroundColor: "#FFF3E0",
              border: "2px solid #FF9800",
              borderRadius: "16px",
              padding: "16px 20px",
            }}
          >
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#E65100", marginBottom: "6px" }}>
              もういちど考えてみよう 💭
            </div>
            <div style={{ fontSize: "15px", color: "#555", lineHeight: 1.6 }}>
              ヒント：{quiz.hint}
            </div>
          </div>
        )}

        {quizPhase === "question" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {shuffledOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => onAnswer(opt === correctAnswer)}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  borderRadius: "14px",
                  border: `2px solid ${world.cardColor}44`,
                  backgroundColor: "white",
                  color: "#333",
                  fontSize: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textAlign: "left",
                  minHeight: "56px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: world.cardColor + "22",
                    color: world.cardColor,
                    fontSize: "14px",
                    fontWeight: "bold",
                    textAlign: "center",
                    lineHeight: "28px",
                    marginRight: "12px",
                  }}
                >
                  {["ア", "イ", "ウ", "エ"][i]}
                </span>
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {quizPhase !== "question" && (
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "12px 16px 28px",
            display: "flex",
            gap: "12px",
            boxShadow: "0 -1px 3px rgba(0,0,0,0.06)",
          }}
        >
          {quizPhase === "wrong" ? (
            <button
              onClick={onRetry}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                backgroundColor: "#FF9800",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                minHeight: "52px",
              }}
            >
              もういちど 🔄
            </button>
          ) : (
            <button
              onClick={onNext}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                backgroundColor: world.cardColor,
                color: "white",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                minHeight: "52px",
              }}
            >
              {isLast ? "てがきれんしゅうへ ✏️" : "つぎのもんだい ▷"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 手書き練習画面（STEP 4）
// ============================================================

const CANVAS_SIZE = 300;

function HandwritingScreen({
  world,
  episode,
  handwritingIndex,
  onNext,
  onBack,
}: {
  world: WorldData;
  episode: EpisodeData;
  handwritingIndex: number;
  onNext: () => void;
  onBack: () => void;
}) {
  const kanji = episode.kanjiList[handwritingIndex];
  const isLast = handwritingIndex === episode.kanjiList.length - 1;
  const total = episode.kanjiList.length;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // 漢字が変わったらキャンバスをクリア
  useEffect(() => {
    clearCanvas();
  }, [handwritingIndex]);

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function getCanvasPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function startDrawing(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    lastPos.current = getCanvasPos(e);
    // 点を打つ（タップだけで終わった場合のため）
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getCanvasPos(e);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#1A1A2E";
    ctx.fill();
  }

  function draw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current || !lastPos.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getCanvasPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1A1A2E";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    lastPos.current = pos;
  }

  function stopDrawing() {
    isDrawing.current = false;
    lastPos.current = null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#E8EAF6",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-noto-sans-jp), 'Noto Sans JP', sans-serif",
      }}
    >
      {/* トップバー */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: world.cardColor + "22",
            border: "none",
            color: world.cardColor,
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          ◁
        </button>
        <div>
          <div style={{ fontSize: "11px", color: "#888" }}>STEP 4 — てがきれんしゅう</div>
          <h2 style={{ fontSize: "17px", fontWeight: "bold", color: "#333", margin: 0 }}>
            {episode.title}
          </h2>
          {episode.titleKana && (
            <div style={{ fontSize: "11px", color: "#888", marginTop: "1px" }}>
              {episode.titleKana}
            </div>
          )}
        </div>
        {/* 進捗ドット */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
          {episode.kanjiList.map((_, i) => (
            <div
              key={i}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: i <= handwritingIndex ? world.cardColor : "#ddd",
                transition: "background-color 0.3s",
              }}
            />
          ))}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div
        style={{
          flex: 1,
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
          overflowY: "auto",
        }}
      >
        {/* 指示 */}
        <div style={{ textAlign: "center" }}>
          <span
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: world.cardColor,
            }}
          >
            {kanji.character}
          </span>
          <span style={{ fontSize: "20px", color: "#555", marginLeft: "12px" }}>
            をかいてみよう！
          </span>
        </div>

        {/* 読み方タグ */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          {kanji.readings.map((r, i) => (
            <span
              key={i}
              style={{
                backgroundColor: world.cardColor + "22",
                color: world.cardColor,
                borderRadius: "20px",
                padding: "3px 12px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {r}
            </span>
          ))}
        </div>

        {/* キャンバスエリア */}
        <div
          style={{
            position: "relative",
            width: `${CANVAS_SIZE}px`,
            height: `${CANVAS_SIZE}px`,
            borderRadius: "20px",
            border: `3px solid ${world.cardColor}55`,
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {/* ガイド文字（薄く表示） */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "200px",
              color: "rgba(0,0,0,0.05)",
              pointerEvents: "none",
              userSelect: "none",
              lineHeight: 1,
              fontFamily: "var(--font-noto-sans-jp), 'Noto Sans JP', sans-serif",
              fontWeight: "bold",
            }}
          >
            {kanji.character}
          </div>

          {/* 格子線（十字） */}
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            {/* 縦線 */}
            <line
              x1="50%" y1="0" x2="50%" y2="100%"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="1"
              strokeDasharray="8,6"
            />
            {/* 横線 */}
            <line
              x1="0" y1="50%" x2="100%" y2="50%"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="1"
              strokeDasharray="8,6"
            />
            {/* 対角線（書道手本のグリッド風） */}
            <line
              x1="0" y1="0" x2="100%" y2="100%"
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="1"
              strokeDasharray="6,8"
            />
            <line
              x1="100%" y1="0" x2="0" y2="100%"
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="1"
              strokeDasharray="6,8"
            />
          </svg>

          {/* 描画キャンバス */}
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              touchAction: "none",
              cursor: "crosshair",
            }}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
            onPointerCancel={stopDrawing}
          />
        </div>

        {/* けすボタン */}
        <button
          onClick={clearCanvas}
          style={{
            padding: "10px 28px",
            borderRadius: "12px",
            border: `2px solid ${world.cardColor}44`,
            backgroundColor: "white",
            color: "#555",
            fontSize: "17px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          🗑️ けす
        </button>

        {/* 枚数表示 */}
        <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>
          {handwritingIndex + 1} / {total} もじ
        </p>
      </div>

      {/* ボトムナビ */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "12px 16px 28px",
          display: "flex",
          gap: "12px",
          boxShadow: "0 -1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "14px",
            border: `2px solid ${world.cardColor}`,
            backgroundColor: "white",
            color: world.cardColor,
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            minHeight: "52px",
          }}
        >
          ◁ もどる
        </button>
        <button
          onClick={onNext}
          style={{
            flex: 2,
            padding: "14px",
            borderRadius: "14px",
            border: "none",
            backgroundColor: world.cardColor,
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            minHeight: "52px",
          }}
        >
          {isLast ? "かんせい！ 🎉" : "つぎへ ▷"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// 完了画面
// ============================================================

function CompleteScreen({
  world,
  episode,
  correctCount,
  totalQuiz,
  onHome,
}: {
  world: WorldData;
  episode: EpisodeData;
  correctCount: number;
  totalQuiz: number;
  onHome: () => void;
}) {
  const allCorrect = correctCount === totalQuiz;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1A1A2E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-noto-sans-jp), 'Noto Sans JP', sans-serif",
        padding: "24px 16px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "80px", marginBottom: "16px" }}>
        {allCorrect ? "🌟" : "⭐"}
      </div>

      <div style={{ fontSize: "40px", marginBottom: "12px" }}>{episode.emoji}</div>

      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#FFD700",
          marginBottom: "8px",
          lineHeight: 1.4,
        }}
      >
        {allCorrect ? "かんぺき！！" : "クリア！"}
      </h1>

      <h2
        style={{
          fontSize: "17px",
          color: "#ccc",
          marginBottom: "24px",
          fontWeight: "normal",
        }}
      >
        {episode.title}
      </h2>

      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "20px 32px",
          marginBottom: "32px",
        }}
      >
        <div style={{ fontSize: "14px", color: "#aaa", marginBottom: "8px" }}>
          クイズのせいかい
        </div>
        <div
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: world.cardColor,
            lineHeight: 1,
          }}
        >
          {correctCount}
          <span style={{ fontSize: "24px", color: "#aaa", fontWeight: "normal" }}>
            {" "}/ {totalQuiz}
          </span>
        </div>
        <div style={{ fontSize: "14px", color: "#aaa", marginTop: "8px" }}>
          もん せいかい！
        </div>
      </div>

      <p
        style={{
          fontSize: "17px",
          color: "#eee",
          lineHeight: 1.7,
          marginBottom: "32px",
          maxWidth: "320px",
        }}
      >
        {allCorrect
          ? `${world.name}の漢字をマスターしたよ！\nどんどん進もう！`
          : `よくがんばったね！\nまた挑戦してみよう！`}
      </p>

      <button
        onClick={onHome}
        style={{
          padding: "16px 48px",
          borderRadius: "16px",
          border: "none",
          backgroundColor: world.cardColor,
          color: "white",
          fontSize: "20px",
          fontWeight: "bold",
          cursor: "pointer",
          minHeight: "56px",
          width: "100%",
          maxWidth: "320px",
        }}
      >
        🏠 トップへもどる
      </button>
    </div>
  );
}
