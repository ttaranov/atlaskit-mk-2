//@flow

import React, { type Node } from 'react';
import { Header } from './common';

export type Props = {
  strings: {
    title: Node,
    description: Node,
  },
  isDismissable: boolean,
  canOptOut: boolean,
  onDismiss: () => void,
  onOptOut: () => void,
};

export default function Thankyou({
  strings,
  isDismissable,
  canOptOut,
  onDismiss,
  onOptOut,
}: Props): Node {
  return (
    <div>
      <Header
        title={strings.title}
        isDismissable={isDismissable}
        canOptOut={canOptOut}
        onDismiss={onDismiss}
        onOptOut={onOptOut}
      />
      <p>{strings.description}</p>
    </div>
  );
}
