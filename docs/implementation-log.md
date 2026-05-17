# 実装記録

作成日: 2026-05-17
更新日: 2026-05-17
## 更新履歴（2026-05-17）

- iOSリリース前確認として、`capacitor.config.ts` の `appId` / `appName` / `webDir` を再確認した。
- iOS設定確認として、Bundle Identifier が `jp.co.officeutq.recipecalculator` であることを確認した。
- iOS設定確認として、表示アプリ名（`CFBundleDisplayName`）が「レシピ計算機」であることを確認した。
- Version / Build 番号の現在値が `1.0` / `1` であることを確認した。
- `README.md` に iOSビルド・実機確認・TestFlight前チェック手順を追記した。
- 既存ロジック・UIは変更していない。
## 更新履歴（2026-05-17）

- `App.tsx` のヘッダー上部にアプリアイコン画像（`/app-icon.png`）を追加し、`Recipe Calculator` ラベルより上に表示するようにした。
- `App.css` に `.app-icon` スタイルを追加し、72〜96pxの範囲で小さめ表示・中央寄せにした。
- 対応目的は、iOS実機表示時にヘッダー周辺の見た目へ余裕とアプリらしさを加えること。
- レシピ計算・編集・材料処理・LocalStorageロジックは変更していない。
- `npm run lint` / `npm run build` の成功を確認した。

## 更新履歴（2026-05-18）

- `App.css` の `.app` に Safe Area 対応の上下余白を追加した（`env(safe-area-inset-top/bottom)` を使用）。
- `App.tsx` に下部クレジット `© 2026 Office UTQ Inc.` を追加した。
- 対応目的は、Capacitor/iOSアプリ表示時にノッチ・ホームインジケータ近傍の見た目を改善すること。
- `npm run lint` / `npm run build` の成功を確認した。

## 更新履歴（2026-05-17）

- `IngredientFormModal` / `NumberInputModal` / `RecipeForm` の lint エラー解消を実施した。
- 対象ルールは `react-hooks/set-state-in-effect` と `@typescript-eslint/no-unused-vars`。
- UI・モーダル挙動・保存処理は変更せず、既存仕様（NumberInputModal は開いたら 0）を維持した。

## 変更ファイル

- `README.md`
- `src/components/IngredientFormModal.tsx`
- `src/components/NumberInputModal.tsx`
- `src/components/RecipeForm.tsx`
- `docs/implementation-log.md`

## 実装内容

- iOSリリース準備ドキュメント整理
  - `capacitor.config.ts` の設定値確認結果を README に明記した。
  - `ios/App/App.xcodeproj/project.pbxproj` の Bundle Identifier / Version / Build 確認結果を README に明記した。
  - `ios/App/App/Info.plist` の表示アプリ名確認結果を README に明記した。
  - TestFlightへ進む前の最終チェック項目を README に追加した。
- `IngredientFormModal`
  - `useEffect` 内の同期 `setState` を廃止した。
  - `open` と `initialIngredient` の変化をレンダー中にガード判定し、必要時のみ初期化する構成へ変更した。
  - 分量モーダルの開閉制御、保存時バリデーション、`onSave` のデータ整形は維持した。
- `NumberInputModal`
  - 未使用扱いだった `value` props を `void value` で明示参照し、`@typescript-eslint/no-unused-vars` を解消した。
  - 「開いたら `0`」の既存仕様（`open` 変化時に `inputValue` を `0` に戻す）は維持した。
- `RecipeForm`
  - `useEffect` 内の同期 `setState` を廃止した。
  - `initialRecipe` 変更時のみレンダー中ガードでフォーム状態を同期する構成へ変更した。
  - 材料モーダル挙動、削除確認、保存ボタンの `onSave` 呼び出し内容は変更していない。

## 学習ポイント

- props 同期のための `setState` を `useEffect` で行うと lint で禁止されるケースがあるため、前回 props を保持したガード付き同期パターンが有効。
- lint 対応時は仕様変更を避けるため、入力初期化タイミングとモーダル開閉条件を先に固定してから差分適用すると安全。

## 確認内容

- 設定ファイル確認で、以下の現在値を確認した。
  - appId: `jp.co.officeutq.recipecalculator`
  - appName: `レシピ計算機`
  - webDir: `dist`
  - Bundle Identifier: `jp.co.officeutq.recipecalculator`
  - 表示アプリ名: `レシピ計算機`
  - Version / Build: `1.0` / `1`
- `npm run lint` が成功することを確認した。
- `npm run build` が成功することを確認した。
- `npx cap sync ios` は、この環境の npm レジストリアクセス制限（403）により実行失敗した。
- コード上で、以下の仕様不変を確認した。
  - NumberInputModal は open 時に `0` 初期化される。
  - 材料モーダルの開閉と保存処理のフローは変更なし。
  - RecipeForm の保存処理呼び出し内容は変更なし。

## 次にやること

- Xcode の Signing 設定（Team / Provisioning Profile）をリリース用に最終確認する。
- TestFlight配布向けに Version / Build の採番ルールを運用に合わせて確定する。
- 手動操作で、材料追加/編集モーダルと基準分量入力モーダルの体感挙動（開閉・値確定）を回帰確認する。

## 現在の実装概要

- React + TypeScript + Vite の単一ページアプリ。
- Capacitor を介して iOS ネイティブプロジェクトへ同期し、実機動作確認まで実施できる状態。
- 画面モード切替（`calculator` / `new` / `edit`）で操作する構成。
- レシピ作成・編集は `RecipeForm`、材料入力は `IngredientFormModal`、数値入力は `NumberInputModal` を利用。
- 永続化は LocalStorage。
- Capacitor/iOS表示を考慮し、ルートの上下余白は Safe Area を加味する。
- TestFlight前チェック手順（設定値確認・ビルド・同期・実機確認）を README で運用可能な状態。

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
  - アプリアイコン画像（`/app-icon.png`）
  - アプリラベル
  - タイトル
  - 説明文
- 画面下部
  - クレジット表示（`© 2026 Office UTQ Inc.`）
- `calculator` 画面
  - レシピ選択
  - レシピ新規作成/編集ボタン
  - 基準分量表示と今回の分量入力
  - 材料一覧（換算表示）
  - レシピ説明表示
- `new` 画面（`RecipeForm`）
  - レシピ名
  - 説明
  - 基準分量（`NumberInputModal`）
  - 材料追加・編集・削除
  - 保存/キャンセル
- `edit` 画面（`RecipeForm`）
  - レシピ名
  - 説明
  - 基準分量（`NumberInputModal`）
  - 材料追加・編集・削除
  - 保存/キャンセル/削除
- `IngredientFormModal`
  - 材料名・分量・単位の入力
- `NumberInputModal`
  - 数値入力専用モーダル

## 2026-05-18: CapacitorによるiOSアプリ化の土台追加

### 実装概要

React + TypeScript + Viteで作成しているレシピ計算機アプリに、Capacitorを導入し、iOSアプリとして起動できる土台を追加した。

今回の対応では、既存のReactアプリ本体は大きく変更せず、Viteのビルド成果物をCapacitor経由でiOSアプリ内に取り込む構成とした。

### 追加・変更内容

- `@capacitor/core` を追加
- `@capacitor/cli` を追加
- `@capacitor/ios` を追加
- `capacitor.config.ts` を追加
- iOS用のネイティブプロジェクトとして `ios/` を追加
- `npm run build` 後に `npx cap sync ios` でiOS側へ同期できることを確認
- XcodeからiOSシミュレータを起動し、レシピ計算機が表示されることを確認

### Capacitor構成

現在の構成は以下の通り。

```txt
React / TypeScript / Vite
↓ npm run build
dist/
↓ npx cap sync ios
ios/
↓ Xcode
iOSシミュレータ
```

Capacitorは、既存のReactアプリをiOSアプリのWebView内で動作させるための土台として使用している。

### iOS確認結果

XcodeでiOSシミュレータを起動し、レシピ計算機の画面が表示されることを確認した。

確認できた内容:

* レシピ編集画面が表示される
* 日本語表示に問題がない
* 材料一覧が表示される
* 既存のReact画面がiOSアプリ内で動作する
* LocalStorageを利用した既存の保存方針は維持

### 今後の検討事項

* iPhoneのSafe Area対応

  * ノッチやホームインジケータ領域を考慮した余白調整
* アプリアイコン設定
* スプラッシュ画面設定
* 実機確認
* Android対応
* App Store配布に向けたBundle ID / Signing設定確認

### 動作確認

```bash
npm run lint
npm run build
npx cap sync ios
```

加えて、XcodeからiOSシミュレータで起動確認済み。
