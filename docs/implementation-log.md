# 実装記録

作成日: 2026-05-17
更新日: 2026-05-17

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一画面アプリとして、`calculator` / `new` / `edit` を画面モードで切り替える。
- レシピ作成・編集画面（`RecipeForm`）では、材料の追加と編集を共通の `IngredientFormModal` で行う。
- `IngredientFormModal` の分量入力は `NumberInputModal` を使い、モーダルを開いたときの表示は常に `0` から始まる。
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
    - 材料一覧（材料名・分量単位・編集・削除）
- モーダル
  - `IngredientFormModal`（追加/編集共通: 材料名・分量・単位、保存・キャンセル）
  - `NumberInputModal`（テンキー入力、クリア、キャンセル、決定）

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/components/IngredientFormModal.tsx`
- `src/components/RecipeForm.tsx`
- `docs/implementation-log.md`

### 実装内容（事実）

- `IngredientFormModal` の props を拡張し、`initialIngredient` を受け取れるようにした。
- `open` または `initialIngredient` が変化したタイミングで入力値を初期化するようにした。
  - 追加モード: 材料名 `""` / 分量 `"0"` / 単位 `""`
  - 編集モード: 既存の材料値
- `RecipeForm` の材料編集をインラインフォームからモーダル編集へ移行した。
  - `isIngredientModalOpen` と `editingIngredientId` を状態として管理する。
  - `editingIngredientId === null` なら新規追加、値があれば該当材料を更新する。
  - 保存・キャンセル後はモーダルを閉じて `editingIngredientId` を `null` に戻す。
  - 削除時に削除対象が編集中IDと一致した場合も、モーダルを閉じてIDをリセットする。
- `NumberInputModal` の「開いたら常に0」仕様は変更していない。

### 学習ポイント（事実）

- 追加と編集のフォームを同一モーダルに統一すると、入力バリデーションとUI挙動を1箇所で管理できる。
- 編集対象IDを親で管理することで、子モーダルは「表示と入力」に責務を絞りやすくなる。

### 確認内容（事実）

- `npm run build` が成功し、TypeScript ビルドと Vite ビルドが通ることを確認した。
- 材料追加ボタンで `IngredientFormModal(title: "材料追加")` が開く実装を確認した。
- 材料編集ボタンで `IngredientFormModal(title: "材料編集", initialIngredient: 対象材料)` が開く実装を確認した。
- インライン更新フォームを削除し、材料一覧表示（材料名 分量単位 [編集] [削除]）を維持したことを確認した。

### 次にやること（推測）

- `IngredientFormModal` の追加モード/編集モード切替と初期化挙動をコンポーネントテスト化する。
- 材料IDの採番戦略（`Date.now()`）を差し替え可能にしてテスト容易性を上げる。
