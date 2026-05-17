# 実装記録

作成日: 2026-05-17
更新日: 2026-05-17

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/App.tsx`
- `src/App.css`
- `docs/implementation-log.md`

### 実装内容（事実）

- `calculator` 画面の上部表示順を変更し、`レシピ選択行 → ボタン行 → 分量行` の順で表示されるように JSX の配置を調整した。
- `レシピ新規作成` / `レシピ編集` ボタンのロジックは変更せず、表示位置のみをドロップダウン行の下へ移動した。
- 説明本文（`recipe-description`）に `white-space: pre-wrap` を適用し、`description` 文字列を加工せずに改行表示を反映するようにした。
- 保存データ構造、`NumberInputModal`、換算計算、材料一覧、`new` / `edit` 画面、各種モーダルの機能には変更を加えていない。

### 学習ポイント（事実）

- 改行を含むテキスト表示は、データ加工ではなく `white-space` 制御で対応すると要件（保存データ不変更）と実装責務（表示のみ）を両立しやすい。
- UI の表示順変更は、スタイルだけで無理に入れ替えるよりも JSX 構造の並び順を明示的に変更したほうが意図が保守しやすい。

### 確認内容（事実）

- `npm run build` が成功し、TypeScript ビルドと Vite ビルドが通ることを確認した。
- 変更対象が `calculator` 画面の表示部分（`App.tsx` / `App.css`）に限定されていることを確認した。
- レシピ選択、ボタン動作、分量入力、換算計算の既存ロジックに差分がないことを確認した。

### 次にやること（推測）

- 実機幅（320px〜430px）で、表示順変更後の操作導線（選択→作成/編集→分量入力）の体感を確認する。
- 必要であれば、説明文が長文の場合の縦スクロール負荷を軽減する UI 改善を検討する。

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一ページ構成で、`calculator` / `new` / `edit` を画面モードで切り替える。
- `calculator` 画面は、レシピ選択・操作ボタン・分量入力・材料表示・説明表示の順に表示する。
- 説明文は `description` の生文字列をそのまま表示し、CSS (`white-space: pre-wrap`) で改行を可視化する。
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
