import { atom, onMount } from "https://esm.run/nanostores";
import { $mode } from "./mode.js";
import noteSample from "../assets/note-sample.json" with { type: "json" };

/**
 * ### ノート一覧を管理するストア
 *
 * ---
 *
 * ここから値を取得すると, いつでも最新のノート一覧を取得できます.
 * また, `subscribe` メソッドで変更を監視することもできます.
 *
 * また, ここから値を変更することもできます.  値を変更すると...
 *
 * - 同じようにこのストアを参照している箇所に変更が伝播される
 * - 遅れてデータベースにも変更が保存される
 *
 * ようになります.
 *
 * @example
 * <caption>ノート一覧の取得例</caption>
 * ```js
 * import { $notes } from "../stores/note.js";
 *
 * // 呼び出した時点でのノート一覧が取得できる
 * const notes = $notes.get();
 * ```
 *
 * @example
 * <caption>ノート一覧の監視例</caption>
 * ```js
 * import { $notes } from "../stores/note.js";
 *
 * $notes.subscribe((notes) => {
 *  // NOTE: ノート一覧が変更されるたびに, 変更後のノート一覧がコンソールに出力される
 *  console.log("ノート一覧が変更されました:", notes);
 * });
 * ```
 *
 *
 * @example
 * <caption>ノート一覧の変更例</caption>
 * ```js
 * import { $notes } from "../stores/note.js";
 * const notes = $notes.get();
 * const newNote = {
 *   type: "MEMO",
 *   content: "サンプルメモ",
 *   option: {
 *     color: "#FFEE93",
 *     date: "2025-12-31",
 *   },
 *   meta: {
 *     id: "newnoteid1234567890",
 *     createdAt: "2025-10-01T10:00:00Z",
 *   },
 * };
 *
 * // NOTE: ノート一覧に新しいノートが追加される
 * $notes.set([...notes, newNote]);
 * ```
 * @type {WritableAtom<ReadonlyArray<Note>>}
 **/
export const $notes = atom([]);

/**
 * ### ノート詳細の初期値
 *
 * ---
 *
 * モードの変更時などでノート詳細に初期値をセットするために使う
 *
 * @type {{ [mode in Mode]: NoteDetailWith<mode> }}
 */
const noteDetailInit = {
  MEMO: {
    type: "MEMO",
    content: "",
    option: {
      color: "#FFFFFF",
      date: null,
    },
  },
  TODO: {
    type: "TODO",
    content: [
      {
        text: "BangNote: シンプルな Web ノートアプリ",
        completed: false,
      },
      {
        text: "SheBang でコマンドのようにモードを切り替え",
        completed: false,
      },
      {
        text: "",
        completed: false,
      },
    ],
    option: {
      color: "#FFFFFF",
      date: null,
    },
  },
};

/**
 * ### 現在編集中のノートを管理するストア
 *
 * ---
 *
 * ここから値を取得すると, いつでも最新の編集中のノートを取得できます.
 * また, `subscribe` メソッドで変更を監視することもできます.
 *
 * また, ここから値を変更することもできます.  値を変更すると...
 *
 * - 同じようにこのストアを参照している箇所に変更が伝播される
 *
 * ようになります.
 *
 * @example
 * <caption>編集中ノートの取得例</caption>
 * ```js
 * import { $note } from "../stores/note.js";
 *
 * // 呼び出した時点での編集中ノートが取得できる
 * const note = $note.get();
 * ```
 *
 * @example
 * <caption>編集中ノートの監視例</caption>
 * ```js
 * import { $note } from "../stores/note.js";
 *
 * $note.subscribe((note) => {
 *  // NOTE: 編集中ノートが変更されるたびに, 変更後のノートがコンソールに出力される
 *  console.log("編集中ノートが変更されました:", note);
 * });
 * ```
 *
 * @example
 * <caption>編集中ノートの変更例</caption>
 * ```js
 * import { $note } from "../stores/note.js";
 *
 * const newNote = {
 *   type: "TODO",
 *   content: "新しいやること",
 *   option: {
 *     color: "#A0E7E5",
 *     date: "2026-01-15",
 *   },
 *   meta: {
 *     id: "editingnoteid0987654321",
 *     createdAt: "2025-10-02T15:30:00Z",
 *   },
 * };
 * ```
 *
 * @type {WritableAtom<NoteDetail>}
 */
export const $noteDetail = atom(noteDetailInit.MEMO);

/**
 * ### 選択中のノートIDを管理するストア
 * @type {WritableAtom<string | null>}
 */
export const $selectedNoteId = atom(null);

$mode.subscribe((mode) => {
  console.log("  -> [$noteDetail] モード変更検知:", mode);
  $noteDetail.set(noteDetailInit[mode]);
});

// TODO (@wappon28dev): 起動時に, 初期データを DB から読み込む処理を書く
onMount($notes, () => {
  const data = noteSample;
  console.log("<- [init] ノート一覧を初期化:", data);
  $notes.set(data);
});

// TODO (@wappon28dev): 編集中のノートが変更されたときに, DB に保存する処理を書く.  `$notes` も更新する必要があるだろう.
$noteDetail.subscribe((_) => {});
