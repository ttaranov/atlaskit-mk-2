// @flow
/**
 * Just a dummy component with different property definitions.
 * Its helpful for test the <Props /> component.
 * We will remove this file after make sure we cover all cases.
 */
import * as React from 'react';

type A = {
  foo: any,
  bar: {
    baz: number
  }
};

type Props = {
  name: string,
  age: number,
  isRequired: boolean,
  optionalProp?: number | string,
  alignment: 'start' | 'end',
  size: 1 | 2 | '3' | string,
  enum: {
    Diamonds: 1,
    Clubs: 2,
    Hearts: 3,
    Spades: 4
  },
  children: React.Node,
  a: A,
  prop: mixed,
  bar: ?number,
  v: void,
  arr1: Array<string>,
  arr2: Array<number | string>,
  func1: (string, number) => string,
  func2: (name: string, age: number) => void
};

export default class TagGroup extends React.PureComponent<Props> {
}
