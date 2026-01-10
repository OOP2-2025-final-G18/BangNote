import { atom } from "https://cdn.jsdelivr.net/npm/nanostores@0.10.3/+esm";

/**
 * ### モード (`MEMO` か `TODO` か) を管理するストア
 *
 * ---
 *
 * ここから値を取得すると, いつでも最新のモードを取得できます.
 * また, `subscribe` メソッドで変更を監視することもできます.
 *
 * また, ここから値を変更することもできます.  値を変更すると...
 * - 同じようにこのストアを参照している箇所に変更が伝播される
 * ようになります.
 *
 * @example
 * <caption>モードの取得例</caption>
 * ```js
 * import { $mode } from "../stores/mode.js";
 *
 * // NOTE: 呼び出した時点でのモードが取得できる
 * // `"MEMO"` か `"TODO"` のいずれかが返される
 * const mode = $mode.get();
 * ```
 *
 * @example
 * <caption>モードの監視例</caption>
 * ```js
 * import { $mode } from "../stores/mode.js";
 *
 * $mode.subscribe((mode) => {
 *  // NOTE: モードが変更されるたびに, 変更後のモードがコンソールに出力される
 *  console.log("モードが変更されました:", mode);
 * });
 * ```
 *
 * @example
 * <caption>モードの変更例</caption>
 * ```js
 * import { $mode } from "../stores/mode.js";
 *
 * // NOTE: モードが `"TODO"` に変更される
 * // 例えば `<type-switch>` コンポーネント内でモード切替ボタンが押されたときなどに使う
 * $mode.set("TODO");
 * ```
 *
 * @type {WritableAtom<Mode>}
 */
export const $mode = atom("MEMO");
