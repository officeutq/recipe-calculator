# 実装記録

作成日: 2026-05-17

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一画面アプリとして、画面モード（`calculator` / `new` / `edit`）で表示を切り替える構成にした。
- 計算画面はレシピ選択と作成量入力による材料換算表示を担当し、既存の計算 UI を維持している。
- 新規作成画面・編集画面は `RecipeForm` を共通利用する土台を追加し、保存は仮実装（`console.log`）にしている。
- `recipes` / `selectedRecipeId` / `targetServings` / `screenMode` を `localStorage` と同期し、再読み込み後に復元する。

## 現在のデータ構造（事実）

```ts
type Ingredient = {
  id: number
  name: string
  amount: number
  unit: string
}

type NewIngredient = {
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
```

主要 state:

- `recipes: Recipe[]`
- `selectedRecipeId: number | null`
- `targetServings: string`
- `screenMode: ScreenMode`

導出値:

- `selectedRecipe`
- `baseServingsNumber`
- `ingredients`
- `description`
- `scale`

## 現在の画面構成（事実）

- ヘッダー
  - アプリ名、説明文
- calculator 画面
  - レシピ情報カード
    - リセットボタン
    - レシピ新規作成ボタン（押下で `screenMode = "new"`）
    - レシピ編集ボタン（選択時のみ表示、押下で `screenMode = "edit"`）
    - レシピ選択ドロップダウン
    - 選択レシピ説明
    - 基準量表示
    - 作成量入力
  - 材料セクション
    - 換算表示専用の材料一覧
- new 画面
  - `RecipeForm`
    - タイトル「レシピ新規作成」
    - レシピ名
    - 説明
    - 基準量
    - 保存（仮実装: `console.log("save new")`）
    - キャンセル（`screenMode = "calculator"`）
- edit 画面
  - `RecipeForm`（再利用）
    - タイトル「レシピ編集」
    - `selectedRecipe` の初期値表示
    - 保存（仮実装: `console.log("save edit")`）
    - キャンセル（`screenMode = "calculator"`）

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/App.tsx`
- `src/components/RecipeForm.tsx`
- `src/App.css`
- `docs/implementation-log.md`

### 実装内容（事実）

- `ScreenMode` 型（`calculator` / `new` / `edit`）を追加した。
- `screenMode` state を追加し、初期値を `"calculator"` に設定した。
- 「レシピ新規作成」「レシピ編集」ボタンを `console.log` から `setScreenMode` へ変更した。
- `calculator` 画面に既存 UI（レシピ選択・説明・基準量・作成量・材料換算表示）を維持したまま条件レンダリングを導入した。
- 新規コンポーネント `RecipeForm` を追加し、new/edit 画面で共通利用する土台を作成した。
- new 画面で保存・キャンセル動作を接続した（保存は仮実装）。
- edit 画面で `selectedRecipe` の初期値表示、保存・キャンセル動作を接続した（保存は仮実装）。

### 学習ポイント（事実）

- URL 分割前の段階では、画面モード state と条件レンダリングで遷移設計を進めると、既存画面を壊さず段階的に拡張しやすい。
- new/edit の UI を先に共通コンポーネント化しておくと、将来のバリデーションや保存処理追加時の差分を小さくできる。

### 確認内容（事実）

- `npm run build` が成功し、型チェックとビルドが通ることを確認した。

### 次にやること（推測）

- `RecipeForm` の入力値を state 化し、new/edit それぞれで保存処理（LocalStorage 更新）を実装する。
- 材料編集（追加・削除・単位）を `RecipeForm` 内へ段階的に導入する。
- 数値入力モーダル（`NumberInputModal`）を追加し、数値入力 UX を統一する。
