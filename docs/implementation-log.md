# 実装記録

作成日: 2026-05-17
更新日: 2026-05-17

## 更新履歴（2026-05-17）

- TestFlight配布準備が完了したことをドキュメントへ反映した。
- App Store Connect へ `1.0.0 (1)` をアップロード済みであることを記録した。
- TestFlight の内部テストグループ作成済みであることを記録した。
- テスター追加済みであることを記録した。
- iPhone の TestFlight アプリからインストール成功済みであることを記録した。
- 今後は Build Number を増やして再アップロードする運用であることを明記した。
- README / implementation-log / AGENTS.md の運用記述を最新化した（アプリコード変更なし）。

## 変更ファイル

- `README.md`
- `docs/implementation-log.md`
- `docs/AGENTS.md`

## 実装内容

- TestFlight配布到達後の運用を README に追記
  - 初回 TestFlight で実施した内容（App Store Connect作成、Bundle ID、コンプライアンス、内部テストグループ、テスター追加、iPhoneインストール成功）
  - TestFlight配布までの基本手順
  - 次回以降の更新手順（React修正 → build → cap sync → Build Number +1 → Archive → Upload → TestFlight更新確認）
- implementation-log を整理
  - 更新履歴を本更新中心に再整理
  - 現在の実装概要 / データ構造 / 画面構成 / 次にやることを最新化
  - 完了済み項目を「次にやること」から除外
- AGENTS.md を更新
  - TestFlight 再アップロード時の Build Number 増分ルールを明確化
  - iOS更新前の `npm run build` / `npx cap sync ios` 必須ルールを明確化
  - TestFlight更新手順を変更した場合に README / implementation-log を更新するルールを追加

## 事実と推測

### 事実

- App Store Connect へ `1.0.0 (1)` をアップロード済み。
- TestFlight の内部テストグループ作成済み。
- テスター追加済み。
- iPhone の TestFlight アプリからインストール成功済み。
- `npm run lint` / `npm run build` はこの更新時点で成功。

### 推測（未確認事項）

- 外部テスター向け配布フロー（審査要否や運用手順）は未検証。
- App Store 本申請に必要なメタデータ一式（説明文、審査用情報、プライバシー回答等）の最終確定は未実施。

## 確認内容

- `npm run lint` を実行し成功。
- `npm run build` を実行し成功。
- 今回はドキュメント更新のみで、Reactロジック / UI / iOS設定の変更は行っていない。

## 次にやること

- 次回 TestFlight 更新時に Build Number を `+1` して再アップロードする。
- TestFlight 更新手順に変更が出た場合は README と implementation-log を同時更新する。
- 必要に応じて外部テスター配布フローを別途検証し、事実ベースで記録する。

## 現在の実装概要

- React + TypeScript + Vite で実装した単一ページアプリ。
- Capacitor を導入し、iOS ネイティブプロジェクトへ同期して運用可能。
- iOS 実機確認、アプリアイコン設定、スプラッシュ画像設定、Safe Area対応まで完了。
- TestFlight 内部配布で iPhone へのインストール確認まで完了。

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

- `calculator` 画面
  - レシピ選択
  - 新規作成/編集遷移
  - 基準分量表示・作成量入力
  - 換算後材料一覧
  - レシピ説明
- `new` 画面
  - レシピ情報入力
  - 材料追加/編集/削除
  - 保存/キャンセル
- `edit` 画面
  - レシピ情報入力
  - 材料追加/編集/削除
  - 保存/キャンセル/削除
- モーダル
  - `IngredientFormModal`
  - `NumberInputModal`
