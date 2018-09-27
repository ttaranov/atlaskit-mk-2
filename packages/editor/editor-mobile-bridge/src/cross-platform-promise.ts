import { toNativeBridge } from './editor/web-to-native';

const pendingPromises: Map<string, Holder<any>> = new Map<
  string,
  Holder<any>
>();
export let counter: number = 0;

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
  args?: string,
): SubmitPromiseToNative<T> {
  const holder: Holder<T> = createHolder();
  const uuid = counter++ + '';
  pendingPromises.set(uuid, holder);
  return {
    submit(): Promise<T> {
      toNativeBridge.submitPromise(name, uuid, args);
      return holder.promise
        .then(data => {
          pendingPromises.delete(uuid);
          return data;
        })
        .catch(data => {
          pendingPromises.delete(uuid);
          return Promise.reject(data);
        });
    },
  };
}

function createHolder<T>() {
  let holder: Holder<T> = new Holder<T>();
  holder.promise = new Promise<T>((resolve, reject) => {
    holder.resolve = data => resolve(data);
    holder.reject = () => reject();
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

// expose this function for testing
export function setCounter(value: number) {
  counter = value;
}
