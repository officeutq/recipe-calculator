# レシピ計算機

## アプリ概要

レシピ計算機は、登録したレシピの**基準分量**をもとに、作りたい分量へ材料を自動換算する Web アプリです。React + TypeScript + Vite で実装されており、スマートフォンでも扱いやすい操作性を重視しています。

## 主な機能

- レシピの作成
  - レシピ名・説明・基準分量・材料（名前/分量/単位）を入力して保存
- レシピの編集・削除
  - 既存レシピの内容更新と削除
- 材料分量の自動換算
  - 基準分量と今回の分量から、各材料の必要量を自動計算
- 数値入力モーダル
  - 基準分量や材料分量は専用の数値入力モーダルで入力
- 保存時バリデーション
  - レシピ名必須
  - 基準分量は 1 以上
  - 材料は 1 件以上必須

## 画面構成

本アプリは URL を分けず、画面モード切替で構成されています。

- `calculator` 画面
  - レシピ選択
  - 新規作成/編集への遷移
  - 基準分量表示・今回の分量入力
  - 換算後の材料一覧表示
  - レシピ説明表示
- `new` 画面（レシピ新規作成）
  - レシピ情報入力
  - 材料の追加・編集・削除
  - 保存/キャンセル
- `edit` 画面（レシピ編集）
  - レシピ情報入力
  - 材料の追加・編集・削除
  - 保存/キャンセル/削除
- モーダル
  - `IngredientFormModal`（材料入力）
  - `NumberInputModal`（数値入力）

## データ保存方式

- 保存先: ブラウザの LocalStorage
- 保存タイミング: レシピの新規保存・編集保存・削除時
- 保存前チェック: 共通バリデーションを通過した場合のみ保存処理を実行

## 開発コマンド

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## iOS ビルド・実機確認・TestFlight前チェック

### 1. Capacitor / iOS 設定値の確認

- `capacitor.config.ts`
  - `appId`: `jp.co.officeutq.recipecalculator`
  - `appName`: `レシピ計算機`
  - `webDir`: `dist`
- iOS（`ios/App/App.xcodeproj/project.pbxproj`）
  - Bundle Identifier: `jp.co.officeutq.recipecalculator`
  - Version（`MARKETING_VERSION`）: `1.0.0`
  - Build（`CURRENT_PROJECT_VERSION`）: `1`
- iOS（`ios/App/App/Info.plist`）
  - 表示アプリ名（`CFBundleDisplayName`）: `レシピ計算機`

### 2. Webアプリをビルド

```bash
npm run build
```

### 3. iOSネイティブ側へ同期

```bash
npx cap sync ios
```

### 4. Xcodeで実機確認

1. `npx cap open ios` で Xcode を開く  
2. Signing & Capabilities で Team / Bundle Identifier を確認  
3. 実機を選択して Run  
4. 以下を確認
   - 画面表示（Safe Area含む）
   - レシピ作成/編集/削除
   - 分量換算
   - 日本語表示

### 5. TestFlightへ進む前の最終チェック

- `npm run lint` が成功する
- `npm run build` が成功する
- `npx cap sync ios` が成功する
- 実機で主要機能の回帰確認が完了している
- Version / Build番号を今回リリース用に見直している
- App Store Connect に登録するアプリ情報（名前、説明、スクリーンショット等）の準備方針を決めている


## バージョン運用ルール（iOS / TestFlight）

- Marketing Version は `major.minor.patch` 形式で管理する（例: `1.0.0`）。
- Build Number（`CURRENT_PROJECT_VERSION`）は整数で管理し、同じ Version 内でもアップロードのたびに必ず増やす（例: `1` → `2` → `3`）。
- TestFlight へ再アップロードする場合、Marketing Version が同じでも Build Number は必ず増やす。
- 小さな不具合修正は patch を上げる（例: `1.0.0` → `1.0.1`）。
- 小さな機能追加は minor を上げる（例: `1.0.0` → `1.1.0`）。
- 大きな仕様変更や互換性のない変更は major を上げる（例: `1.0.0` → `2.0.0`）。
- 現在の運用開始値は Version `1.0.0` / Build `1` とする。

## 今後の予定

- 手動操作で `new` / `edit` の「材料 0 件保存」時のアラート表示タイミングを再確認
- 必要に応じて、材料セクションにインラインエラー表示を追加して UX を改善
- 将来の拡張として、React Router による画面分離や API 永続化への移行を検討

## TestFlight配布手順（初回〜継続運用）

### 初回TestFlightで実施したこと（完了済みの事実）

- App Store Connect にアプリを作成
- Bundle ID を登録
- 輸出コンプライアンス情報を入力
- TestFlight の内部テストグループを作成
- テスターを追加
- iPhone の TestFlight アプリからインストール成功
- App Store Connect に `1.0.0 (1)` をアップロード

### TestFlight配布までの基本手順

1. React 側の修正を実装
2. `npm run lint` / `npm run build` を実行
3. `npx cap sync ios` を実行して iOS 側へ反映
4. Xcode で `Version` / `Build` を確認
5. Archive を作成
6. App Store Connect へ Upload
7. TestFlight の内部テストグループで配布
8. iPhone の TestFlight アプリで更新確認

### 次回以降の更新手順（毎回）

1. React 側修正
2. `npm run build`
3. `npx cap sync ios`
4. iOS Build Number（`CURRENT_PROJECT_VERSION`）を **+1**
5. Xcode で Archive
6. App Store Connect へ Upload
7. TestFlight で更新確認

> 注意: 同じ Marketing Version のまま再アップロードする場合でも、Build Number は必ず増やす。

