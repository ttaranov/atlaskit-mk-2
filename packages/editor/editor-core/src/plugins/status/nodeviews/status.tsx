import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { Status } from '@atlaskit/status';

export interface Props {
  node: PMNode;
}

export default function StatusNodeView(props: Props) {
  const {
    attrs: { text, color, localId },
  } = props.node;

  return <Status text={text} color={color} localId={localId} />;
}
