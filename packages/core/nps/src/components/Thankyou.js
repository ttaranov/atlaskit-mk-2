//@flow

import React, { type Node } from 'react';
import { Header, Description } from './common';

export type Props = {
  messages: {
    title: Node,
    description: Node,
  },
  canClose: boolean,
  canOptOut: boolean,
  onClose: () => void,
  onOptOut: () => void,
};

export default function Thankyou({
  messages,
  canClose,
  canOptOut,
  onClose,
  onOptOut,
}: Props): Node {
  return (
    <div>
      <Header
        title={messages.title}
        canClose={canClose}
        canOptOut={canOptOut}
        onClose={onClose}
        onOptOut={onOptOut}
      />
      <Description>{messages.description}</Description>
    </div>
  );
}
