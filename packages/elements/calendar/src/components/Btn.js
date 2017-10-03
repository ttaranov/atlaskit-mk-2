// @flow

import React, { type Node } from 'react';
import Button from '@atlaskit/button';

type Props = {
  children: Node,
};

export default class extends React.Component<Props> {
  props: Props;
  render() {
    return (
      <Button appearance="subtle" spacing="none" tabIndex={-1}>
        {this.props.children}
      </Button>
    );
  }
}
