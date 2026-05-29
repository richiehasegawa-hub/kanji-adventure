/**
 * ものがたり漢字アドベンチャー — ふりがな設定ストア
 * stores/settingsStore.ts
 *
 * Zustand + persist（LocalStorageに保存）
 * キー: "furigana-settings"
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============================================================
// 型定義
// ============================================================

interface FuriganaState {
  /** true = ふりがな表示ON（初期値） */
  showFurigana: boolean;
  /** ON/OFF を切り替える */
  toggle: () => void;
  /** 直接セットする */
  setShow: (v: boolean) => void;
}

// ============================================================
// ストア
// ============================================================

export const useFuriganaStore = create<FuriganaState>()(
  persist(
    (set) => ({
      showFurigana: true, // 初期値：常時ON
      toggle: () => set((s) => ({ showFurigana: !s.showFurigana })),
      setShow: (v) => set({ showFurigana: v }),
    }),
    {
      name: "furigana-settings", // LocalStorage キー名
    }
  )
);
