import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EditorView, NodeView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import { Node as PmNode } from 'prosemirror-model';
import Extension from '../../ui/Extension';
import ContentNodeView from '../contentNodeView';

export interface Props {
  node: PmNode;
  providerFactory: ProviderFactory;
  view: EditorView;
}

class ExtensionNode extends ContentNodeView implements NodeView {
  private domRef: HTMLElement | undefined;
  private node: PmNode;
  private view: EditorView;
  private providerFactory: ProviderFactory;

  constructor(
    node: PmNode,
    view: EditorView,
    providerFactory: ProviderFactory,
  ) {
    super(node, view);
    const elementType = node.type.name === 'extension' ? 'div' : 'span';
    this.node = node;
    this.view = view;
    this.providerFactory = providerFactory;
    this.domRef = document.createElement(elementType);
    this.renderReactComponent(node);
  }

  get dom() {
    return this.domRef;
  }

  update(node: PmNode) {
    // @see https://github.com/ProseMirror/prosemirror/issues/648
    const isValidUpdate = this.node.type.name === node.type.name;

    if (isValidUpdate) {
      this.renderReactComponent(node);
    }

    return isValidUpdate;
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.domRef!);
    this.domRef = undefined;
    super.destroy();
  }

  private renderReactComponent(node: PmNode) {
    ReactDOM.render(
      <Extension
        editorView={this.view}
        node={node}
        providerFactory={this.providerFactory}
        handleContentDOMRef={this.handleRef}
      />,
      this.domRef,
    );
  }
}

export default function ExtensionNodeView(providerFactory: ProviderFactory) {
  return (node: PmNode, view: EditorView, getPos: () => number): NodeView => {
    return new ExtensionNode(node, view, providerFactory);
  };
}
