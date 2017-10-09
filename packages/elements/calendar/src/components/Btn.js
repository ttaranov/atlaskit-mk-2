// @flow

import React, { type Node } from 'react';
import Button from '@atlaskit/button';

type Props = {
  children: Node,
};

export default (props: Props) => (
  <Button appearance="subtle" spacing="none" tabIndex={-1}>
    {props.children}
  </Button>
);
