# 実装記録

作成日: 2026-05-17
更新日: 2026-05-17

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一画面アプリとして、`calculator` / `new` / `edit` を画面モードで切り替える。
- `recipes` / `selectedRecipeId` / `targetServings` / `screenMode` を LocalStorage 同期し、再読み込み後に復元する。
- `calculator` 画面ではレシピの換算表示のみを行い、レシピ全体のリセット機能は持たない。
- レシピ削除は `edit` 画面の `RecipeForm` から実行し、確認ダイアログ後に対象レシピのみ削除する。
- 削除後は `calculator` に戻り、残件があれば先頭レシピを選択、0件なら `selectedRecipeId` を `null` にする。

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
  - アプリ名、説明文
- `calculator` 画面
  - レシピ情報カード
    - レシピ新規作成
    - レシピ編集
    - レシピ選択
    - 説明表示
    - 基準量表示
    - 作成量入力（readonly、押下で数値入力モーダル表示）
  - 材料換算セクション（表示専用）
- `new` / `edit` 画面（`RecipeForm` 共通）
  - レシピ名入力
  - 説明入力
  - 基準量入力（readonly、押下で数値入力モーダル表示）
  - 材料追加欄（材料名 / 分量[readonly + モーダル] / 単位 / 追加）
  - 材料一覧（削除）
  - 操作ボタン
    - `new`: 保存 / キャンセル
    - `edit`: 保存 / キャンセル / 削除
- 数値入力モーダル（`NumberInputModal`）

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/App.tsx`
- `src/components/RecipeForm.tsx`
- `src/App.css`
- `docs/implementation-log.md`

### 実装内容（事実）

- `calculator` 画面からリセットボタンを削除し、関連イベント（全レシピ初期化処理）を削除した。
- `RecipeForm` に `onDelete` を任意 props として追加し、指定時のみ削除ボタンを表示するようにした。
- `edit` 画面で `onDelete` を渡し、`new` 画面では渡さないことで、削除ボタン表示条件を満たした。
- 削除時に `window.confirm("このレシピを削除しますか？")` を実行し、OK の場合のみ対象レシピを削除するようにした。
- 削除後は `screenMode` を `calculator` に戻し、`selectedRecipeId` を残件先頭 or `null` に更新するようにした。

### 学習ポイント（事実）

- フォーム再利用時は「任意 props + 条件描画」にすると、`new` と `edit` の差分要件を局所化できる。
- 削除後の選択状態遷移を明示すると、UI と LocalStorage の整合を維持しやすい。

### 確認内容（事実）

- `npm run build` が成功し、TypeScript ビルドおよび Vite ビルドが通ることを確認した。
- `new` 画面では削除ボタンが表示されず、`edit` 画面でのみ表示されることを確認した（コード上）。
- 削除確定時の遷移・選択更新ルールが実装されていることを確認した（コード上）。

### 次にやること（推測）

- プレースホルダ運用の見直し（別 Issue）に着手する。
- 必要に応じて削除フローの E2E テストを追加し、誤操作防止仕様を自動確認できるようにする。
