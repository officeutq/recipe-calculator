# 実装記録

作成日: 2026-05-17

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一画面アプリとして、レシピ選択と作成量入力による材料換算表示を行う。
- 計算画面は「選択専用 + 表示専用」を優先し、材料編集操作は持たない。
- `recipes` / `selectedRecipeId` / `targetServings` を `localStorage` と同期し、再読み込み後に復元する。

## 現在のデータ構造（事実）

```ts
type Ingredient = {
  id: number
  name: string
  amount: number
  unit: string
}

type NewIngredient = {
  name: string
  amount: number
  unit: string
}

type Recipe = {
  id: number
  name: string
  description: string
  baseAmount: number
  ingredients: Ingredient[]
}
```

主要 state:

- `recipes: Recipe[]`
- `selectedRecipeId: number | null`
- `targetServings: string`

導出値:

- `selectedRecipe`
- `baseServingsNumber`
- `ingredients`
- `scale`

## 現在の画面構成（事実）

- ヘッダー
  - アプリ名、説明文
- レシピ情報カード
  - リセットボタン
  - レシピ新規作成ボタン（仮実装: `console.log("new")`）
  - レシピ編集ボタン（`selectedRecipeId` がある時のみ表示、仮実装: `console.log("edit")`）
  - レシピ選択ドロップダウン（先頭プレースホルダ: 「レシピ名」）
  - 選択レシピ説明（未選択時は非表示）
  - 基準量の表示専用テキスト
  - 作成量入力（placeholder: 「作成量」）
- 材料セクション
  - 換算表示専用の材料一覧（元分量 → 換算後分量）

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/App.tsx`
- `src/components/IngredientList.tsx`
- `src/App.css`
- `docs/implementation-log.md`

### 実装内容（事実）

- レシピ名テキスト入力を削除し、`recipes` を選択肢に使うドロップダウンへ変更した。
- ドロップダウン先頭にプレースホルダ「レシピ名」を追加し、変更時に `selectedRecipeId` を更新するようにした。
- 選択中レシピの `description` を表示し、未選択時は非表示にした。
- 基準量入力を削除し、「基準量: {baseAmount}」の表示専用にした。
- 作成量入力のラベルを削除し、placeholder を「作成量」に変更した。
- 入力内容カード（`preview-section`）を削除した。
- `IngredientForm` を非表示化（画面から除去）し、材料欄を換算表示専用にした。
- `IngredientList` から削除ボタンを除去し、表示専用コンポーネントへ変更した。
- 「レシピ新規作成」「レシピ編集」ボタンを追加し、仮実装として `console.log` を設定した。

### 学習ポイント（事実）

- 計算画面を表示専用へ寄せるときは、既存の換算ロジック（`scale` 計算）を残しつつ入力・編集 UI の責務だけを段階的に外すと安全に移行できる。
- `selectedRecipeId` を `null` 許容にすると、未選択状態をドロップダウンのプレースホルダで自然に表現できる。

### 確認内容（事実）

- `npm run build` が成功し、型チェックとビルドが通ることを確認した。

### 次にやること（推測）

- レシピ新規作成画面を追加し、ボタンの遷移先を接続する。
- レシピ編集画面を追加し、材料編集機能を計算画面外へ分離する。
- 数値入力改善（モーダル化）と表示桁数ルールを導入する。
