# 実装記録

作成日: 2026-05-17

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一画面アプリとして、`calculator` / `new` / `edit` の画面モードで表示を切り替える。
- `RecipeForm` は新規・編集で再利用し、入力値を state 管理して保存処理に渡す。
- 新規保存は `recipes` へ `ingredients: []` のレシピを追加し、追加したレシピを選択状態にして計算画面へ戻る。
- 編集保存は選択中レシピを id で置換更新し、計算画面へ戻る。
- `recipes` / `selectedRecipeId` / `targetServings` / `screenMode` を LocalStorage 同期し、再読み込みで復元する。

## 現在のデータ構造（事実）

```ts
type Ingredient = {
  id: number
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

type ScreenMode = "calculator" | "new" | "edit"

type RecipeFormValues = {
  name: string
  description: string
  baseAmount: string
}
```

主要 state:

- `recipes: Recipe[]`
- `selectedRecipeId: number | null`
- `targetServings: string`
- `screenMode: ScreenMode`
- `RecipeForm` 内部 state (`name` / `description` / `baseAmount`)

## 現在の画面構成（事実）

- ヘッダー
  - アプリ名、説明文
- calculator 画面
  - レシピ情報カード
    - リセット
    - レシピ新規作成（`screenMode = "new"`）
    - レシピ編集（選択時のみ、`screenMode = "edit"`）
    - レシピ選択ドロップダウン
    - 説明表示
    - 基準量表示
    - 作成量入力
  - 材料セクション（換算表示）
- new 画面
  - `RecipeForm`
    - レシピ名 / 説明 / 基準量（state 管理）
    - 保存（新規レシピ追加 + 選択 + calculator に戻る）
    - キャンセル（変更なしで calculator に戻る）
- edit 画面
  - `RecipeForm`
    - 選択中レシピを初期値表示
    - 保存（対象 id のレシピ更新 + calculator に戻る）
    - キャンセル（変更なしで calculator に戻る）

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/App.tsx`
- `src/components/RecipeForm.tsx`
- `docs/implementation-log.md`

### 実装内容（事実）

- `RecipeForm` の `onSave` を引数なしから `RecipeFormValues` を受け取る形に変更した。
- `RecipeForm` に `name` / `description` / `baseAmount` の state を追加し、入力欄を controlled component 化した。
- `initialRecipe` 変更時に入力状態を同期する `useEffect` を追加した。
- 保存時のバリデーション（レシピ名必須・基準量 1 以上）を `alert()` で実装した。
- new 保存で `Date.now()` id の新規レシピを追加し、`selectedRecipeId` を新規 id に更新して `calculator` に遷移するようにした。
- edit 保存で選択中レシピを id で置換更新し、`calculator` に遷移するようにした。
- キャンセルは変更なしで `calculator` に戻る既存仕様を維持した。

### 学習ポイント（事実）

- 再利用フォームは「初期値表示」と「現在入力」の責務を分離し、保存時に必要な最小データだけ親へ渡すと保守しやすい。
- `Recipe` の `baseAmount` を number で持ちつつ、フォーム入力中は string で管理すると入力体験を崩さずに検証できる。

### 確認内容（事実）

- `npm run build` が成功し、型チェックとビルドが通ることを確認した。

### 次にやること（推測）

- 材料追加・削除 UI と保存処理を `RecipeForm` に実装する。
- 数値入力を `NumberInputModal` に置き換える方針を検討する。
