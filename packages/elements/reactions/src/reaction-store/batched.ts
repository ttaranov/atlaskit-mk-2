export function batch<T>(callback: (args: T[][]) => void) {
  let calls: T[][] = [];
  return (...args: T[]) => {
    if (calls.length === 0) {
      setTimeout(() => {
        callback(calls);
        calls = [];
      });
      calls = [];
    }
    calls.push(args);
  };
}

export function batchByKey<T>(
  callback: (key: string, args: T[][]) => void,
): (key: string, ...args: T[]) => void {
  const calls = {};
  return (key: string, ...args: T[]) => {
    if (!calls[key]) {
      setTimeout(() => {
        callback(key, calls[key]);
        calls[key] = undefined;
      });
      calls[key] = [];
    }
    calls[key].push(args);
  };
}
