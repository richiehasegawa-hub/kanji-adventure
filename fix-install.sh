#!/bin/bash
# node_modules を Mac 用に再インストールするスクリプト
cd "$(dirname "$0")"
echo "📦 node_modules を削除して再インストールします..."
rm -rf node_modules package-lock.json .next
echo "📥 npm install 実行中..."
npm install
echo ""
echo "✅ 完了！次のコマンドで起動してください:"
echo "   npm run dev"
