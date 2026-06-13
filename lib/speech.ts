/**
 * lib/speech.ts
 * Web Speech API ユーティリティ — 日本語TTS
 */

import type { KanjiData } from "@/data/worlds";

/** ブラウザが speechSynthesis に対応しているか */
export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** テキストを日本語で読み上げる */
export function speakText(text: string): void {
  if (!isSpeechSupported()) return;

  // 読み上げ中のものをキャンセル
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ja-JP";
  utter.rate = 0.85; // 子ども向けに少しゆっくり
  window.speechSynthesis.speak(utter);
}

/** 読み上げを停止する */
export function stopSpeech(): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
}

/** 読み上げ中かどうか */
export function isSpeaking(): boolean {
  if (!isSpeechSupported()) return false;
  return window.speechSynthesis.speaking;
}

/**
 * 漢字カード用の読み上げ
 * 例：「山。読み方は、やま、さん。つかいかた：山の上に雪がある」
 */
export function speakKanji(kanji: KanjiData): void {
  const readings = kanji.readings.join("、");
  // examples から（よみ）形式の注釈を除いて読み上げテキストを作る
  const examples = kanji.examples.replace(/（[^）]*）/g, "");
  const text = `${kanji.character}。読み方は、${readings}。つかいかた：${examples}`;
  speakText(text);
}
