// @flow

import React, { type Node } from 'react';
import Button from '@atlaskit/button';

type Props = {
  onClick?: () => void,
  children?: Node,
};

export default (props: Props) => (
  <Button
    appearance="subtle"
    onClick={props.onClick}
    spacing="none"
    tabIndex={-1}
    iconBefore={props.children}
  />
);
