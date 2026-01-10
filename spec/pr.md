#

## `feat/note-list`

- 作業者: @rio49k (K24064)

### 概要

ノート一覧 (`<note-list>`) と個別ノートアイテム (`<note-item>`) の表示・フィルタリング機能を実装する.

### やること

画面左側のノート一覧機能を実装します. MEMO/TODO モードに応じたノートのフィルタリングと, 各ノートアイテムの表示改善を行います.

1. モード別フィルタリング機能 (`frontend/components/NoteList/index.js`)

   - `$mode` ストアの値に応じてノート一覧を絞り込む
   - MEMO モード時は `type: "MEMO"` のノートのみ表示
   - TODO モード時は `type: "TODO"` のノートのみ表示
   - （コード内で TODO コメントあり）

2. メモノートの表示改善 (`frontend/components/NoteItem/index.js`)

   - メモノートのプレビュー表示を実装
   - 長文対応やフォントサイズ調整
   - 背景色の適用/通知日の表示
   - スタイル調整は `frontend/components/NoteItem/style.css` で行う
   - （コード内で TODO コメントあり）

3. TODO ノートの表示改善 (`frontend/components/NoteItem/index.js`)

   - タスクをリスト形式で表示
   - 完了状態をアイコンで視覚化（チェックボックスアイコンなど）
   - 背景色の適用/締切日の表示
   - スタイル調整は `frontend/components/NoteItem/style.css` で行う
   - （コード内で TODO コメントあり）

4. ノートの選択機能 (`frontend/components/NoteItem/index.js`)

   - クリックでノートを選択し, `$noteDetail` ストアに反映
   - 選択中のノートは視覚的に強調表示  
      (現在, 青と赤の枠が付いていますが, あれはメモと TODO のスタリングテストなので, 消しちゃって大丈夫です. 背景色はノートのデータ内で定義されていますので, ノート一覧の背景色は変えないほうが良いでしょう.)
   - スタイル調整は `frontend/components/NoteItem/style.css` で行う

必要なファイル:

- `frontend/components/NoteList/index.js` - ノート一覧のフィルタリング
- `frontend/components/NoteList/style.css` - ノート一覧のスタイル
- `frontend/components/NoteItem/index.js` - 個別ノートの表示
- `frontend/components/NoteItem/style.css` - 個別ノートのスタイル

### PR 前の確認事項

- [ ] MEMO モードを選択すると, メモノートのみがノート一覧に表示される
- [ ] TODO モードを選択すると, TODO ノートのみがノート一覧に表示される
- [ ] メモノートのプレビューが適切に表示される（長文時も読みやすい）
- [ ] TODO ノートのタスクがリスト形式で表示される
- [ ] TODO ノートの各タスクの完了状態がアイコンで視覚的に確認できる

## `feat/note-detail-input`

- 作業者: @uiro0120 (K24009)

### 概要

ノート詳細の入力エリア (`<note-detail-input>`) を実装し, MEMO/TODO の入力・編集機能を提供する.

### やること

画面右側のノート詳細エリアのうち, 入力部分を実装します. MEMO モードと TODO モードそれぞれに適した入力 UI を提供します.

実装する機能:

1. メモノートの入力機能 (`frontend/components/NoteDetail/NoteDetailInput/index.js#renderMemoNote`)

   - `$noteDetail` ストアの `option.color` に応じた背景色の適用
   - テキストエリアでのメモ入力・編集
   - リアルタイムで `$noteDetail` ストアへの反映
   - スタイル調整は `frontend/components/NoteDetail/NoteDetailInput/style.css` で行う

2. TODO ノートの入力機能 (`frontend/components/NoteDetail/NoteDetailInput/index.js#renderTodoNote`)

   - `$noteDetail` ストアの `option.color` に応じた背景色の適用
   - タスクの追加・編集・削除
   - タスクのチェックボックス操作
   - 各タスクのテキスト編集
   - リアルタイムで `$noteDetail` ストアへの反映
   - スタイル調整は `frontend/components/NoteDetail/NoteDetailInput/style.css` で行う
   - 改行で新しいタスクを追加
   - 並び替え機能は任意

必要なファイル:

- `frontend/components/NoteDetail/NoteDetailInput/index.js` - 入力機能
- `frontend/components/NoteDetail/NoteDetailInput/style.css` - 入力エリアのスタイル
- `frontend/stores/note.js` - `$noteDetail` ストアとの連携

### PR 前の確認事項

- [ ] MEMO モードでテキストエリアに入力した内容が `$noteDetail` ストアに反映される
- [ ] TODO モードで新しいタスクを追加できる
- [ ] TODO モードでタスクのテキストを編集できる
- [ ] TODO モードでタスクを削除できる
- [ ] TODO モードでタスクのチェックボックスをクリックすると完了状態が切り替わる
- [ ] TODO モードにて Enter キー押下で新しいタスクが追加される

## `feat/note-detail-option`

- 作業者: @Okazawa0508 (K24036)

### 概要

ノート詳細のオプション機能 (`<note-detail-option>`) を実装し, 色選択・削除・締切日設定などの機能を提供する.

### やること

画面右側のノート詳細エリアのうち, オプション操作部分を実装します. ノートの見た目や状態を管理する各種機能を提供します.

実装する機能:

1. 色選択機能 (`frontend/components/NoteDetail/NoteDetailOption/index.js`)

   - 4 色（白・赤・青・緑）のカラーパレット表示
   - クリックで選択された色を `$noteDetail.option.color` に反映
   - 選択中の色を視覚的に表示
   - スタイル調整は `frontend/components/NoteDetail/NoteDetailOption/style.css` で行う

2. 締切/通知日設定機能 (`frontend/components/NoteDetail/NoteDetailOption/index.js`)

   - UI イメージあるように, チェックボックスとともに,
   - 日付選択 UI（input type="date" または カレンダーピッカー）
   - 選択された日付を `$noteDetail.option.date` に反映
   - 締切日のクリア機能
   - スタイル調整は `frontend/components/NoteDetail/NoteDetailOption/style.css` で行う

3. タスクの作成/保存ボタン (`frontend/components/NoteDetail/NoteDetailOption/index.js`)

   - 画面右下のアクションボタン
   - `+` アイコンや飛行機のアイコンなどで, ノートの保存アクションを示す
   - 既存ノートの編集時は保存, 新規ノート作成時は作成アクションを実行
   - それぞれのアイコンは任せます！

必要なファイル:

- `frontend/components/NoteDetail/NoteDetailOption/index.js` - オプション機能
- `frontend/components/NoteDetail/NoteDetailOption/style.css` - オプションエリアのスタイル
- `frontend/stores/note.js` - `$noteDetail` と `$notes` ストアとの連携

### PR 前の確認事項

- [ ] 色パレットから色を選択すると, ノートの色が変更される
- [ ] 選択中の色が視覚的に確認できる
- [ ] メモモードで通知日を設定できる
- [ ] TODO モードで締切日を設定できる

## `feat/type-switch`

- 作業者: @kouro0328 (K19117)

### 概要

MEMO/TODO モードの切り替え機能 (`<type-switch>`) を実装し, タブ UI でのモード切り替えを提供する.

### やること

画面左上のモード切り替えタブを実装します. ユーザーのタブクリックに応じてアプリ全体のモードを切り替える機能を提供します.

実装する機能:

1. タブのアクティブ状態切り替え (`frontend/components/TypeSwitch/index.js`)

   - `$mode` ストアの変更を監視
   - 選択中のモードに対応するタブに `data-active` 属性を付与
   - 非選択タブから `data-active` 属性を削除
   - スタイル調整は `frontend/components/TypeSwitch/style.css` で行う
   - （コード内で TODO コメントあり）

2. タブクリック時のモード変更 (`frontend/components/TypeSwitch/index.js`)

   - MEMO タブクリック時に `$mode.set("MEMO")` を実行
   - TODO タブクリック時に `$mode.set("TODO")` を実行
   - クリックイベントを適切にハンドリング
   - （コード内で TODO コメントあり）

3. 視覚的フィードバック
   - アクティブタブの強調表示
   - ホバー時のスタイル変更
   - クリック可能であることの明示

実装方針:

- タブの状態更新は `$mode.subscribe` 内で行い, クリックハンドラーでは `$mode.set()` のみを実行する
- これにより, 状態管理を一元化し, 単方向データフローを実現する
- `$mode` ストアの使用例は `frontend/stores/mode.js` を参照

必要なファイル:

- `frontend/components/TypeSwitch/index.js` - モード切り替え機能
- `frontend/components/TypeSwitch/style.css` - タブのスタイル
- `frontend/stores/mode.js` - `$mode` ストアとの連携

### PR 前の確認事項

- [ ] MEMO タブをクリックすると, モードが MEMO に切り替わる
- [ ] TODO タブをクリックすると, モードが TODO に切り替わる
- [ ] 選択中のタブに `data-active` 属性が付与されている
- [ ] 非選択タブには `data-active` 属性が付与されていない
- [ ] 選択中のタブが視覚的に強調表示される
- [ ] モード切り替え時に, 他のコンポーネント（ノート一覧, ノート詳細）が適切に更新される

<!-- 学籍番号 名前 GitHub ID
K19117 渡邉　祐太朗 kouro0328
K24009 池上　正悟 uiro0120
K24036 岡澤　有真 Okazawa0508
K24064 近藤　稟桜 rio49k
K24132 町田　渉 wappon28dev -->
