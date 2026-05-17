# 実装記録

作成日: 2026-05-17
更新日: 2026-05-17

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/App.tsx`
- `docs/implementation-log.md`

### 実装内容（事実）

- `calculator` 画面でレシピが0件のとき、空状態メッセージ `レシピがありません` の下に `レシピ新規作成` ボタンを表示するように変更した。
- 0件時の新規作成ボタン押下は既存と同じ `setScreenMode("new")` を利用する。
- 0件時は従来どおりレシピ選択ドロップダウン、`レシピ編集` ボタン、分量行、材料セクション、説明セクションを表示しない構成を維持した。
- 1件以上ある通常時の表示順（レシピ選択行→ボタン行→分量行→材料→説明）と既存ロジックは変更していない。

### 学習ポイント（事実）

- 条件分岐の `else` 側に既存コンポーネント（ボタン行クラス）を再利用して追加することで、スタイル差分を最小化しつつ導線を復元できる。
- 画面モード遷移を既存ハンドラ（`setScreenMode`）へ寄せると、`new/edit` 側への影響を避けた安全なUI修正になる。

### 確認内容（事実）

- `npm run build` が成功し、TypeScriptビルドとViteビルドが通ることを確認した。
- 差分が `calculator` 画面の0件時UI表示に限定され、レシピ選択ロジック・LocalStorage・換算処理に影響がないことを確認した。

### 次にやること（推測）

- 実ブラウザでレシピを全削除した状態を再現し、0件時に `レシピ新規作成` ボタンが常に表示されることを目視確認する。
- スマホ幅で空状態メッセージとボタンの縦並び余白を確認し、必要なら微調整する。

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一ページ構成で、`calculator` / `new` / `edit` を `screenMode` で切り替える。
- `calculator` 画面はレシピ存在有無で表示を分岐する。
  - 1件以上: レシピ選択、操作ボタン、分量入力、材料、説明を表示。
  - 0件: `レシピがありません` と `レシピ新規作成` ボタンを表示。
- 新規作成導線は通常時・0件時ともに `setScreenMode("new")` を使用する。

## 現在のデータ構造（事実）

- `Recipe`
  - `id: number`
  - `name: string`
  - `description: string`
  - `baseAmount: number`
  - `ingredients: Ingredient[]`
- `Ingredient`
  - `id: number`
  - `name: string`
  - `amount: number`
  - `unit: string`
- LocalStorage キー
  - `recipe-calculator:recipes`
  - `recipe-calculator:selected-recipe-id`
  - `recipe-calculator:target-servings`
  - `recipe-calculator:screen-mode`

## 現在の画面構成（事実）

- ヘッダー
  - アプリラベル
  - タイトル
  - 説明文
- `calculator` 画面
  - レシピ1件以上の場合
    1. レシピ選択行
    2. ボタン行（新規作成 / 編集）
    3. 分量行
    4. 材料セクション
    5. 説明セクション（説明文がある場合）
  - レシピ0件の場合
    1. `レシピがありません`
    2. ボタン行（`レシピ新規作成` のみ）
- `new` / `edit` 画面（`RecipeForm`）
  - レシピ名、説明、基準量、材料編集
- モーダル
  - `IngredientFormModal`
  - `NumberInputModal`
