// @flow

// flowlint-next-line unclear-type:off
export default function compose(...funcs: any) {
  if (funcs.length === 0) {
    // flowlint-next-line unclear-type:off
    return (arg: any) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
