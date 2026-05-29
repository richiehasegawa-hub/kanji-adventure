# 引き継ぎノート — ものがたり漢字アドベンチャー
> 作成日: 2026-05-09（本日の作業終了時点）

---

## プロジェクト概要

**海外在住日本人児童向け漢字学習Webアプリ**（Next.js製）

- 対象: 5〜8歳、海外在住で日本語を学ぶ子ども
- 機能: 物語を読みながら漢字を学ぶ。ふりがな（ルビ）ON/OFF切替、漢字タップで詳細表示
- 開発場所: `~/Desktop/ClaudeCoworkDesktop/kanji-adventure/`
- 起動コマンド: `cd ~/Desktop/ClaudeCoworkDesktop/kanji-adventure && npm run dev`
- 開発サーバー: `http://localhost:3000`（iPhone/iPad: `http://192.168.0.11:3000`）

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 16.2.6 (App Router) |
| React | 19 |
| TypeScript | 5.x |
| スタイル | Tailwind CSS v4（`@theme` ベース、tailwind.config.tsなし） |
| 状態管理 | Zustand v5 + persist（LocalStorage） |
| フォント | Noto Sans JP / Noto Serif JP（Google Fonts） |
| アニメーション | Framer Motion, Lottie-web（インストール済み、未使用） |

---

## 本日完了したこと

- [x] Next.jsプロジェクト初期セットアップ
- [x] TypeScript型定義（`types/index.ts`）
- [x] Zustandストア（`stores/settingsStore.ts`、`stores/progressStore.ts`）
- [x] `components/ui/RubyText.tsx`（ふりがなコンポーネント）の骨格実装
- [x] `app/test-ruby/page.tsx`（動作確認ページ）の作成
- [x] iPhone/iPadからのLANアクセス対応（`allowedDevOrigins`設定）
- [x] Zustand SSR hydration mismatch 対応（`mounted` stateパターン）
- [x] `<ruby>/<rt>` → `position:absolute` 方式への切り替え（iOS Safari対応）
- [x] 漢字タップ機能（動作確認済み）
- [x] ふりがなON/OFFボタン（動作確認済み）

---

## 未解決の問題（最優先で対応が必要）

### ふりがなの位置ずれ（P0バグ）

**症状**: ふりがなが対応する漢字の真上に表示されない。行によってずれる。

**現象の詳細**:
- ふりがなは表示される（visibility は機能している）
- 特定の漢字のふりがなが別の行に表示されたり、間隔が不均一になる

**根本原因（判明済み）**:
```
親 <p> の lineHeight（例: 2.5）が inline-block wrapper に継承される
→ wrapper の高さ = fontSize × lineHeight（例: 26px × 2.5 = 65px）になる
→ bottom:100% が 65px 上を指してしまいずれる

正しい計算: wrapper に lineHeight:1 を設定 → 高さ = 26px → bottom:100% = 26px上 = 漢字の真上
```

**これまでの試み**:

| 試行 | 結果 |
|------|------|
| `position:absolute` + `bottom:100%`（lineHeightリセットなし） | ふりがなが行の遥か上に表示 |
| `display:inline-flex` + `flex-direction:column-reverse` | テキストの折り返しが崩れる（inline-flexはブロック的な振る舞いをする） |
| `<ruby>/<rt>` + `display:ruby-text` | iOS Safari で未表示（display:ruby-textはWebKitで未サポート） |
| `<ruby>/<rt>` + `display:revert` | ふりがな完全非表示（Tailwind v4がrtをリセットしている模様） |
| `position:absolute` + `lineHeight:1` + `verticalAlign:bottom` | まだズレが残る |
| `position:absolute` + `lineHeight:1` + `verticalAlign:baseline`（最新・未検証） | 本日時点で未確認 |

**次回試すべきアプローチ**:

**案A（推奨）: `padding-top` 方式**
```tsx
// wrapperにpadding-topでふりがなスペースを事前確保
const wrapperStyle = {
  display: "inline-block",
  position: "relative",
  paddingTop: "1.2em",   // ふりがな用スペース
  lineHeight: 1,
  verticalAlign: "bottom",
};
// ふりがなはpadding領域内（top:0）に配置
const furiganaStyle = {
  position: "absolute",
  top: 0,
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "0.65em",
  ...
};
// 段落のlineHeightは1.6程度に設定（paddingが行間を確保するため）
```

**案B: CSSの `ruby-align` + `display:inline-table` トリック**
```css
ruby {
  display: inline-table;
  text-align: center;
}
rt {
  display: table-header-group;
  font-size: 0.65em;
  color: #5C6BC0;
}
```

**案C: Tailwind Preflight を完全無効化して `<ruby>/<rt>` を使う**
```css
/* globals.css の先頭を変更 */
@import "tailwindcss/utilities";  /* preflight を除外 */
/* → ruby/rt のUA stylesheetが生きて native ruby が動く可能性 */
```

---

## 現在のファイル構成（重要ファイルのみ）

```
kanji-adventure/
├── app/
│   ├── layout.tsx          # Noto Sans/Serif JP フォント設定、lang="ja"
│   ├── globals.css         # Tailwind v4 @theme、カラー変数
│   ├── page.tsx            # トップページ（未実装、プレースホルダー）
│   └── test-ruby/
│       └── page.tsx        # ★ ふりがな動作確認ページ（開発中）
├── components/
│   └── ui/
│       └── RubyText.tsx    # ★ ふりがなコンポーネント（未完成・位置ずれ）
├── stores/
│   ├── settingsStore.ts    # ふりがなON/OFF（Zustand persist）
│   └── progressStore.ts    # 学習進捗（Zustand persist）
├── types/
│   └── index.ts            # 型定義（RubySegment, Kanji, Episode等）
└── next.config.ts          # allowedDevOrigins: ["192.168.0.11"]
```

---

## RubyText.tsx 現在の実装（本日時点）

```tsx
// position:absolute 方式
const wrapperStyle = {
  position: "relative",
  display: "inline-block",
  lineHeight: 1,           // 追加済み（未検証）
};
const furiganaStyle = {
  position: "absolute",
  bottom: "100%",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "0.65em",      // 26px × 0.65 ≈ 17px
  color: "#5C6BC0",
  fontWeight: 500,
  visibility: showFurigana ? "visible" : "hidden",
};
```

test-ruby/page.tsx の段落スタイル:
```tsx
<p style={{ lineHeight: "2.5", paddingTop: "1em", marginBottom: "24px" }}>
```

---

## 次回作業の優先順位

1. **P0: ふりがな位置ずれ修正**（上記「案A〜C」を順に試す）
2. **P1: 本番ページ実装開始**
   - `AppHeader`（ふりがなON/OFFボタン付き）
   - `ProgressBar`（ステップ進捗）
   - `FooterNav`（前へ/次へボタン）
3. **P1: Step1 物語ページ**（EP1テキスト＋RubyText表示）
4. **P1: Step2 漢字カードページ**（フラッシュカード形式）

---

## 開発環境メモ

- Macの開発機IPアドレス: `192.168.0.11`（iPhoneからのアクセス用）
- npm run dev後、iPhone/iPadで `http://192.168.0.11:3000/test-ruby` にアクセスして確認
- Tailwind v4はCSS変数ベース（`@theme inline {}`）で設定。tailwind.config.tsは存在しない
- `npm install` は必ずMacのターミナルで実行（Linuxサンドボックスで実行すると darwin-arm64 バイナリエラーが出る）
