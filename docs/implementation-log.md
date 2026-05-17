# 実装記録（現状整理）

作成日: 2026-05-17

## 現在の実装概要（事実）

- React + TypeScript + Vite で構築された、単一画面のレシピ分量換算アプリ。
- レシピ名・基準人数・作りたい人数・材料リストを入力し、基準人数に対する倍率を使って材料分量を換算表示する。
- 画面状態は `localStorage` に保存され、再読み込み後も入力内容が復元される。
- 初期表示時にはサンプル材料（じゃがいも、にんじん、玉ねぎ、牛肉）が読み込まれる。

## 使用技術（事実）

- React 19
- TypeScript
- Vite
- ESLint
- ブラウザ `localStorage`

## 主要ファイルと役割（事実）

- `src/main.tsx`
  - React アプリのエントリーポイント。`App` を `#root` にマウントする。
- `src/App.tsx`
  - 画面全体の構成と状態管理の中心。
  - レシピ情報入力、倍率計算、材料追加・削除、リセット処理を実装。
  - `useLocalStorageState` を使い、各状態を永続化する。
- `src/components/IngredientForm.tsx`
  - 材料追加フォーム。
  - 材料名・分量・単位の入力値を検証し、妥当な場合のみ追加処理を呼び出す。
- `src/components/IngredientList.tsx`
  - 材料一覧表示。
  - 各材料の元の分量と換算後分量を表示し、削除操作を提供。
- `src/hooks/useLocalStorageState.ts`
  - `localStorage` と React state を同期する汎用フック。
  - JSON パース失敗時はフォールバック値に戻す。
- `src/types/ingredient.ts`
  - `Ingredient` / `NewIngredient` 型定義。
- `src/App.css` / `src/index.css`
  - 画面スタイル定義。
- `package.json`
  - 依存関係と実行スクリプト（`dev`/`build`/`lint`/`preview`）を定義。

## 現在実装済みの機能（事実）

- レシピ名の入力
- 基準人数・作りたい人数の入力
- 倍率計算（`targetServings / baseServings`）
- 入力内容プレビュー表示（レシピ名、人数、倍率）
- 材料の追加（バリデーション付き）
- 材料の削除
- 材料ごとの換算後分量表示
- リセット（初期値へ復帰）
- `localStorage` による入力状態の永続化

## 現在のデータ構造（事実）

### 型

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
```

### 主要状態（`App.tsx`）

- `recipeName: string`
- `baseServings: string`
- `targetServings: string`
- `ingredients: Ingredient[]`

### 導出値（`App.tsx`）

- `baseServingsNumber: number`
- `targetServingsNumber: number`
- `canCalculate: boolean`
- `scale: number | null`

## 現在の保存方式（事実）

- 保存先: ブラウザ `localStorage`
- 保存タイミング: 状態変更時に `useEffect` で自動保存
- 保存形式: `JSON.stringify(value)`
- 復元方法: 初期化時に `localStorage.getItem` + `JSON.parse`
- 復元失敗時: フォールバック値を使用

使用中の主なキー:

- `recipe-calculator:recipe-name`
- `recipe-calculator:base-servings`
- `recipe-calculator:target-servings`
- `recipe-calculator:ingredients`

## 現在の画面構成（事実）

- ヘッダーセクション
  - アプリ名・説明文
- レシピ情報セクション
  - レシピ名入力
  - 基準人数入力
  - 作りたい人数入力
  - リセットボタン
- 入力内容プレビューセクション
  - レシピ名／基準人数／作りたい人数／倍率
- 材料セクション
  - 材料追加フォーム（材料名、分量、単位）
  - 材料一覧（元の分量 → 換算後分量、削除ボタン）

## 今後変更予定の方向性（今後の方針案: 推測）

- 画面モードを増やし、将来的に「作成」「編集」「計算」を分離する。
- ルーティング導入（React Router）を見据えて、画面責務をより分割する。
- 保存方式を `localStorage` から API / DB 保存へ移行しやすい構成に整理する。
- モバイル利用を前提に、数値入力 UX を専用モーダル設計へ近づける。

## 次に実装するとよさそうなこと（今後の方針案: 推測）

1. レシピ単位での保存機能（複数レシピ管理）
2. 材料編集機能（追加・削除だけでなく更新も可能にする）
3. 換算値の表示整形（小数桁の制御、単位に応じた丸め）
4. 画面モード分離（計算専用画面と編集画面）
5. テスト追加（換算ロジック、フォームバリデーション、永続化）
6. 入力コンポーネントの再利用化と責務分離

---

補足:

- 本ドキュメント内の「事実」は 2026-05-17 時点の実装コードに基づく。
- 「今後の方針案」は既存ドキュメントの方針や現実装からの推測であり、未実装。

---

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/types/ingredient.ts`
- `src/App.tsx`
- `docs/implementation-log.md`

### 実装内容（事実）

- `Recipe` 型を追加した。`id`, `name`, `description`, `baseAmount`, `ingredients` を持つ構造にした。
- `Ingredient` 型は維持した。
- 初期データを `Ingredient[]` 中心から `Recipe[]`（`initialRecipes`）へ変更した。
- `localStorage` の保存対象を `recipeName` / `baseServings` / `ingredients` 個別保存から、`recipes` 保存へ変更した。
- `selectedRecipeId` を state として追加し、`localStorage` に保存するようにした。
- 換算計算は、選択中レシピ（`selectedRecipeId` で特定）から `baseAmount` と `ingredients` を参照する構成に変更した。
- 既存 UI の見た目は大きく変更せず、従来の入力・換算・材料追加削除フローを維持した。

### 学習ポイント（事実）

- 複数レシピ対応の初期段階では、UI を増やす前に state 正規化（`Recipe[]` + `selectedRecipeId`）を先行させると差分を小さく保てる。
- 既存の単一 state を Recipe 内部へ寄せる際は、更新関数（今回の `updateSelectedRecipe`）を挟むと変更箇所を局所化できる。
- 段階的移行時は、入力 UI はそのままでもデータ参照先を切り替えるだけで換算機能を維持しやすい。

### 確認内容（事実）

- `npm run build` が成功することを確認した。
- TypeScript ビルド上で、`Recipe[]` 中心の state 変更後もコンパイルエラーがないことを確認した。

### 次にやること（今後の方針案）

- レシピ一覧 UI を追加し、`selectedRecipeId` をユーザー操作で切り替え可能にする。
- レシピ新規作成・編集画面を段階的に追加する（今回未実装）。
- `targetServings` も将来的にはレシピ単位保存か画面単位保存か方針を決めて整理する。
- 小数表示ルール（桁数・丸め）を明確化して換算表示を改善する。
