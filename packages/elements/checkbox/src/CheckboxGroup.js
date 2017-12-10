// @flow

import React, { PureComponent } from 'react';
import CheckboxGroup from './styled/CheckboxGroup';
import type { ChildrenType } from '../types';

//type Props = {|
/** Elements to be rendered as a checkbox group. These should be only Checkbox
 or CheckboxStateless elements. */
//  children: ChildrenType,
//|};
type Props = {};
type State = {};

export default class Checkbox extends PureComponent<Props, State> {
  props: Props;

  render() {
    const { children } = this.props;

    return <CheckboxGroup>{children}</CheckboxGroup>;
  }
}
