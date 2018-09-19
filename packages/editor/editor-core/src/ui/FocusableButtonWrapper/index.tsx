import * as React from 'react';
import { PureComponent } from 'react';

export interface Props {
  focus?: () => null;
}

export default class FocusableButtonWrapper extends PureComponent<Props, {}> {
  render() {
    return <div>{this.props.children}</div>;
  }
}
