/**
 * ものがたり漢字アドベンチャー — 学習進捗ストア
 * stores/progressStore.ts
 *
 * Zustand + persist（LocalStorageに保存）
 * キー: "kanji-adventure-progress"
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProgress } from "@/types";

// ============================================================
// デフォルト値
// ============================================================

const defaultProgress: UserProgress = {
  userId: `user_${Math.random().toString(36).slice(2, 10)}`,
  currentEpisodeId: "ep01",
  completedEpisodes: [],
  masteredKanji: [],
  learningKanji: [],
  streakDays: 0,
  lastStudyDate: "",
  stepProgress: {},
  totalStudyMinutes: 0,
};

// ============================================================
// 型定義
// ============================================================

interface ProgressState {
  progress: UserProgress;
  /** STEPの完了を記録（最大値を保持） */
  completeStep: (episodeId: string, step: number) => void;
  /** エピソードの完了を記録 + 連続日数を更新 */
  completeEpisode: (episodeId: string) => void;
  /** 習得漢字リストに追加 */
  masterKanji: (kanjiId: string) => void;
  /** 学習時間を加算（分） */
  addStudyMinutes: (minutes: number) => void;
}

// ============================================================
// ストア
// ============================================================

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: defaultProgress,

      completeStep: (episodeId, step) =>
        set((s) => ({
          progress: {
            ...s.progress,
            stepProgress: {
              ...s.progress.stepProgress,
              [episodeId]: Math.max(
                s.progress.stepProgress[episodeId] ?? 0,
                step
              ),
            },
          },
        })),

      completeEpisode: (episodeId) => {
        const today = new Date().toISOString().split("T")[0];
        const { progress } = get();
        const isNewDay = progress.lastStudyDate !== today;
        const isConsecutive =
          progress.lastStudyDate ===
          new Date(Date.now() - 86400000).toISOString().split("T")[0];

        set((s) => ({
          progress: {
            ...s.progress,
            completedEpisodes: s.progress.completedEpisodes.includes(episodeId)
              ? s.progress.completedEpisodes
              : [...s.progress.completedEpisodes, episodeId],
            streakDays: isNewDay
              ? isConsecutive
                ? s.progress.streakDays + 1
                : 1
              : s.progress.streakDays,
            lastStudyDate: isNewDay ? today : s.progress.lastStudyDate,
          },
        }));
      },

      masterKanji: (kanjiId) =>
        set((s) => ({
          progress: {
            ...s.progress,
            masteredKanji: s.progress.masteredKanji.includes(kanjiId)
              ? s.progress.masteredKanji
              : [...s.progress.masteredKanji, kanjiId],
            learningKanji: s.progress.learningKanji.filter(
              (id) => id !== kanjiId
            ),
          },
        })),

      addStudyMinutes: (minutes) =>
        set((s) => ({
          progress: {
            ...s.progress,
            totalStudyMinutes: s.progress.totalStudyMinutes + minutes,
          },
        })),
    }),
    {
      name: "kanji-adventure-progress",
    }
  )
);
