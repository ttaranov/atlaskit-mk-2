// @flow

import React, { Component } from 'react';
import CheckboxGroup from './styled/CheckboxGroup';
import type { ChildrenType } from '../types';

type Props = {|
  /** Elements to be rendered as a checkbox group. These should be only Checkbox
   or CheckboxStateless elements. */
  children: ChildrenType,
|};

export default class Checkbox extends Component<Props, void> {
  props: Props;

  render() {
    const { children } = this.props;

    return <CheckboxGroup>{children}</CheckboxGroup>;
  }
}
