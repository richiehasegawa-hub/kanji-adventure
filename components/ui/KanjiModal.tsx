/**
 * ものがたり漢字アドベンチャー — 漢字詳細モーダル
 * components/ui/KanjiModal.tsx
 *
 * 漢字をタップしたときに表示するボトムシート。
 * - 大きな漢字表示
 * - 読み方カード
 * - 例文・例語カード
 * - もどる / つぎへ ボタン
 */

"use client";

import React, { useEffect } from "react";
import type { KanjiData } from "@/data/worlds";

interface KanjiModalProps {
  kanji: KanjiData;
  accentColor: string;
  hasNext: boolean;
  onClose: () => void;
  onNext: () => void;
}

export function KanjiModal({
  kanji,
  accentColor,
  hasNext,
  onClose,
  onNext,
}: KanjiModalProps) {
  // スクロール防止
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    // ── オーバーレイ背景 ──────────────────────────────
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "flex-end",
        zIndex: 100,
      }}
    >
      {/* ── モーダルパネル ────────────────────────────── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "24px 24px 0 0",
          padding: "24px 24px 48px",
          maxHeight: "88vh",
          overflowY: "auto",
        }}
      >
        {/* ドラッグバー */}
        <div
          style={{
            width: "40px",
            height: "4px",
            backgroundColor: "#ddd",
            borderRadius: "2px",
            margin: "0 auto 20px",
          }}
        />

        {/* ヘッダー */}
        <p
          style={{
            fontSize: "13px",
            color: "#888",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          漢字（かんじ）を学（まな）ぼう
        </p>

        {/* 大漢字 */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <span
            style={{
              fontSize: "100px",
              color: accentColor,
              fontWeight: "bold",
              lineHeight: 1,
              display: "block",
            }}
          >
            {kanji.character}
          </span>
        </div>

        {/* 読み方カード */}
        <div
          style={{
            backgroundColor: "#F5F5F5",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "16px",
          }}
        >
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "8px" }}>
            読（よ）みかた：
          </p>
          {kanji.readings.map((r, i) => (
            <p
              key={i}
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#333",
                lineHeight: 1.4,
              }}
            >
              {r}
            </p>
          ))}
        </div>

        {/* 例文・例語カード */}
        {kanji.examples && (
          <div
            style={{
              backgroundColor: "#FFF9C4",
              borderRadius: "12px",
              padding: "16px 20px",
              marginBottom: "28px",
            }}
          >
            <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.7 }}>
              {kanji.examples}
            </p>
          </div>
        )}

        {/* ボタン */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "16px",
              borderRadius: "14px",
              border: `2px solid ${accentColor}`,
              backgroundColor: "white",
              color: accentColor,
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              minHeight: "56px",
            }}
          >
            ◁ もどる
          </button>
          {hasNext && (
            <button
              onClick={onNext}
              style={{
                flex: 2,
                padding: "16px",
                borderRadius: "14px",
                border: "none",
                backgroundColor: accentColor,
                color: "white",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                minHeight: "56px",
              }}
            >
              つぎへ ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
