// @flow
import React, { PureComponent, type Node } from 'react';

import InitialLoadingElement from '../styled/InitialLoading';

type Props = {
  children: Node,
};

export default class InitialLoading extends PureComponent<Props, {}> {
  render() {
    return (
      <InitialLoadingElement aria-live="polite" role="status">
        {this.props.children}
      </InitialLoadingElement>
    );
  }
}
