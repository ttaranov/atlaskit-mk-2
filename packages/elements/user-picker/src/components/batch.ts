export function batchByKey<T>(
  callback: (key: string, args: T[][]) => void,
): (key: string, ...args: T[]) => void {
  const calls = {};
  return (key: string, ...args: T[]) => {
    if (!calls[key]) {
      setTimeout(() => {
        callback(key, calls[key]);
        delete calls[key];
      });
      calls[key] = [];
    }
    calls[key].push(args);
  };
}
