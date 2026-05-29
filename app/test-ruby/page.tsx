/**
 * ものがたり漢字アドベンチャー — ルビ動作確認ページ
 * app/test-ruby/page.tsx
 *
 * EP1「リクの工場見学」物語テキストでルビ表示・切替を確認
 */

"use client";

import { useState } from "react";
import { RubyText, parseRubyString } from "@/components/ui/RubyText";

// EP1 物語テキスト（ルビ記法: 漢字《よみ》）
const EP1_STORY =
  "かんじたんてい・リクは、ふしぎな「からくり工場《こうじょう》」に迷《まよ》い込《こ》んだ。\n" +
  "入《い》り口《ぐち》の地図《ちず》には、体《からだ》のパーツをあらわす漢字《かんじ》が書《か》かれていた。\n\n" +
  "「手《て》・足《あし》・目《め》・口《くち》・耳《みみ》……ぼく、これぜんぶ知《し》ってるぞ！」\n\n" +
  "リクが漢字《かんじ》を読《よ》むと、鉄《てつ》の扉《とびら》がゆっくり開《あ》いた。\n" +
  "さあ、からくり工場《こうじょう》の冒険《ぼうけん》がはじまる！";

export default function TestRubyPage() {
  // テストページはZustandを使わずシンプルなuseStateでトグル管理
  // （Zustand のSSR挙動に依存しない形で動作確認）
  const [showFurigana, setShowFurigana] = useState(true);
  const toggle = () => setShowFurigana((v) => !v);
  const displayFurigana = showFurigana;

  // 段落ごとに分割してレンダリング
  const paragraphs = EP1_STORY.split("\n");

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#1A1A2E",
        color: "#ffffff",
        padding: "32px 24px",
        fontFamily: "var(--font-noto-sans-jp), 'Noto Sans JP', sans-serif",
      }}
    >
      {/* ページタイトル */}
      <h1
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "8px",
          color: "#FFD700",
        }}
      >
        ものがたり漢字アドベンチャー
      </h1>
      <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "32px" }}>
        ルビ（ふりがな）動作確認ページ — EP1「リクの工場見学」
      </p>

      {/* ふりがな切替ボタン */}
      <button
        onClick={toggle}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 24px",
          borderRadius: "12px",
          border: "2px solid #5C6BC0",
          backgroundColor: displayFurigana ? "#5C6BC0" : "transparent",
          color: "#ffffff",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: "40px",
          minHeight: "48px",
          transition: "background-color 0.2s",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <span style={{ fontSize: "22px" }}>あ</span>
        <span style={{ fontSize: "14px", color: "#ccc" }}>
          {displayFurigana ? "ふりがな：ひょうじ中" : "ふりがな：かくす"}
        </span>
      </button>

      {/* ★ 診断ブロック：生HTMLで ruby が動くか確認 */}
      <div
        style={{
          backgroundColor: "#fff3cd",
          color: "#1A1A1A",
          borderRadius: "12px",
          padding: "16px 20px",
          maxWidth: "680px",
          fontSize: "26px",
          marginBottom: "24px",
          border: "2px solid #ffc107",
        }}
      >
        <p style={{ fontSize: "13px", color: "#666", marginBottom: "8px" }}>
          🔬 診断テスト（生HTML）
        </p>
        {/* ① Tailwind・Reactを介さない素のruby */}
        <p>
          <ruby>工場<rt>こうじょう</rt></ruby>に
          <ruby>迷<rt>まよ</rt></ruby>い込んだ。
        </p>
      </div>

      {/* 物語テキスト */}
      <div
        style={{
          backgroundColor: "#FFFBF0",
          color: "#1A1A1A",
          borderRadius: "16px",
          padding: "32px 24px",
          maxWidth: "680px",
          fontSize: "26px",
          fontFamily: "var(--font-noto-sans-jp), 'Noto Sans JP', sans-serif",
        }}
      >
        {paragraphs.map((line, idx) =>
          line === "" ? (
            <br key={idx} />
          ) : (
            <p key={idx} style={{ marginBottom: "24px", lineHeight: "1.8" }}>
              <RubyText
                segments={parseRubyString(line)}
                showFurigana={displayFurigana}
                onKanjiTap={(seg) =>
                  alert(`漢字タップ: ${seg.text}（${seg.ruby}）`)
                }
              />
            </p>
          )
        )}
      </div>

      {/* チェックリスト */}
      <div
        style={{
          marginTop: "48px",
          padding: "24px",
          backgroundColor: "#16213E",
          borderRadius: "12px",
          maxWidth: "680px",
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px", color: "#FFD700" }}>
          ✅ 確認チェック
        </h2>
        <ul style={{ fontSize: "14px", lineHeight: "2", color: "#ccc" }}>
          <li>□ ふりがなが漢字の上に表示される</li>
          <li>□ ボタンでふりがなのON/OFFが切り替わる</li>
          <li>□ 漢字をタップするとアラートが出る</li>
          <li>□ テキストが読みやすいフォントサイズ（22px）</li>
          <li>□ 背景色・フォント（Noto Sans JP）が正しく表示される</li>
        </ul>
      </div>

      {/* 型・パーサーの動作確認 */}
      <div
        style={{
          marginTop: "32px",
          padding: "24px",
          backgroundColor: "#0f3460",
          borderRadius: "12px",
          maxWidth: "680px",
          fontFamily: "monospace",
        }}
      >
        <h2 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "12px", color: "#FFD700" }}>
          🔧 parseRubyString() 出力サンプル（最初の10セグメント）
        </h2>
        <pre style={{ fontSize: "12px", color: "#aef", overflowX: "auto" }}>
          {JSON.stringify(parseRubyString(paragraphs[0]).slice(0, 10), null, 2)}
        </pre>
      </div>
    </main>
  );
}
