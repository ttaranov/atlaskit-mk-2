// @flow

import callOrPass from './callOrPass';

export default function callOrPassAll<A, B>(
  maybeFns: { [string]: (A) => B | any },
  props: A,
): * {
  const temp = {};
  for (const key in maybeFns) {
    temp[key] = callOrPass(maybeFns[key], props);
  }
  return temp;
}
