import * as React from 'react';
import { PureComponent } from 'react';

export interface Props {
  focus?: () => null;
}

export default class FocusableButtonWrapper extends PureComponent<Props, {}> {
  render() {
    return <div tabIndex={0}>{this.props.children}</div>;
  }
}
