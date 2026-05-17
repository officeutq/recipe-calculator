# 実装記録

作成日: 2026-05-17

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一画面アプリとして、`calculator` / `new` / `edit` を画面モードで切り替える。
- 数値入力モーダル `NumberInputModal` を新規追加し、0〜9・`.`・1文字削除・クリア・キャンセル・決定のみを提供する（計算機能なし）。
- `RecipeForm` の基準量入力は通常キーボード入力を禁止し、押下で `NumberInputModal` を開いて確定値を反映する。
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
    - 作成量入力
  - 材料換算セクション（表示専用）
- new 画面 / edit 画面（`RecipeForm` 共通）
  - レシピ名入力
  - 説明入力
  - 基準量入力（readonly、押下で数値入力モーダル表示）
  - 材料追加欄（材料名 / 分量 / 単位 / 追加）
  - 材料一覧（削除）
  - 保存 / キャンセル
- 数値入力モーダル（`NumberInputModal`）
  - 表示値
  - キーパッド（7-9, 4-6, 1-3, 0, ., ←）
  - クリア / キャンセル / 決定

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/components/NumberInputModal.tsx`
- `src/components/RecipeForm.tsx`
- `src/App.css`
- `docs/implementation-log.md`

### 実装内容（事実）

- `NumberInputModal` を新規実装し、独自数値入力 UI を追加した。
- `allowDecimal` が `false` の場合は `.` 入力を禁止し、ボタンも非活性化するようにした。
- `allowDecimal` が `true` の場合は `.` を1回だけ入力可能にした。
- `←` で末尾1文字削除、`クリア` で空文字化、`キャンセル` で閉じる、`決定` で確定値を返す動作を実装した。
- `RecipeForm` の基準量入力を `readOnly` + `inputMode="none"` に変更し、押下でモーダルを開く仕様に置換した。
- `RecipeForm` では基準量のみ今回置換し、作成量や材料分量入力には手を入れていない。
- モーダル関連スタイルを `App.css` に追加した。

### 学習ポイント（事実）

- 数値入力モーダル側に一時入力 state を持たせると、`キャンセル` 時に親 state を汚さずに確定操作のみ反映できる。
- `allowDecimal` の仕様は「ボタン無効化」と「ロジック側拒否」の二重防御にすると安全性が高い。
- 再利用コンポーネント化する際は、画面固有ロジック（開閉 state 管理）を呼び出し側に寄せると用途拡張しやすい。

### 確認内容（事実）

- `npm run build` が成功し、型チェックと本番ビルドが通ることを確認した。
- 基準量入力欄押下でモーダル表示、決定でフォーム反映、キャンセルで非反映となることを確認した。

### 次にやること（推測）

- 同じ `NumberInputModal` を作成量・材料分量へ段階展開する優先順位を決める。
- モーダルのフォーカス制御やキーボード操作対応（必要なら）を検討する。
