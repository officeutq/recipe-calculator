# 実装記録

作成日: 2026-05-17
更新日: 2026-05-17

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一画面アプリとして、`calculator` / `new` / `edit` を画面モードで切り替える。
- レシピ作成・編集画面（`RecipeForm`）の材料追加は `IngredientFormModal` で実行する。
- 材料追加モーダルの分量入力は `NumberInputModal` を再利用し、`allowDecimal=true` で入力する。
- レシピ一覧と選択中レシピIDは LocalStorage で永続化する。

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
  - レシピ情報カード
    - `レシピ新規作成`
    - （レシピ存在時のみ）`レシピ編集`
    - （レシピ存在時）レシピ選択ドロップダウン
    - （レシピ存在時）説明
    - （レシピ存在時）基準量
    - （レシピ存在時）作成量入力（数値入力モーダル連携）
    - （レシピ0件時）`レシピがありません`
  - （レシピ存在時）材料換算セクション
- `new` / `edit` 画面（`RecipeForm` 共通）
  - レシピ名、説明、基準量
  - 材料セクション
    - `材料追加` ボタン
    - 材料一覧（材料名・編集・削除）
    - 編集中のみ材料更新フォーム表示
- モーダル
  - `IngredientFormModal`（材料名・分量・単位、保存・キャンセル）
  - `NumberInputModal`（テンキー入力、クリア、キャンセル、決定）

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/components/IngredientFormModal.tsx`
- `src/components/RecipeForm.tsx`
- `src/App.css`
- `docs/implementation-log.md`

### 実装内容（事実）

- 新規コンポーネント `IngredientFormModal` を追加した。
  - props: `open`, `title`, `onClose`, `onSave`
  - 入力項目: 材料名・分量・単位
  - ボタン: 保存・キャンセル
- `IngredientFormModal` の分量入力は通常 input ではなく `NumberInputModal` を利用する構成にした。
  - 分量欄押下で `NumberInputModal` を開く。
  - 決定時にモーダル内の分量へ反映する。
  - `allowDecimal=true` を指定した。
- `RecipeForm` の常時表示の材料追加フォームを削除し、`材料追加` ボタンから `IngredientFormModal` を開く構成へ変更した。
- 追加保存時は既存の `ingredients` 追加ロジック（state 追加）を利用し、キャンセル時は何もしない挙動にした。
- 材料一覧の `編集` / `削除` ボタンは維持した。
  - 編集機能は既存どおりインライン更新フォーム（編集時のみ表示）で維持した。
- モーダル重ね表示に対応するため、`IngredientFormModal` と `NumberInputModal` の z-index を調整した（材料モーダル < 数値モーダル）。

### 学習ポイント（事実）

- 追加処理と編集処理の UI を分離することで、日常操作（追加）を軽くしつつ既存編集機能を壊さずに段階導入しやすい。
- モーダルを重ねる要件では、オーバーレイ同士の z-index を明示すると意図しない前後関係を避けやすい。

### 確認内容（事実）

- `npm run build` が成功し、TypeScript ビルドおよび Vite ビルドが通ることを確認した。
- 画面構成上、`材料追加` ボタン押下で `IngredientFormModal` が開くことをコード上で確認した。
- `IngredientFormModal` の分量欄が `NumberInputModal` を開き、決定時に分量へ反映する実装を確認した。
- 材料一覧の `編集` / `削除` ボタンが維持されていることを確認した。

### 次にやること（推測）

- `IngredientFormModal` の保存バリデーション（空文字・0以下・小数）をコンポーネントテスト化する。
- モーダル二重表示時のキーボード操作とフォーカス制御を改善する。
