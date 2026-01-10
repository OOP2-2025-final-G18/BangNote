declare global {
  type NoteOption = {
    /**
     * ノートの色 (CSS カラー形式)
     *
     * @example "red", "#ff0000", "rgb(255, 0, 0)" など
     */
    color: string;
    /**
     * 日付 (ISO 8601 Date String 形式) or null (未設定)
     *
     * - メモノート: 通知日
     * - TODOノート: 締切日
     */
    date: string | null;
  };

  type NoteMeta = {
    /**
     * ノートの一意なID
     */
    id: string;

    /**
     * 作成日時 (ISO 8601 Date String 形式)
     */
    createdAt: string;
  };

  type ContentMemo = {
    type: "MEMO";
    /**
     * メモの内容
     */
    content: string;
  };
  type ContentTodo = {
    type: "TODO";
    content: ReadonlyArray<{
      /**
       * タスクの内容
       */
      text: string;
      /**
       * 完了フラグ = チェックボックスの状態
       */
      completed: boolean;
    }>;
  };
  type Content = ContentMemo | ContentTodo;

  /**
   * ### ノートの型
   *
   * ---
   *
   * ノートは大きく分けてメモノートとTODOノートの2種類があります.
   *
   * - メモノート (`type: "MEMO"`) は自由形式のテキストを保存するためのノート
   * - TODOノート (`type: "TODO"`) はチェックリスト形式でタスクを管理するためのノート
   *
   */
  type Note = Content & {
    option: NoteOption;
    meta: NoteMeta;
  };

  /**
   * ### ノートのメタ情報の型 (MEMO か TODO の指定あり)
   *
   * ---
   *
   * - `NoteWith<"MEMO">` はメモノート型 (`MemoNote`) のみを表す型です.
   * - `NoteWith<"TODO">` はTODOノート型 (`TodoNote`) のみを表す型です.
   */
  type NoteWith<T extends Note["type"]> = Extract<Note, { type: T }>;

  /**
   * ### 現在編集中のノートの型
   *
   * ---
   *
   * `Note` 型から `meta` プロパティを部分的に省略可能にした型です.
   * ノートの編集中には `meta` 情報の一部 (例: `id`, `createdAt`) がまだ確定していない場合があるため,
   * これらのプロパティは無くても OK です.
   */
  type NoteDetail = Content & {
    option: NoteOption;
    meta: Partial<NoteMeta>;
  };

  /**
   * ### 現在編集中のノートの型 (MEMO か TODO の指定あり)
   *
   * ---
   *
   * - `NoteDetailWith<"MEMO">` はメモノート型 (`MemoNote`) のみを表す型です.
   * - `NoteDetailWith<"TODO">` はTODOノート型 (`TodoNote`) のみを表す型です.
   */
  type NoteDetailWith<T extends Note["type"]> = Extract<
    NoteDetail,
    { type: T }
  >;
}

export {};
