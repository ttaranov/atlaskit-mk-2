// @flow

// flowlint-next-line unclear-type:off
export function add<P: Object>(fn: (props: P) => number, addend: number) {
  return (props: P) => fn(props) + addend;
}

// flowlint-next-line unclear-type:off
export function subtract<P: Object>(
  fn: (props: P) => number,
  subtrahend: number,
) {
  return (props: P) => fn(props) - subtrahend;
}

// flowlint-next-line unclear-type:off
export function multiply<P: Object>(fn: (props: P) => number, factor: number) {
  return (props: P) => fn(props) * factor;
}

// flowlint-next-line unclear-type:off
export function divide<P: Object>(fn: (props: P) => number, divisor: number) {
  return (props: P) => fn(props) / divisor;
}
