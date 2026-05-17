# 初期導入手順

## プロジェクト概要

レシピ計算機アプリを、React + TypeScript + Vite 構成で作成する。

主な目的は以下。

- React の習得
- TypeScript の習得
- iOS / Android アプリ化の検証
- 将来的な Rails API 連携を見据えた構成検討

## 技術構成

初期構成は以下。

- Vite
- React
- TypeScript

現時点では Rails は使用しない。

理由は、初期段階ではデータをスマホ側・ブラウザ側に保持する想定であり、サーバーAPIを必要としないため。

将来的に以下が必要になった場合、Rails API の追加を検討する。

- ログイン
- 複数端末でのデータ同期
- 機種変更時のデータ復元
- レシピ共有
- 画像アップロード

## GitHubリポジトリ

GitHubに以下のリポジトリを作成した。

- Repository name: `recipe-calculator`
- HTTPS: `https://github.com/officeutq/recipe-calculator.git`
- SSH: `git@github.com:officeutq/recipe-calculator.git`

## ローカルディレクトリ

ローカルに以下のディレクトリを作成した。

```txt
C:\dev\recipe-calculator
```

## Git初期化

空ディレクトリで `git add .` を実行したところ、以下のエラーが出た。

```txt
fatal: not a git repository (or any of the parent directories): .git
```

原因は、まだGit管理ディレクトリとして初期化されていなかったため。

以下を実行してGit管理を開始した。

```powershell
cd C:\dev\recipe-calculator
git init
git branch -M main
git remote add origin git@github.com:officeutq/recipe-calculator.git
```

## Vite + React + TypeScript の作成

以下を実行して、Vite + React + TypeScript 構成を作成した。

```powershell
npm create vite@latest . -- --template react-ts
npm install
npm run dev
```

## Git追加時の改行コード警告

`git add .` 実行時に以下のような警告が出た。

```txt
warning: in the working copy of '.gitignore', LF will be replaced by CRLF the next time Git touches it
```

これはWindows環境でよく出る改行コードの警告。

現時点では問題ないため、そのまま進める。

将来的に警告を抑えたい場合は、`.gitattributes` を追加して改行コードを統一する。

## 初期コミット

起動確認後、以下で初期コミットする。

```powershell
git add .
git commit -m "Initialize Vite React TypeScript app"
git push -u origin main
```

## docsディレクトリ

設計メモや導入手順は、プロジェクト直下の `docs` ディレクトリに配置する。

```txt
recipe-calculator
├─ docs
│  └─ setup.md
├─ public
├─ src
├─ package.json
├─ README.md
└─ vite.config.ts
```

# 基本手順

```txt
PowerShellで開発サーバー起動
↓
ブラウザで http://localhost:5173/ を開く
↓
コード修正
↓
ブラウザが自動更新される
```

起動コマンドは毎回これです。

```powershell
cd C:\dev\recipe-calculator
npm run dev
```

表示されたURLを開きます。

```txt
http://localhost:5173/
```

ViteはHot Reloadが効くので、`src/App.tsx` などを保存すると、基本的にブラウザ側へすぐ反映されます。

スマホ表示確認も、まずはPCブラウザの開発者ツールで十分です。

