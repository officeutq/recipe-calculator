# 実装記録

作成日: 2026-05-17
更新日: 2026-05-17

## 現在の実装概要（事実）

- React + TypeScript + Vite の単一画面アプリとして、`calculator` / `new` / `edit` を画面モードで切り替える。
- 数値入力は `NumberInputModal` を利用し、モーダルを開いた直後の表示値は新規入力・編集入力を問わず常に `0` になる。
- 数値入力モーダルはキャンセル時に親 state を変更せず、決定時のみ親側に値を反映する。
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
  - レシピ名、説明、基準量、材料編集、保存系操作
- 数値入力モーダル（`NumberInputModal`）
  - テンキー入力、クリア、キャンセル、決定

## 更新履歴（2026-05-17）

### 変更ファイル（事実）

- `src/components/NumberInputModal.tsx`
- `docs/implementation-log.md`

### 実装内容（事実）

- `NumberInputModal` の初期一時入力値を、モーダルを開くたびに常に `0` へリセットするように変更した。
- モーダル初期化時に親から渡される既存値を使用しない実装へ変更した。
- `0` 表示中のキー入力挙動を調整した。
  - 数字キー: `0` を置き換えて入力（例: `0` → `5`）
  - `.` キー（`allowDecimal=true`）: `0.` を生成
  - `.` キー（`allowDecimal=false`）: 従来どおり無効
- 削除（←）は最小値を `0` とし、初期 `0` から削除しても `0` を維持するようにした。
- クリアは空文字ではなく `0` に戻すようにした。
- 決定時は現在値を親へ渡し、キャンセル時は親を変更しない既存挙動を維持した。

### 学習ポイント（事実）

- 電卓的な入力体験では、先頭 `0` の扱い（置換・小数点付与・削除時の下限）を明示的に分岐すると要件と実装のずれを防ぎやすい。
- モーダル内の一時 state と親 state の責務を分けると、キャンセル時の非破壊更新を保ちやすい。

### 確認内容（事実）

- `npm run build` が成功し、TypeScript ビルドおよび Vite ビルドが通ることを確認した。
- コード上で以下を確認した。
  - 作成量・基準量・材料分量で同一モーダルを使うため、すべて同じ初期値 `0` 挙動になること。
  - `allowDecimal=false` で `.` が入力不可のままであること。
  - キャンセル時に親へ値反映を行わないこと。

### 次にやること（推測）

- モーダルの入力シナリオ（`0` / 整数 / 小数 / 削除 / クリア）をコンポーネントテスト化して回帰を防止する。
