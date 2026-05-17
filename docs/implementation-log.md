# 実装記録

作成日: 2026-05-17
更新日: 2026-05-17

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/App.tsx`
- `src/App.css`
- `docs/implementation-log.md`

### 実装内容（事実）

- `calculator` 画面の JSX を調整し、`レシピ選択行 → ボタン行 → 分量行` の順序を維持しつつ、ボタン行をレシピ選択ドロップダウン直下に配置した。
- ボタン行は従来どおり等幅（1:1）のままとし、ボタン行と分量行の間には既存の余白（`margin-bottom`）を維持した。
- 説明本文カード（`recipe-description`）に `text-align: left` を追加し、左寄せ表示へ変更した。
- 説明本文の `white-space: pre-wrap` とカード表示（枠線・背景・角丸）は維持した。
- 保存データ構造、`NumberInputModal`、換算計算、材料一覧、`new` / `edit` 画面、各種モーダルの機能には変更を加えていない。

### 学習ポイント（事実）

- 既存の操作ロジックを維持したまま UI の見た目を調整する場合、イベントハンドラは触らず JSX の配置と CSS の責務だけを変更すると安全に差分を限定できる。
- 説明本文の読みやすさは `text-align` のような表示スタイル調整で改善でき、データやレンダリング条件に手を入れず要件を満たせる。

### 確認内容（事実）

- `npm run build` が成功し、TypeScript ビルドと Vite ビルドが通ることを確認した。
- 変更対象が `calculator` 画面の表示部分（`App.tsx` / `App.css`）に限定されていることを確認した。
- レシピ選択、ボタン動作、分量入力、換算計算の既存ロジックに差分がないことを確認した。

### 次にやること（推測）

- 実機幅（320px〜430px）で、ボタン行をドロップダウン直下に置いた導線（選択→作成/編集→分量入力）の操作感を確認する。
- 説明本文が複数行のレシピで、左寄せ表示時の可読性と改行表示のバランスを確認する。

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一ページ構成で、`calculator` / `new` / `edit` を画面モードで切り替える。
- `calculator` 画面は、レシピ選択・操作ボタン・分量入力・材料表示・説明表示の順に表示する。
- 説明文は `description` の生文字列をそのまま表示し、CSS（`text-align: left` + `white-space: pre-wrap`）で左寄せかつ改行を可視化する。
- 数値入力は `NumberInputModal` を使用し、換算値は `targetAmount / baseAmount` の比率で材料ごとに表示する。

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
  1. レシピ選択行
     - `レシピ:` ラベル + ドロップダウン
  2. ボタン行
     - `レシピ新規作成`
     - （レシピ存在時のみ）`レシピ編集`
  3. 分量行（右寄せ）
     - `基準分量: {baseAmount} → 今回の分量 [入力]`
  4. 材料セクション
     - 見出し `材料`
     - 換算済み材料一覧
  5. 説明セクション（`description` が空でない場合のみ）
     - 見出し `{レシピ名}レシピの説明`
     - 本文（改行表示対応）
  - （レシピ0件時）`レシピがありません`
- `new` / `edit` 画面（`RecipeForm` 共通）
  - レシピ名、説明、基準量
  - 材料編集（追加・編集・削除）
- モーダル
  - `IngredientFormModal`
  - `NumberInputModal`
