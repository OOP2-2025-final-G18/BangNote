# BangNote Frontend - コードの歩き方

## 📖 概要

BangNote は Web カスタム要素（Web Components）を使った MEMO・TODO 管理アプリケーションです.

このドキュメントでは, HTML/CSS/JS の知識があれば理解できるように, コードの構造とそれぞれのコンポーネントの役割を説明します.

## 🗺️ アプリケーション構造

![アプリケーション構成図](../spec/img/683864d05cb23a8bbef7bde4209cc669.webp)

BangNote は以下のカスタム要素（コンポーネント）で構成されています：

- `<bang-note-app>` - アプリ全体のコンテナ
- `<type-switch>` - MEMO/TODO モード切り替えタブ（画面左上）
- `<note-list>` - ノート一覧エリア（画面左側）
  - `<note-item>` - 個別のノートアイテム
- `<note-detail>` - ノート詳細エリア（画面右側）
  - `<note-detail-input>` - ノートの入力欄
  - `<note-detail-option>` - ノートのオプション（色選択, 削除, 締切日など）

## 🧩 Web Components とは？

Web Components は, HTML/CSS/JS だけでカスタムの HTML タグを作る技術です.  
Web プログラミング実習と, オブジェクト指向プログラミング Ⅰ の履修済みのメンバーのスキルに合わせ, あえてフレームワークを使わずに, 素の Web Components で実装しています.

```html
<!-- 普通の HTML タグのように使える -->
<note-list></note-list>
```

### 基本的な構造

```javascript
export class NoteList extends HTMLElement {
  constructor() {
    super();
    // Shadow DOM を有効化（スタイルの隔離）
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // このカスタム要素が HTML に挿入されたときに呼ばれる
    this.render();
  }

  render() {
    // Shadow DOM 内に HTML を描画
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/NoteList/style.css">
      <div class="grid">
        <!-- ノートアイテムを表示 -->
      </div>
    `;
  }
}

// カスタム要素として登録
customElements.define("note-list", NoteList);
```

**重要なポイント:**

- `HTMLElement` を継承してカスタム要素を作る
- `attachShadow()` でスタイルを隔離（他のコンポーネントと干渉しない）
- `connectedCallback()` は DOM に追加されたときに自動で呼ばれる
- `customElements.define()` でカスタムタグ名を登録

## 📂 ディレクトリ構造

```
frontend/
├── index.html              # エントリーポイント（HTML）
├── main.js                 # エントリーポイント（JS）
├── index.css               # グローバルスタイル
├── jsconfig.json           # エディター設定
├── assets/
│   └── note-sample.json    # サンプルデータ
├── components/             # コンポーネント
│   ├── BangNoteApp/        # ルートコンポーネント
│   ├── TypeSwitch/         # モード切り替えタブ
│   ├── NoteList/           # ノート一覧
│   ├── NoteItem/           # 個別ノート
│   └── NoteDetail/         # ノート詳細
│       ├── NoteDetailInput/    # 入力欄
│       └── NoteDetailOption/   # オプション
├── stores/                 # 状態管理（データストア）
│   ├── mode.js             # モード（MEMO/TODO）の管理
│   └── note.js             # ノートデータの管理
└── types/                  # 型定義（編集不要）
    ├── mode.d.ts           # モードの型
    ├── note.d.ts           # ノートの型
    └── nanostores.d.ts     # ストアの型
```

### 🔍 各ディレクトリの役割

#### `components/`

各コンポーネントのフォルダ構造は同じです：

```
NoteList/
├── index.js    # コンポーネントのロジック
└── style.css   # コンポーネント専用のスタイル
```

#### `stores/`

アプリ全体で共有するデータ（状態）を管理します.

**`mode.js`** - MEMO/TODO モードの管理

```javascript
import { $mode } from "../stores/mode.js";

// モードを取得
const currentMode = $mode.get(); // "MEMO" または "TODO"

// モードを変更
$mode.set("TODO");

// モードの変更を監視
$mode.subscribe((mode) => {
  console.log("モードが変更されました:", mode);
});
```

**`note.js`** - ノートデータの管理

```javascript
import { $notes, $noteDetail } from "../stores/note.js";

// ノート一覧を取得
const notes = $notes.get();

// 編集中のノートを取得
const currentNote = $noteDetail.get();

// ノート一覧の変更を監視
$notes.subscribe((notes) => {
  console.log("ノート一覧が更新されました:", notes);
});
```

#### `types/`

**⚠️ このフォルダのファイルは編集する必要はありません**

エディター（VS Code）での補完機能のための型定義ファイルです.

- `mode.d.ts` - モードの型（`"MEMO"` か `"TODO"`）
- `note.d.ts` - ノートの型（構造の定義）
- `nanostores.d.ts` - ストアの型

**💡 Tip:** 生成 AI に質問するときは, `*.d.ts` ファイルや `pr.md` を一緒に渡すと, より正確な回答が得られます！

## 🔄 データの流れ

```
ユーザー操作
    ↓
コンポーネント（イベント処理）
    ↓
ストア（$mode, $notes, $noteDetail）に変更を反映
    ↓
ストアの変更を監視している全コンポーネントが自動で再描画
    ↓
画面が更新される
```

### 例: モード切り替えの流れ

1. ユーザーが `<type-switch>` の MEMO タブをクリック
2. `TypeSwitch` コンポーネントが `$mode.set("MEMO")` を実行
3. `$mode` ストアが更新される
4. `$mode.subscribe()` で監視している全コンポーネントが通知を受ける
5. `<type-switch>`, `<note-list>`, `<note-detail>` が自動で再描画
6. 画面が MEMO モードに切り替わる

## 📝 各コンポーネントの責務

### `<bang-note-app>` - ルートコンポーネント

- **場所:** `components/BangNoteApp/`
- **役割:** アプリ全体のコンテナ. 他のコンポーネントを配置するだけ
- **担当者:** 全員が共通で使用

### `<type-switch>` - モード切り替え

- **場所:** `components/TypeSwitch/`
- **役割:** MEMO/TODO モードを切り替えるタブ UI
- **主な機能:**
  - タブクリックで `$mode` を変更
  - 選択中のタブに `data-active` 属性を付与

### `<note-list>` - ノート一覧

- **場所:** `components/NoteList/`
- **役割:** ノートの一覧を表示
- **主な機能:**
  - `$mode` に応じてノートをフィルタリング
  - `<note-item>` を複数表示

### `<note-item>` - 個別ノート

- **場所:** `components/NoteItem/`
- **役割:** 1 つのノートをプレビュー表示
- **主な機能:**
  - メモノートと TODO ノートで表示を切り替え
  - ノートの色を背景に反映
  - クリックで `$noteDetail` に選択を反映
  - 削除ボタン（ゴミ箱アイコン）

### `<note-detail>` - ノート詳細

- **場所:** `components/NoteDetail/`
- **役割:** `<note-detail-input>` と `<note-detail-option>` のコンテナ

### `<note-detail-input>` - 入力欄

- **場所:** `components/NoteDetail/NoteDetailInput/`
- **役割:** ノートの内容を入力・編集
- **主な機能:**
  - MEMO モード: テキストエリアでメモ入力
  - TODO モード: タスクリストの入力・編集・チェック
  - リアルタイムで `$noteDetail` に反映

### `<note-detail-option>` - オプション

- **場所:** `components/NoteDetail/NoteDetailOption/`
- **役割:** ノートのオプション設定
- **主な機能:**
  - 色選択（白・赤・青・緑）
  - 締切日/通知日の設定
  - ノートの保存ボタン

## 🚀 PR を出すときのポイント

作業ブランチ/Draft PR は既に作成済みです. 以下の流れで開発を進めてください.

### 1. main ブランチの追従（rebase）

作業を始める前に, main ブランチの最新の変更を取り込みます:

```bash
# main ブランチの最新を取得
git checkout main
git pull origin main

# 作業ブランチに戻って rebase
git checkout feat/あなたのブランチ名
git rebase main
```

**参考:** [Git のリベースを図で理解する](https://kdnakt.hatenablog.com/entry/2019/02/19/080000)

コンフリクトが発生した場合:

```bash
# コンフリクトを解決してファイルを保存
git add .
git rebase --continue
```

**💡 Tip:** rebase でうまくいかない場合は, [この記事](https://qiita.com/bnn848/items/a13d27cce0587e98091c) も参考にしてください.

### 2. pr.md を見ながら実装

`spec/pr.md` の自分の担当セクションを確認し, 実装する機能を確認します.

**コード内の TODO を探す:**

```bash
# VS Code の検索機能で以下を検索
// TODO (@あなたのGitHub ID)
```

例: `// TODO (@kouro0328)` で検索すると, あなたが実装すべき箇所が見つかります.

### 3. 開発サーバーで動作確認

`frontend/index.html` を VS Code で開き, 右上の虫眼鏡アイコンをクリックして Live Server を起動します.

ブラウザの開発者ツールで状態を確認:

```javascript
// コンソールで状態を確認
import { $mode } from "./stores/mode.js";
console.log("現在のモード:", $mode.get());

import { $notes } from "./stores/note.js";
console.log("ノート一覧:", $notes.get());
```

### 4. PR の description を書く

PR の description には, `spec/pr.md` の内容を含めてください. 特に確認事項のセクションはそのままコピーしてダブルチェックしてくれると嬉しいです.

```markdown
## 確認事項

- [ ] MEMO モードを選択すると, メモノートのみがノート一覧に表示される
- [ ] TODO モードを選択すると, TODO ノートのみがノート一覧に表示される
      ...
```

GitHub は Markdown をそのまま貼り付けられるので, チェックボックスも動作します！

### 5. Ready for Review を押す

動作確認が終わったら, 勇気を持って **Ready for Review** を押してください！

### 6. 質問がある場合

わからないことがあれば Teams で質問を受け付けています. 気軽に相談してください.

## ⚠️ 重要: ストアによる更新を心がける

データの変更は必ず **ストア (`$mode`, `$notes`, `$noteDetail`) を経由** してください.

```javascript
// ❌ 悪い例: DOM を直接操作
document.querySelector(".note-item").textContent = "新しいメモ";

// ✅ 良い例: ストアを更新
import { $noteDetail } from "../stores/note.js";
$noteDetail.set({
  type: "MEMO",
  content: "新しいメモ",
  option: { color: "#FFFFFF", date: null },
});
```

**理由:** のちのちストアの更新をもとにして, データベースに書き込む処理を追加する予定です. ストアを経由しない更新は, データベースに保存されません！

## 💡 よくある質問

### Q1. Web Components は初めてですが, どこから学べばいいですか？

A. 基本は普通の JavaScript です！以下の点だけ押さえれば OK：

- `class extends HTMLElement` でカスタム要素を作る
- `customElements.define()` で登録
- `connectedCallback()` で初期化
- `this.shadowRoot.innerHTML` で HTML を描画

参考: [MDN Web Components](https://developer.mozilla.org/ja/docs/Web/Web_Components)

### Q2. `$mode` や `$notes` の `$` は何ですか？

A. これは nanostores という状態管理ライブラリの変数です. `$` は「ストアですよ」という目印です.

### Q3. コンポーネント間でデータを共有するには？

A. `stores/` のストアを使います. 直接コンポーネント間でデータをやり取りしないでください.

```javascript
// ❌ 悪い例: コンポーネント間で直接データを渡す
noteList.sendDataTo(noteDetail);

// ✅ 良い例: ストアを経由
$noteDetail.set(selectedNote);
```

### Q4. アプリ全体の見た目を変えたいけど適用されない

A. Shadow DOM を使っているため, (コンポーネントの外に影響を与えるような) グローバル CSS は効きません.  
本当にアプリ全体に影響を与えたい場合は, `frontend/index.css` に書いてください.

### Q5. 生成 AI に質問するときのコツは？

A. 以下のファイルを一緒に渡すと効果的です：

- `types/*.d.ts` - データ構造の定義
- `spec/pr.md` - 実装する機能の詳細
- このファイル
- 該当コンポーネントのコード

## 📚 参考リンク

- [仕様書（spec.md）](../spec/spec.md)
- [PR 指示書（pr.md）](../spec/pr.md)
- [MDN - Web Components](https://developer.mozilla.org/ja/docs/Web/Web_Components)
- [MDN - Custom Elements](https://developer.mozilla.org/ja/docs/Web/Web_Components/Using_custom_elements)
- [Nanostores ドキュメント](https://github.com/nanostores/nanostores)

---

<p style="text-align: center; margin-top: 40px; font-size: 1.5rem; font-weight: bold;">
Happy Coding! 🎉
</p>
