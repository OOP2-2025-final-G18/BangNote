/**
 * Nanostores の型定義 (簡易版)
 * ref: https://github.com/nanostores/nanostores/blob/main/atom/index.d.ts
 */

declare global {
  interface ReadableAtom<Value = any> {
    get(): Value;
    subscribe(listener: (value: Value) => void): () => void;
    listen(listener: (value: Value) => void): () => void;
  }

  interface WritableAtom<Value = any> extends ReadableAtom<Value> {
    set(value: Value): void;
    notify(): void;
  }

  type Store = ReadableAtom<any>;
  type AnyStore = ReadableAtom<any>;
  type StoreValue<S extends ReadableAtom> = S extends ReadableAtom<infer V>
    ? V
    : never;
  type StoreValues<Stores extends AnyStore[]> = {
    [Index in keyof Stores]: StoreValue<Stores[Index]>;
  };

  interface Effect {
    <OriginStore extends Store>(
      stores: OriginStore,
      cb: (value: StoreValue<OriginStore>) => void | VoidFunction,
    ): VoidFunction;
    /**
     * Subscribe for multiple stores. Also you can define cleanup function
     * to call on stores changes.
     *
     * ```js
     * const $enabled = atom(true)
     * const $interval = atom(1000)
     *
     * const cancelPing = effect([$enabled, $interval], (enabled, interval) => {
     *   if (!enabled) return
     *   const intervalId = setInterval(() => {
     *     sendPing()
     *   }, interval)
     *   return () => {
     *     clearInterval(intervalId)
     *   }
     * })
     * ```
     */
    <OriginStores extends AnyStore[]>(
      stores: [...OriginStores],
      cb: (...values: StoreValues<OriginStores>) => void | VoidFunction,
    ): VoidFunction;
  }

  /**
   * Create writable atom
   * @template Value
   * @param {Value} [initialValue]
   * @returns {WritableAtom<Value>}
   */
  function atom<Value>(initialValue?: Value): WritableAtom<Value>;

  /**
   * Mount callback for atom
   * @template Value
   * @param {ReadableAtom<Value>} store
   * @param {() => void | (() => void)} initialize
   */
  function onMount<Value>(
    store: ReadableAtom<Value>,
    initialize: () => void | (() => void),
  ): void;

  const effect: Effect;
}

declare module "https://esm.run/nanostores" {
  export * from globalThis;
}

export {};
