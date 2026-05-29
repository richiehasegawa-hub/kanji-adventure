@AGENTS.md

# ものがたり漢字アドベンチャー — Claude作業ルール

## プロジェクト情報
- **本番URL**: https://github.com/richiehasegawa-hub/kanji-adventure （Vercel自動デプロイ）
- **対象ユーザー**: 海外在住の日本人児童（5〜8歳）
- **主要ファイル**: `app/page.tsx`（全画面）、`data/worlds.ts`（全コンテンツ）

## 作業ルール
- 作業前にプランを提示し、承認を得てから動く
- 不明な点は推測せず必ず質問する
- ファイルの削除は必ず確認する
- コード変更後は必ず `npx tsc --noEmit` でTypeScriptチェック
- git push はユーザーが手動実行（コマンドを提示する）
- `npm install` はMacのターミナルで実行（このサンドボックスでは実行しない）

## コーディング規約
- 画面に英語を表示しない（ボタン・ラベルはすべてひらがな）
- タップ領域は最小48px（`minHeight: "48px"`）
- ルビは廃止確定。storyText は `漢字（よみ）` 形式のプレーンテキスト
- `options[0]` = 正解（表示時シャッフル）— クイズデータの仕様

## 現在の状態（2026-05-29時点）
STEP1〜STEP4完全動作・進捗管理（LocalStorage）実装済み・Vercel公開済み
次の実装：音声読み上げ（Web Speech API）→ Rikuキャラクター → PWA
