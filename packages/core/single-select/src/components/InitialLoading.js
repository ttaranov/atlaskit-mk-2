// @flow
import React, { PureComponent, type Node } from 'react';

import InitialLoadingElement from '../styled/InitialLoading';

type Props = {
  children: Node,
};

export default function InitialLoading (props) {
  render() {
    return (
      <InitialLoadingElement aria-live="polite" role="status">
        {this.props.children}
      </InitialLoadingElement>
    );
  }
}
