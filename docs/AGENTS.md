# AGENTS.md

## Project

レシピ計算機アプリ。

React + TypeScript で、登録済みレシピを選択し、作成量に応じて材料分量を換算する。

将来的に iOS / Android 化を見据えるが、現時点では React 単体の Web アプリとして実装する。

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- LocalStorage

## Development Policy

- まずは URL を分けず、画面モードで切り替える
- 保存は当面 LocalStorage を使う
- 後で React Router / API 保存へ移行しやすい構成にする
- スマートフォンで使いやすい UI を優先する

## Domain Terms

- レシピ: Recipe
- 材料: Ingredient
- 基準量: baseAmount
- 作成量: targetAmount

## Data Model

```ts
type Recipe = {
  id: number
  name: string
  description: string
  baseAmount: number
  ingredients: Ingredient[]
}

type Ingredient = {
  id: number
  name: string
  amount: number
  unit: string
}
```

## Important Requirements

* レシピ計算画面では材料の追加・削除をしない
* 材料の追加・削除は新規作成画面または編集画面で行う
* 数値入力は独自の数値入力モーダルで行う
* 数値入力モーダルに計算機能は持たせない
* `+`, `-`, `×`, `÷`, `=` は表示しない

## Coding Guidelines

* TypeScript の型を明示する
* コンポーネントは責務ごとに分割する
* 既存の学習用コードを壊しすぎず、段階的に変更する
* 大きな変更は小さい差分に分ける
* 実装前に変更対象ファイルと方針を説明する

## Commands

```bash
npm install
npm run dev
npm run build
```

## Implementation Log Rules

実装を行った場合は必ず
docs/implementation-log.md
を更新する。

追記内容:

- 更新履歴
- 変更ファイル
- 実装内容
- 学習ポイント
- 確認内容
- 次にやること

日本語で記録する。

事実と推測は分離する。

implementation-log.md 更新時ルール:

更新履歴だけでなく、
「現在の実装概要」「現在のデータ構造」「現在の画面構成」も、
今回の変更内容に合わせて更新すること。

古い記述を残さない。
