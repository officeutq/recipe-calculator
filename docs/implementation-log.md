# 実装記録

作成日: 2026-05-17
更新日: 2026-05-17

## 更新履歴（2026-05-17）

- IngredientFormModal の材料名プレースホルダーを「カレー」から「材料名」へ変更した。
- IngredientFormModal の分量欄と単位欄の横幅バランスを、スマホ幅でも自然な 1:1 付近になるよう調整した。
- IngredientFormModal の保存 / キャンセルボタンを 1:1 の等幅で横いっぱいに広がるよう調整した。

## 変更ファイル

- `src/components/IngredientFormModal.tsx`
- `src/App.css`
- `docs/implementation-log.md`

## 実装内容

- 材料名入力欄の placeholder を `材料名` に変更した。
- 分量入力欄（`ingredient-form-amount-input`）の `flex` を `1 1 0` に変更した。
- 単位入力欄（`ingredient-form-unit-input`）の `flex` を `1 1 0` に変更した。
- 既存の `gap`（`ingredient-form-inline-field--single` の `gap: 10px`）は維持した。
- モーダル下部のアクションボタン（保存 / キャンセル）に `flex: 1 1 0` を追加し、2 ボタンを等幅で親幅いっぱいに配置した。
- アクション行の `gap: 8px` とボタン `padding: 10px 12px` は維持し、タップしやすさを維持した。
- 分量入力は既存どおり readOnly + クリックで `NumberInputModal` を開く仕様を維持した。
- 単位入力の state（`unit`）および保存処理（`onSave` 時の `trim` と保存値）は変更していない。
- IngredientFormModal の保存処理・バリデーション・モーダル構造は変更していない。

## 学習ポイント

- 同一行で 2 入力の横幅バランスを揃える場合、両方を `flex: 1 1 0` にすることで、固定幅指定より自然に 1:1 に寄せやすい。
- `min-width: 0` がすでに適用されている構成では、狭い幅でも入力欄がはみ出しにくく、スマホ表示で安定しやすい。

## 確認内容

- `npm run build` が成功することを確認した。
- IngredientFormModal の保存処理・バリデーション・NumberInputModal 連携に差分がないことを確認した。
- RecipeForm / calculator画面 / NumberInputModal / LocalStorage 関連ロジックに変更がないことを確認した（今回の差分ファイル外）。

## 次にやること

- 実機の狭幅（320px 前後）で、長い単位文字列入力時の表示崩れ有無を目視確認する。
- 必要に応じて、単位欄の placeholder 表現（例: `g`, `ml`）の UX を検討する。

## 現在の実装概要

- React + TypeScript + Vite 構成の単一ページアプリ。
- 画面モード切替で `calculator` / `new` / `edit` を運用。
- データ永続化は LocalStorage を利用。
- 数値入力は `NumberInputModal` を共通利用。

## 現在のデータ構造

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

## 現在の画面構成

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
  - レシピ名入力
  - 説明入力
  - 基準分量入力（`NumberInputModal` 起点）
  - 材料追加導線
  - 材料一覧（編集/削除）
  - 保存/キャンセル（編集時は削除）
- `IngredientFormModal`
  - 1行目: `材料名: [材料名]`
  - 2行目: `分量: [分量] [単位]`（2欄はほぼ 1:1 幅）
  - 3行目: 保存 / キャンセル（2ボタン等幅で横いっぱい、gap維持）
- `NumberInputModal`
  - 数値入力専用モーダル
