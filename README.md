# ものがたり漢字アドベンチャー

海外在住の日本人児童（5〜8歳）向け 漢字学習Webアプリ

## 公開URL

- **Vercel（本番）**: https://kanji-adventure-richiehasegawa-hub.vercel.app （※Vercelが発行したURLに更新してください）
- **GitHubリポジトリ**: https://github.com/richiehasegawa-hub/kanji-adventure

## 機能概要

- **STEP1** ものがたり — 漢字入りのお話を読む
- **STEP2** 漢字カード — 読み・例文・おぼえかたを確認
- **STEP3** クイズ — 4択問題（シャッフル・正誤フィードバック）
- **STEP4** 手書き練習 — Canvas + Pointer Events（タッチ・ペン・マウス対応）
- 進捗管理 — LocalStorage（Zustand persist）でエピソード完了を保存・バッジ表示
- 全3ワールド・9エピソード・48漢字・27問

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 16.2.6 (App Router) |
| React | 19 |
| TypeScript | 5.x |
| スタイル | Tailwind CSS v4（@theme ベース） |
| 状態管理 | Zustand v5 + persist（LocalStorage） |
| ホスティング | Vercel（mainブランチへのpushで自動デプロイ） |

## 開発環境

```bash
cd ~/Desktop/ClaudeDesktop/Projects/kanji-adventure
npm run dev
# → http://localhost:3000
# → http://192.168.0.11:3000（iPhone/iPad — 同一WiFi）
```

## TypeScriptチェック・デプロイ

```bash
# TypeScriptチェック
npx tsc --noEmit

# デプロイ（mainにpushすると自動デプロイ）
git add -A
git commit -m "コミットメッセージ"
git push
```

## 主要ファイル

```
app/
  page.tsx          ★ メイン画面（全5画面コンポーネント）
data/
  worlds.ts         ★ 全コンテンツデータ（3ワールド・9EP・48字・27問）
stores/
  progressStore.ts  学習進捗（Zustand persist・LocalStorage）
  settingsStore.ts  設定（Zustand persist）
types/
  index.ts          型定義
```

## 注意事項

- `npm install` はMacのターミナルで実行
- ルビは廃止確定。storyText は `漢字（よみ）` 形式のプレーンテキスト
- 画面上に英語を表示しない。ボタン・ラベルはすべてひらがな
- git push はユーザーが手動実行
