import { filter, map } from "already";

export {};

type ChainPromise<T> = Promise<T> & {
  [K in keyof T as `then${Capitalize<string & K>}`]: T[K] extends (...args: any) => any
    ? (...args: Parameters<T[K]>) => ChainPromise<ReturnType<T[K]>>
    : never;
};

declare global {
  interface Promise<T> {
    chain(): ChainPromise<T>;
  }
}

Promise.prototype.chain = function chain() {
  return new Proxy(this, {
    get(target: Promise<any>, p: string | symbol, receiver: any): any {
      if (typeof p === "string" && p.startsWith("then") && p.length > 4) {
        const key = p.substring(4, 5).toLowerCase() + p.substring(5);
        return (...args: any) => target.then((result) => result[key](...args)).chain();
      }
      return Reflect.get(target, p).bind(target);
    },
  }) as any;
};

describe("chain", () => {
  it("just then", async () => {
    const promise = (async () => [1, 2, 3])();
    const result = await promise
      .then((list) => list.filter((i) => i >= 2))
      .then((list) => list.map((i) => i * 2))
      .then((list) => list.filter((i) => i > 4));
    expect(result).toEqual([6]);
  });

  it("with already", async () => {
    const promise = (async () => [1, 2, 3])();
    const result = await promise
      .then(filter((i) => i >= 2))
      .then(map((i) => i * 2))
      .then(filter((i) => i > 4));
    expect(result).toEqual([6]);
  });

  it("with promise chain", async () => {
    const promise = (async () => [1, 2, 3])();
    const a = promise.chain();
    const b = a.thenFilter((i) => i >= 2);
    const c = b.thenMap((i) => i * 2);
    const result = await promise
      .chain()
      .thenFilter((i) => i >= 2)
      .thenMap((i) => i * 2)
      .thenFilter((i) => (i as any) > 4);
    expect(result).toEqual([6]);
  });
});
