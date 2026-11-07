# gypsy-dev

Next.js + Tailwind CSS + Contentlayer2 で構築した個人ブログです。ベースは Tailwind Nextjs Starter Blog（Pliny）を利用し、必要な部分をカスタマイズしています。

デモ（運用中）: https://dev-blog-gypsyr.vercel.app/

参考テーマ: https://github.com/timlrx/tailwind-nextjs-starter-blog

## 主な機能

- 記事執筆: `MDX`（フロントマター対応）
- 一覧/詳細/タグ: 記事一覧、タグ一覧、タグ別ページ
- 目次/所要時間: 自動 TOC 抽出、推定読了時間
- コード/数式: Prism ハイライト、KaTeX（`$...$`/`$$...$$`）
- 画像最適化: Next.js `Image` 統合
- ダークモード: `next-themes` によるテーマ切替
- コメント: Giscus（GitHub Discussions）
- ニュースレター: Buttondown（任意）
- 生成物: RSS、サイトマップ、検索用 JSON（設定で有効化）

## 技術スタック

- フレームワーク: `Next.js 16.4.5 (Pages Router)`
- 言語: `TypeScript`
- スタイル: `Tailwind CSS`
- コンテンツ: `Contentlayer2`（`data/` 以下の MDX を型安全に取り込み）
- ビルドスクリプト: `Node.js`（`scripts/*.mjs`）

## ディレクトリ構成（抜粋）

- `pages/`: ルーティング（トップ、ブログ、タグ、静的ページ）
- `components/`: UI コンポーネント（SEO、レイアウト、タグ等）
- `layouts/`: 記事/ページのレイアウト
- `data/`: サイトデータとコンテンツ
  - `data/blog/`: 記事（MDX）
  - `data/authors/`: 著者情報（MDX）
  - `data/siteMetadata.js`: タイトル/URL/コメント設定などサイト共通設定
- `public/`: 画像や静的ファイル
- `css/`: Tailwind, Prism のスタイル
- `contentlayer.config.ts`: Contentlayer 設定

注: ルート直下の `blog/` にある MDX はビルド対象外です。記事は `data/blog/` に追加してください。

## セットアップ

前提: Node.js 22.23.4以上の22系（`.nvmrc`参照）とnpm。古いNodeでのインストールは`.npmrc`で拒否します。

1. 依存関係のインストール

```bash
npm ci
```

2. 環境変数の設定（任意機能を使う場合）

```bash
cp .env.example .env.local
```

- コメント（Giscus）やニュースレター（Buttondown）を使う場合、`.env.local` に各種キーを設定してください。
- 必要なキーは `.env.example` を参照。

3. サイト情報の設定

- `data/siteMetadata.js` の各項目（`title`, `siteUrl`, `github`, `comments`, `newsletter` など）を用途に合わせて編集します。

## 開発 / ビルド

- 開発サーバ起動: `npm run dev`
- 本番ビルド: `npm run build`
- 本番サーバ起動: `npm run serve`
- Lint: `npm run lint`
- 購読APIのテスト（外部送信なし）: `npm test`
- ビルド後の公開記事・下書き非公開・RSS等の検証: `npm run verify`
- バンドル解析: `npm run analyze`

package.json（抜粋）

```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "contentlayer2 build && next build --webpack && node -r esbuild-register ./scripts/postbuild.mjs",
    "serve": "next start",
    "analyze": "cross-env ANALYZE=true next build --webpack",
    "lint": "eslint . --max-warnings=0"
  }
}
```

## 記事の追加（MDX）

1. `data/blog/` に `my-post.mdx` を追加

```mdx
---
title: 記事タイトル
date: 2025-09-01
tags: [nextjs, tailwind]
summary: 記事の要約
draft: false
images: ['/static/images/cover.png']
authors: []
---

本文は MDX で記述できます。
```

2. 新規記事は `authors: []` を明示し、個人の著者情報を取り込みません。個人情報の扱いは `AGENTS.md` を優先します。

3. 数式（KaTeX）、コードブロック（Prism）、脚注/引用などは既にプラグイン済みです。

## コメント / ニュースレター

- コメント: `data/siteMetadata.js` → `comments.provider = 'giscus'`。`.env.local` に `NEXT_PUBLIC_GISCUS_*` を設定。
- ニュースレター: `newsletter.provider = 'buttondown'`。`.env.local` に Buttondown のキーを設定。

詳細は `.env.example` と各サービスのドキュメントを参照してください。

## デプロイ

- 推奨: Vercel（Next.js 公式）
- `data/siteMetadata.js` の `siteUrl` を公開 URL に合わせて設定
- 必要な環境変数（Giscus/Newsletter 等）を Vercel の Project Settings に登録

## よくあるハマりどころ / 注意

- 記事の配置場所: 必ず `data/blog/` に置いてください（`contentlayer.config.ts` の `contentDirPath` が `data` のため）。
- 画像パス: `/public` 配下に置き、先頭 `/` からのパスで参照します（例: `/static/images/xxx.png`）。
- ローカルでコメントは表示されない場合があります（GitHub 認証や公開設定が必要）。

## クレジット

- Theme/基盤: Tailwind Nextjs Starter Blog（Pliny） by timlrx

ライセンスは元テーマに準じます（本リポジトリでのライセンス明記が必要なら後日追記します）。
