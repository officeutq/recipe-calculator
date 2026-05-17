# 実装記録

作成日: 2026-05-17
更新日: 2026-05-17

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一画面アプリとして、`calculator` / `new` / `edit` を画面モードで切り替える。
- `calculator` 画面はカード風コンテナを使わず、画面幅に近いレイアウトで操作できる。
- `calculator` 画面の表示順は「ボタン行 → レシピ選択行 → 分量行 → 材料 → 説明（空なら非表示）」で構成している。
- レシピ作成・編集画面（`RecipeForm`）では、材料の追加と編集を共通の `IngredientFormModal` で行う。
- レシピ一覧と選択中レシピID、作成量、画面モードは LocalStorage で永続化する。

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
  - ボタン行
    - `レシピ新規作成`
    - （レシピ存在時のみ）`レシピ編集`
  - レシピ選択行
    - `レシピ:` ラベル + ドロップダウン（同一行）
  - 分量行
    - `基準分量: {baseAmount} → 今回の分量 [入力]`
  - 材料セクション
    - 材料一覧（換算表示）
  - 説明セクション（`description` が空でない場合のみ）
    - 見出し: `{レシピ名}レシピの説明`
    - 本文: `description`
  - （レシピ0件時）`レシピがありません`
- `new` / `edit` 画面（`RecipeForm` 共通）
  - レシピ名、説明、基準量
  - 材料セクション
    - `材料追加` ボタン
    - 材料一覧（材料名・分量単位・編集・削除）
- モーダル
  - `IngredientFormModal`（追加/編集共通）
  - `NumberInputModal`（テンキー入力、クリア、キャンセル、決定）

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/App.tsx`
- `src/App.css`
- `docs/implementation-log.md`

### 実装内容（事実）

- `calculator` 画面の「レシピ情報」見出しを削除した。
- `calculator` 画面専用クラス（`recipe-card--calculator`）を追加し、カード風の枠線・角丸・影・中央寄せ狭幅を無効化した。
- レシピ選択を `レシピ:` ラベル + ドロップダウンの1行表示に変更した。
- 分量表示を `基準分量: ... → 今回の分量 [入力]` の1行表示に変更し、「人分」表示は追加していない。
- 説明表示を材料セクションの下へ移動し、`description` が空文字の場合は説明セクション自体を表示しないようにした。
- レシピ選択、作成量入力モーダル（`NumberInputModal`）、換算ロジック、材料一覧ロジックは変更していない。

### 学習ポイント（事実）

- 画面専用クラスを既存コンテナに追加すると、他画面の共通スタイルを壊さずに見た目を切り替えやすい。
- 文言付きの1行レイアウトは、`display: flex` と小さな補助クラスで要件変更に対応しやすい。

### 確認内容（事実）

- `npm run build` が成功し、TypeScript ビルドと Vite ビルドが通ることを確認した。
- `calculator` 画面で指定の並び順（ボタン→選択→分量→材料→説明）になる実装を確認した。
- `description` が空の場合に説明セクションを描画しない条件分岐を実装した。

### 次にやること（推測）

- スマホ実機幅（例: 375px）で余白・折り返しを視覚確認し、必要なら分量行の間隔を微調整する。
- UI変更に対する回帰確認として、`new` / `edit` 画面の見た目確認手順をチェックリスト化する。
