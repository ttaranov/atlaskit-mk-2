// @flow

const emptyObj = {};

export default function callOrPass<A, B>(maybeFn: A => B | any, props: A): * {
  return typeof maybeFn === 'function' ? maybeFn(props || emptyObj) : maybeFn;
}
