// @flow

export function add<P: {}>(fn: (props: P) => number, addend: number) {
  return (props: P) => fn(props) + addend;
}

export function subtract<P: {}>(fn: (props: P) => number, subtrahend: number) {
  return (props: P) => fn(props) - subtrahend;
}

export function multiply(fn: (props: {}) => number, factor: number) {
  return (props: {}) => fn(props) * factor;
}

export function divide(fn: (props: {}) => number, divisor: number) {
  return (props: {}) => fn(props) / divisor;
}
