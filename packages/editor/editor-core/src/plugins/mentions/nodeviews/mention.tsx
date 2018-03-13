import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import Mention from '../ui/Mention';

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
  providerFactory: ProviderFactory;
}

export default class MentionNode extends React.PureComponent<Props, {}> {
  render() {
    const { node, providerFactory } = this.props;
    const { id, text, accessLevel } = node.attrs;

    return (
      <Mention
        id={id}
        text={text}
        accessLevel={accessLevel}
        providers={providerFactory}
      />
    );
  }
}
