import { toNativeBridge } from './web-to-native';

const pendingPromises: Map<string, Holder<any>> = new Map<
  string,
  Holder<any>
>();
let counter: number = 0;

class Holder<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: () => void;
}

export interface SubmitPromiseToNative<T> {
  submit(): Promise<T>;
}

export function createPromise<T>(
  name: string,
  args: string,
): SubmitPromiseToNative<T> {
  const holder: Holder<T> = createHolder();
  const uuid = counter++ + '';
  pendingPromises.set(uuid, holder);
  holder.promise
    .then(() => pendingPromises.delete(uuid))
    .catch(() => pendingPromises.delete(uuid));
  return {
    submit(): Promise<T> {
      toNativeBridge.submitPromise(name, uuid, args);
      return holder.promise;
    },
  };
}

function createHolder<T>() {
  let holder: Holder<T> = new Holder<T>();
  holder.promise = new Promise<T>((resolve, reject) => {
    holder.resolve = resolve;
    holder.reject = reject;
  });
  return holder;
}

export function resolvePromise<T>(uuid: string, resolution: T) {
  let holder: Holder<T> | undefined = pendingPromises.get(uuid);
  if (holder) {
    holder.resolve(resolution);
  }
}

export function rejectPromise<T>(uuid: string) {
  let holder: Holder<T> | undefined = pendingPromises.get(uuid);
  if (holder) {
    holder.reject();
  }
}
