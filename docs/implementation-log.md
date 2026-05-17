# 実装記録

作成日: 2026-05-17
更新日: 2026-05-17

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/components/RecipeForm.tsx`
- `src/App.css`
- `docs/implementation-log.md`

### 実装内容（事実）

- `new/edit` 画面の `RecipeForm` 上部入力欄を、ラベル + 入力欄の1行レイアウトに統一した。
- レシピ名行を `レシピ名:` + テキスト入力の inline 構成へ変更し、既存の `name` state 更新と保存処理フローを維持した。
- 説明行を `説明:` + `textarea` の inline 構成へ変更し、複数行入力・改行可能な挙動と既存の `description` state / 保存処理を維持した。
- 基準分量行は `基準分量:` + 入力欄の1行表示を維持しつつ、レシピ名行と同系統の inline クラス構成にそろえた。
- `NumberInputModal` 連携（読み取り専用 input 押下でモーダル表示、確定値反映）は変更していない。
- `App.css` に `RecipeForm` 用の inline 補助スタイルを追加し、説明行のみラベルを上寄せできるようにした。
- 追加スタイルは `recipe-form-inline-field` 経由で適用し、`calculator` 画面の既存レイアウトへ影響しないようにした。

### 学習ポイント（事実）

- 共通クラス（`field--inline`）をベースに、画面限定クラスを重ねると、再利用性を保ちながら影響範囲を安全に限定できる。
- `textarea` を含む行は `align-items: flex-start` を局所適用することで、ラベルを自然に上端揃えできる。

### 確認内容（事実）

- `npm run build` を実行し、TypeScript コンパイルおよび Vite ビルド成功を確認した。
- 変更対象が `RecipeForm` とそのスタイルに限定され、`IngredientFormModal` / `NumberInputModal` / LocalStorage 処理に差分がないことを確認した。
- `calculator` 画面専用クラス（例: `.recipe-select-field`, `.servings-row`）には差分がないことを確認した。

### 次にやること（推測）

- 実機幅（特に 320px〜390px）で、レシピ名行・説明行の折り返し時視認性を目視確認する。
- 必要であればラベル幅や入力最小幅を微調整し、長文ラベル追加時にも崩れにくい設計に拡張する。

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一ページ構成。
- 画面モード切替で `calculator` / `new` / `edit` を表示。
- `new/edit` の `RecipeForm` は、上部入力欄（レシピ名・説明・基準分量）をラベル + 入力の inline ベースで表示し、材料編集セクションと保存操作を提供する。
- 数値入力は `NumberInputModal`、材料追加/編集は `IngredientFormModal` を利用する。

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

## 現在の画面構成（事実）

- ヘッダー
  - アプリラベル
  - タイトル
  - 説明文
- `calculator` 画面
  - レシピ選択
  - 新規作成/編集ボタン
  - 基準分量と今回の分量入力
  - 材料一覧（換算結果）
  - 説明表示
- `new` / `edit` 画面（`RecipeForm`）
  - レシピ名行（`レシピ名:` + 入力欄）
  - 説明行（`説明:` + `textarea`）
  - 基準分量行（`基準分量:` + 入力欄、`NumberInputModal` 起点）
  - 材料見出し行（`材料` + `材料追加`）
  - 材料一覧（編集/削除アイコン）
  - 保存/キャンセル（編集時は削除も表示）
- モーダル
  - `IngredientFormModal`
  - `NumberInputModal`
