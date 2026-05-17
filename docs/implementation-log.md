# 実装記録

作成日: 2026-05-17

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一画面アプリとして、`calculator` / `new` / `edit` を画面モードで切り替える。
- 数値入力は `NumberInputModal` を再利用し、基準量・作成量・材料分量の入力で統一した。
- `allowDecimal=false`（基準量・作成量）は整数のみ、`allowDecimal=true`（材料分量）は小数点1つまで入力可能。
- `RecipeForm` は新規・編集で再利用し、レシピ情報と材料追加/削除を同一フォームで扱う。
- `calculator` 画面の換算表示は `IngredientList` が担当し、編集操作は持たない。
- `recipes` / `selectedRecipeId` / `targetServings` / `screenMode` を LocalStorage 同期し、再読み込み後に復元する。

## 現在のデータ構造（事実）

```ts
type NumberInputModalProps = {
  open: boolean
  value: string
  allowDecimal?: boolean
  onClose: () => void
  onConfirm: (value: string) => void
}

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

## 現在の画面構成（事実）

- ヘッダー
  - アプリ名、説明文
- calculator 画面
  - レシピ情報カード
    - リセット
    - レシピ新規作成
    - レシピ編集
    - レシピ選択
    - 説明表示
    - 基準量表示
    - 作成量入力（readonly、押下で数値入力モーダル表示）
  - 材料換算セクション（表示専用）
- new 画面 / edit 画面（`RecipeForm` 共通）
  - レシピ名入力
  - 説明入力
  - 基準量入力（readonly、押下で数値入力モーダル表示）
  - 材料追加欄（材料名 / 分量[readonly + モーダル] / 単位 / 追加）
  - 材料一覧（削除）
  - 保存 / キャンセル
- 数値入力モーダル（`NumberInputModal`）
  - 表示値
  - キーパッド（7-9, 4-6, 1-3, 0, ., ←）
  - クリア / キャンセル / 決定

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/App.tsx`
- `src/components/RecipeForm.tsx`
- `docs/implementation-log.md`

### 実装内容（事実）

- `calculator` 画面の作成量入力を `readOnly` + `inputMode="none"` に変更し、押下で `NumberInputModal` を開くようにした。
- 作成量モーダルは `allowDecimal={false}` とし、決定時に `targetServings` を更新して閉じるようにした。
- `RecipeForm` の材料追加欄の分量入力を `readOnly` + `inputMode="none"` に変更し、押下で `NumberInputModal` を開くようにした。
- 材料分量モーダルは `allowDecimal` を有効にし、決定時に `ingredientAmount` を更新して閉じるようにした。
- 既存 `NumberInputModal` の小数点入力制御（小数点1つまで）をそのまま再利用し、モーダルのコピー増殖はしていない。
- placeholder は作成量「作成量」、材料分量「分量」を維持した。

### 学習ポイント（事実）

- 既存の汎用モーダルに `allowDecimal` を使い分けるだけで、整数専用・小数許可の入力要件を同時に満たせる。
- `readOnly` 入力 + モーダル起動に寄せると、画面内の入力 UX を統一しつつバリデーション前提も揃えやすい。
- 開閉 state を入力ごとに分離し、`onConfirm` で更新とクローズを同時に処理すると差分を小さく保てる。

### 確認内容（事実）

- `npm run build` が成功し、型チェックと本番ビルドが通ることを確認した。
- 作成量入力欄押下でモーダル表示、決定で `targetServings` 更新、キャンセルで非反映となることを確認した。
- 材料分量入力欄押下でモーダル表示、`allowDecimal=true` で小数点が1つまで入力できることを確認した。

### 次にやること（推測）

- 数値入力モーダルの開閉処理を小さなカスタムフックにまとめるかを検討する（大規模リファクタリングは行わない）。
- モーダルのアクセシビリティ改善（フォーカス管理など）を別タスクで段階対応する。
