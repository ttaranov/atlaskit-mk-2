import * as React from 'react';
import ProviderFactory from '../../providerFactory';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import Macro from '../../ui/Macro';

export interface Props {
  node: PMNode;
  providerFactory: ProviderFactory;
  view: EditorView;
}

export default function MacroNode(props: Props) {
  const { node, providerFactory, view } = props;

  return (
    <Macro
      editorView={view}
      node={node}
      providerFactory={providerFactory}
    />
  );
}
