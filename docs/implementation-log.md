# 実装記録

作成日: 2026-05-17
更新日: 2026-05-17

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一画面アプリとして、`calculator` / `new` / `edit` を画面モードで切り替える。
- レシピ一覧と選択中レシピIDは LocalStorage で永続化する。
- レシピ選択ドロップダウンはプレースホルダを持たず、レシピが存在する場合は常に有効なレシピIDを選択状態に保つ。
- `calculator` 画面でレシピ0件時は空状態メッセージと新規作成導線のみ表示し、説明・基準量・作成量・材料一覧は表示しない。
- 新規保存後は追加したレシピを選択状態にし、既存仕様を維持する。

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
- 主要な永続化キー
  - `recipe-calculator:recipes`
  - `recipe-calculator:selected-recipe-id`
  - `recipe-calculator:target-servings`
  - `recipe-calculator:screen-mode`

## 現在の画面構成（事実）

- ヘッダー
  - アプリ名、説明文
- `calculator` 画面
  - レシピ情報カード
    - `レシピ新規作成`
    - （レシピ存在時のみ）`レシピ編集`
    - （レシピ存在時）レシピ選択ドロップダウン
    - （レシピ存在時）説明
    - （レシピ存在時）基準量
    - （レシピ存在時）作成量入力（数値入力モーダル連携）
    - （レシピ0件時）`レシピがありません`
  - （レシピ存在時）材料換算セクション
- `new` / `edit` 画面（`RecipeForm` 共通）
  - レシピ名、説明、基準量、材料編集、保存系操作
- 数値入力モーダル（`NumberInputModal`）

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/App.tsx`
- `src/App.css`
- `docs/implementation-log.md`

### 実装内容（事実）

- レシピ選択ドロップダウンのプレースホルダ（`レシピ名`）を削除した。
- `recipes` の件数と `selectedRecipeId` の整合を `useEffect` で正規化するようにした。
  - `recipes.length === 0` では `selectedRecipeId` を `null` に統一。
  - `recipes.length > 0` で `selectedRecipeId` が `null` または不正IDなら `recipes[0].id` を自動選択。
- レシピ削除時の既存仕様（残件あり: 先頭選択 / 0件: `null`）を維持した。
- `calculator` 画面で0件時UIを追加し、説明・基準量・作成量・材料一覧を非表示化した。
- 新規追加後に追加レシピを選択する既存仕様は維持した。

### 学習ポイント（事実）

- LocalStorage 復元値をそのまま信頼せず、配列実体（`recipes`）と照合して選択IDを正規化すると、null状態を最小化できる。
- 空状態UIは「表示しない要素」を明示的に分岐すると要件逸脱を防ぎやすい。

### 確認内容（事実）

- `npm run build` が成功し、TypeScript ビルドおよび Vite ビルドが通ることを確認した。
- コード上で以下を確認した。
  - レシピ存在時にプレースホルダ無しドロップダウン表示。
  - 起動時の選択ID正規化（null/不正ID→先頭ID）。
  - 0件時メッセージ表示と計算関連UI非表示。
  - 新規保存後の追加レシピ選択維持。

### 次にやること（推測）

- 0件状態→新規作成→保存→calculator復帰までの手動E2Eチェックリストを作成する。
- 将来の Router/API 移行に備えて、レシピ選択正規化ロジックをカスタムフック化する。
