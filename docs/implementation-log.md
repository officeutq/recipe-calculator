# 実装記録

作成日: 2026-05-17
更新日: 2026-05-17

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/App.css`
- `docs/implementation-log.md`

### 実装内容（事実）

- `calculator` 画面のボタン行で、`レシピ新規作成` と `レシピ編集` の2ボタンが横並びのまま 1:1 幅で親幅いっぱいに広がるように調整した。
- `calculator` 画面の分量行を右寄せにし、`基準分量: {baseAmount} → 今回の分量 [入力]` の1行表示を維持した。
- 説明セクションの見出しを左寄せに変更し、材料見出しと同等の文字サイズ・太さへ統一した。
- 説明本文を材料行に近いカード表現（白背景・枠線・角丸・padding）へ変更した。
- レシピ選択、作成量入力（`NumberInputModal`）、換算計算、材料一覧ロジック、`new` / `edit` / モーダル類の機能には変更を加えていない。

### 学習ポイント（事実）

- 画面固有のクラス配下で flex と見出しスタイルを調整すると、他画面へ影響を出さずに UI 微調整しやすい。
- テキストブロックをカード化する際は、既存の材料行スタイル（border / radius / spacing）に寄せると画面の統一感が出る。

### 確認内容（事実）

- `npm run build` が成功し、TypeScript ビルドと Vite ビルドが通ることを確認した。
- `calculator` 画面のみを対象にしたスタイル変更であることを、変更箇所が `src/App.css` の calculator 表示関連クラスに限定されていることで確認した。

### 次にやること（推測）

- 375px 前後のスマホ幅で、分量行の右寄せ表示が窮屈にならないかを実機相当で最終確認する。
- 必要に応じてボタン行の縦方向余白を微調整し、連続操作時のタップしやすさを高める。

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一画面アプリとして、`calculator` / `new` / `edit` を画面モードで切り替える。
- `calculator` 画面は、ボタン行・レシピ選択行・分量行・材料セクション・説明セクションの順で表示する。
- `calculator` 画面では、2つの操作ボタンを等幅で横並び表示し、分量行は右寄せの1行レイアウトとしている。
- 説明本文は材料行に近いカード表現で表示し、`description` が空文字のときは説明セクションを表示しない。
- `new` / `edit` 画面は `RecipeForm` を共通利用し、材料追加/編集は `IngredientFormModal` で行う。

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
  - 分量行（右寄せ）
    - `基準分量: {baseAmount} → 今回の分量 [入力]`
  - 材料セクション
    - 見出し `材料`
    - 材料一覧（換算表示）
  - 説明セクション（`description` が空でない場合のみ）
    - 見出し: `{レシピ名}レシピの説明`
    - 本文: カード表示の `description`
  - （レシピ0件時）`レシピがありません`
- `new` / `edit` 画面（`RecipeForm` 共通）
  - レシピ名、説明、基準量
  - 材料セクション
    - `材料追加` ボタン
    - 材料一覧（材料名・分量単位・編集・削除）
- モーダル
  - `IngredientFormModal`（追加/編集共通）
  - `NumberInputModal`（テンキー入力、クリア、キャンセル、決定）
