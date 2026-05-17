# 実装記録

作成日: 2026-05-17
更新日: 2026-05-17

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/components/RecipeForm.tsx`
- `src/App.css`
- `docs/implementation-log.md`

### 実装内容（事実）

- `new/edit` 画面の `RecipeForm` に、単一行表示専用クラス `recipe-form-inline-field--single` を追加した。
- レシピ名行と基準分量行に `recipe-form-inline-field--single` を適用し、`flex-wrap: nowrap` でラベルと入力欄が同一行に収まるようにした。
- 単一行フィールドのラベルに `flex: 0 0 auto` と `white-space: nowrap` を適用し、ラベル折り返しを防止した。
- 入力欄側に `flex: 1 1 auto` と `min-width: 0` を適用し、狭い幅でも入力欄が行内で縮小できるようにした。
- 説明行は既存方針のまま維持し、ラベル上寄せと `textarea` 複数行入力を継続した。
- `RecipeForm` 以外（保存処理・state 構造・`NumberInputModal`・`IngredientFormModal`・calculator 画面・LocalStorage・材料一覧）には変更を加えていない。

### 学習ポイント（事実）

- スマホ幅で 1 行維持したいフィールドは、`nowrap` と「ラベル固定 + 入力可変」の組み合わせが有効。
- `flex` 子要素に `min-width: 0` を与えると、入力欄の不要なはみ出しや改行落ちを抑制できる。

### 確認内容（事実）

- `npm run build` を実行し、ビルドが成功することを確認した。
- 差分が `RecipeForm` のレイアウト関連に限定され、対象外機能に変更がないことを確認した。

### 次にやること（推測）

- 実機幅（320px〜390px）で new/edit 画面を目視確認し、フォントサイズや文言変更時でも 1 行表示が維持されるか確認する。

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一ページ構成。
- `calculator` / `new` / `edit` を画面モード切替で表示。
- `RecipeForm` の上部入力欄は、レシピ名・基準分量を 1 行の inline 入力、説明を複数行 `textarea` として表示。
- 数値入力は `NumberInputModal`、材料追加/編集は `IngredientFormModal` を使用。

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
  - レシピ名行（1 行: `レシピ名:` + 入力欄）
  - 説明行（`説明:` + `textarea`、複数行）
  - 基準分量行（1 行: `基準分量:` + 入力欄、`NumberInputModal` 起点）
  - 材料見出し行（`材料` + `材料追加`）
  - 材料一覧（編集/削除）
  - 保存/キャンセル（編集時は削除も表示）
- モーダル
  - `IngredientFormModal`
  - `NumberInputModal`
