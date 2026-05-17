# 実装記録

作成日: 2026-05-17

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一画面アプリとして、`calculator` / `new` / `edit` の画面モードで表示を切り替える。
- `RecipeForm` は新規・編集で再利用し、レシピ基本情報に加えて材料の追加・削除をフォーム内で完結できる。
- `RecipeForm` の保存時は `name` / `description` / `baseAmount` / `ingredients` をまとめて親へ返し、new/edit ともに同じ値構造で保存する。
- `calculator` 画面の `IngredientList` は換算表示専用のまま維持し、編集操作は持たせていない。
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
  ingredients: Ingredient[]
}
```

主要 state:

- `recipes: Recipe[]`
- `selectedRecipeId: number | null`
- `targetServings: string`
- `screenMode: ScreenMode`
- `RecipeForm` 内部 state
  - レシピ入力: `name` / `description` / `baseAmount`
  - 材料一覧: `ingredients`
  - 材料入力欄: `ingredientName` / `ingredientAmount` / `ingredientUnit`

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
  - 材料セクション（`IngredientList` による換算表示専用）
- new 画面
  - `RecipeForm`
    - レシピ名 / 説明 / 基準量
    - 材料追加欄（材料名 / 分量 / 単位 / 追加）
    - 追加済み材料一覧（各行に削除）
    - 保存（新規レシピ追加 + 選択 + calculator に戻る）
    - キャンセル（変更なしで calculator に戻る）
- edit 画面
  - `RecipeForm`
    - 選択中レシピの初期値表示（基本情報 + 材料一覧）
    - 材料追加・削除
    - 保存（対象 id のレシピ更新 + calculator に戻る）
    - キャンセル（変更なしで calculator に戻る）

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/components/RecipeForm.tsx`
- `src/App.tsx`
- `src/App.css`
- `docs/implementation-log.md`

### 実装内容（事実）

- `RecipeFormValues` を拡張し、`ingredients: Ingredient[]` を追加した。
- `RecipeForm` 内で `ingredients` を state 管理するようにし、初期値を `new` は空配列、`edit` は `initialRecipe.ingredients` とした。
- `initialRecipe` 変更時に `useEffect` で `ingredients` を含むフォーム状態を同期するようにした。
- `RecipeForm` に材料編集セクションを追加し、材料名・分量・単位入力と追加ボタンを実装した。
- 材料追加時バリデーションを追加した（材料名空不可、分量は 0 より大きい、単位空不可）。失敗時は `alert()` を表示する。
- 材料追加時に `{ id: Date.now(), name, amount, unit }` 形式で `ingredients` に追加し、追加後に入力欄をクリアするようにした。
- 追加済み材料一覧に削除ボタンを実装し、押下時に対象材料を即時削除（confirm なし）するようにした。
- `App` 側の new/edit 保存処理で、`ingredients` を含めてレシピ保存するように変更した。
- calculator 画面の `IngredientList` は変更せず、既存の換算表示を維持した。

### 学習ポイント（事実）

- 親子でフォーム値をやり取りする場合、フォーム値型を子コンポーネントから export して共通利用すると整合性が保ちやすい。
- `edit` での再利用フォームは、`props` の初期値注入だけでは不十分で、対象切り替え時の state 同期が必要になる。
- 「編集UI」と「表示専用UI」を分離しておくと、計算ロジックを壊さずに編集機能を追加しやすい。

### 確認内容（事実）

- `npm run build` が成功し、型チェックとビルドが通ることを確認した。
- new/edit で追加した材料が保存後に calculator 画面の換算表示に反映されることを確認した。

### 次にやること（推測）

- 材料の並び替えや編集（更新）機能が必要になった場合の UI 方針を決める。
- 数値入力 UX 改善のため、要件に応じて `NumberInputModal` との統合を将来検討する。
