// @flow
/**
 * Just a dummy component with different property definitions.
 * Its helpful for test the <Props /> component.
 * We will remove this file after make sure we cover all cases.
 */
import * as React from 'react';

type A = {
  foo: any,
};

type Props = {
  name: string,
  age: number,
  isRequired: boolean,
  optionalProp?: number | string,
  alignment: 'start' | 'end',
  children: React.Node,
  a: A
};

export default class TagGroup extends React.PureComponent<Props> {
}
