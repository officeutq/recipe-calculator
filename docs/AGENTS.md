# AGENTS.md

## Project

レシピ計算機アプリ。

React + TypeScript で、登録済みレシピを選択し、作成量に応じて材料分量を換算する。

Capacitor を導入済みで、React / Vite アプリを iOS アプリとして実機確認できる構成にしている。

Android 対応は今後の予定。

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- LocalStorage
- Capacitor
- iOS (Xcode)

## Development Policy

- まずは URL を分けず、画面モードで切り替える
- 保存は当面 LocalStorage を使う
- 後で React Router / API 保存へ移行しやすい構成にする
- スマートフォンで使いやすい UI を優先する
- React 側の実装を主とし、iOS側は必要最小限の変更にする

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

## Mobile / Capacitor Policy

* Capacitor を利用して iOS / Android アプリ化する
* React / TypeScript 側を主実装とする
* iOS固有実装は最小限にする
* React変更後は必ず iOS同期を行う
* Capacitor生成ファイルを勝手に大きく変更しない
* Xcode設定変更は必要最小限にする

React変更後:

```bash
npm run build
npx cap sync ios
```

実機確認:

```bash
npx cap open ios
```

## Release / Version Policy

Marketing Version:

```txt
major.minor.patch
```

例:

```txt
1.0.0
```

Build Number:

```txt
1
2
3
```

運用ルール:

* TestFlight再アップロード時は Build Number を必ず増やす
* 小さな不具合修正 → patch 更新

```txt
1.0.0
↓
1.0.1
```

* 小さな機能追加 → minor 更新

```txt
1.0.0
↓
1.1.0
```

* 大きな仕様変更 → major 更新

```txt
1.0.0
↓
2.0.0
```

## Mobile Asset Policy

アプリアイコン・スプラッシュ元画像:

```txt
assets/
```

生成:

```bash
npx capacitor-assets generate --ios
```

用途:

```txt
public/app-icon.png
↓
画面内表示用

ios/App/App/Assets.xcassets
↓
ネイティブアプリアイコン
```

ネイティブアイコンと画面表示アイコンは用途を分ける。

## Coding Guidelines

* TypeScript の型を明示する
* コンポーネントは責務ごとに分割する
* 既存の学習用コードを壊しすぎず、段階的に変更する
* 大きな変更は小さい差分に分ける
* 実装前に変更対象ファイルと方針を説明する
* 実装は Codex 前提で進める
* Codex向けプロンプトは具体的に書く
* 不要な大規模リファクタリングを避ける

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npx cap sync ios
npx cap open ios
```

## Implementation Log Rules

実装を行った場合は必ず:

```txt
docs/implementation-log.md
```

を更新する。

追記内容:

* 更新履歴
* 変更ファイル
* 実装内容
* 学習ポイント
* 確認内容
* 次にやること

日本語で記録する。

事実と推測は分離する。

implementation-log.md 更新時ルール:

更新履歴だけでなく、

* 現在の実装概要
* 現在のデータ構造
* 現在の画面構成

も今回の変更内容に合わせて更新する。

古い記述を残さない。
