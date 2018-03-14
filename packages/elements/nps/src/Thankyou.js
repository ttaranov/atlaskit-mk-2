//@flow

import React, { type Node } from 'react';
import { Header, Description } from './common';

export type Props = {
  messages: {
    title: Node,
    description: Node,
  },
  isDismissible: boolean,
  canOptOut: boolean,
  onDismiss: () => void,
  onOptOut: () => void,
};

export default function Thankyou({
  messages,
  isDismissible,
  canOptOut,
  onDismiss,
  onOptOut,
}: Props): Node {
  return (
    <div>
      <Header
        title={messages.title}
        isDismissible={isDismissible}
        canOptOut={canOptOut}
        onDismiss={onDismiss}
        onOptOut={onOptOut}
      />
      <Description>{messages.description}</Description>
    </div>
  );
}
