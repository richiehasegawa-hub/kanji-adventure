/**
 * ものがたり漢字アドベンチャー — ルビ付きテキストコンポーネント
 * components/ui/RubyText.tsx
 *
 * ★ padding-top方式（案A）+ 青ハイライト＋タップ方式 ★
 *
 * ふりがな表示: padding-top でルビ領域を事前確保し、
 * position:absolute + top:0 でふりがなを漢字真上に配置。
 * これにより親要素のlineHeight影響を排除。
 *
 * 漢字ハイライト: 青色＋下線でタップ可能を示す。
 * タップすると onKanjiTap コールバックが呼ばれる。
 */

"use client";

import React from "react";
import type { RubySegment } from "@/types";

// ============================================================
// Props
// ============================================================

interface RubyTextProps {
  segments: RubySegment[];
  className?: string;
  /** ふりがなを表示するか（デフォルト: true） */
  showFurigana?: boolean;
  /** タップ時のコールバック（漢字セグメントを渡す） */
  onKanjiTap?: (segment: RubySegment) => void;
  /** ハイライト色（ワールドのカラーに合わせる） */
  accentColor?: string;
}

// ============================================================
// コンポーネント
// ============================================================

export function RubyText({
  segments,
  className = "",
  showFurigana = true,
  onKanjiTap,
  accentColor = "#5C6BC0",
}: RubyTextProps) {
  return (
    <span className={className} style={{ display: "inline" }}>
      {segments.map((seg, i) => {
        // ルビなし → 通常テキスト
        if (!seg.ruby) {
          return <span key={i}>{seg.text}</span>;
        }

        // ルビあり → padding-top方式でふりがなを真上に配置 ＋ 青ハイライト（タップ可能）
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              position: "relative",
              paddingTop: "1.2em",   // ふりがな用スペースを事前確保
              lineHeight: 1,         // 親のlineHeight継承を遮断
              verticalAlign: "bottom",
            }}
          >
            {/* ふりがな（padding領域内の top:0 に配置） */}
            <span
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "0.5em",
                lineHeight: 1,
                color: accentColor,
                fontWeight: 500,
                whiteSpace: "nowrap",
                visibility: showFurigana ? "visible" : "hidden",
              }}
            >
              {seg.ruby}
            </span>
            {/* 漢字本体（青ハイライト＋タップ） */}
            <span
              role={onKanjiTap ? "button" : undefined}
              tabIndex={onKanjiTap ? 0 : undefined}
              onClick={() => onKanjiTap?.(seg)}
              onKeyDown={(e) => e.key === "Enter" && onKanjiTap?.(seg)}
              style={{
                color: accentColor,
                fontWeight: "bold",
                cursor: onKanjiTap ? "pointer" : "default",
                WebkitTapHighlightColor: "transparent",
                textDecoration: onKanjiTap ? "underline" : "none",
                textDecorationStyle: "dotted",
                textUnderlineOffset: "3px",
                lineHeight: 1,
              }}
            >
              {seg.text}
            </span>
          </span>
        );
      })}
    </span>
  );
}

// ============================================================
// ヘルパー
// ============================================================

export function segmentsToPlainText(segments: RubySegment[]): string {
  return segments.map((seg) => seg.text).join("");
}

export function parseRubyString(input: string): RubySegment[] {
  const segments: RubySegment[] = [];
  const re = /([^《》]+?)《([^《》]+?)》|([^《》]+)/g;
  let match: RegExpExecArray | null;

  while ((match = re.exec(input)) !== null) {
    if (match[1] && match[2]) {
      segments.push({ text: match[1], ruby: match[2] });
    } else if (match[3]) {
      segments.push({ text: match[3] });
    }
  }
  return segments;
}
