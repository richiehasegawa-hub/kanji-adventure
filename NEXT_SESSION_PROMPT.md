# 次回セッション開始プロンプト

---

## 貼り付け用プロンプト（新規チャットの最初のメッセージにそのまま使用）

---

「ものがたり漢字アドベンチャー」というNext.js製漢字学習Webアプリの開発を続けています。

**プロジェクト場所**: `~/Desktop/ClaudeCoworkDesktop/kanji-adventure/`

まず以下のファイルを読んで現状を把握してください：
1. `HANDOVER_NOTE.md`（本日の作業まとめと未解決問題の詳細）
2. `components/ui/RubyText.tsx`（ふりがなコンポーネント）
3. `app/test-ruby/page.tsx`（動作確認ページ）

---

**今日の最優先タスク: ふりがな（ルビ）の位置ずれを修正する**

症状: ふりがなが対応する漢字の真上に表示されない。

引き継ぎノートに試した方法と次に試すべき案（A〜C）が記載されています。案Aの「padding-top方式」から試してください。

修正後は `http://192.168.0.11:3000/test-ruby` でiPhone/iPadから確認します。

---

**開発サーバーの起動**（ユーザー側のMacターミナルで実行）:
```
cd ~/Desktop/ClaudeCoworkDesktop/kanji-adventure && npm run dev
```

---

**技術スタック**:
- Next.js 16.2.6 (App Router) + React 19 + TypeScript
- Tailwind CSS v4（tailwind.config.tsなし、`@theme`ベース）
- Zustand v5 + persist

---

**注意事項**:
- `npm install` はMacのターミナルで実行（Claude側のLinuxサンドボックスでは実行しない）
- コード変更はClaudeがファイルを直接編集可能（ホットリロードで即反映）
- 作業前にプランを提示し、承認を得てから実行すること
