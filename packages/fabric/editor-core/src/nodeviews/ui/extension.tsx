import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EditorView, NodeView } from 'prosemirror-view';
import ProviderFactory from '../../providerFactory';
import { Node as PmNode } from 'prosemirror-model';
import Extension from '../../ui/Extension';

export interface Props {
  node: PmNode;
  providerFactory: ProviderFactory;
  view: EditorView;
}

class ExtensionNode implements NodeView {
  private domRef: HTMLElement | undefined;
  private contentDOMRef: HTMLElement | undefined;
  private node: PmNode;
  private view: EditorView;
  private providerFactory: ProviderFactory;

  constructor(
    node: PmNode,
    view: EditorView,
    providerFactory: ProviderFactory,
  ) {
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

  get contentDOM() {
    return this.contentDOMRef;
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
    this.contentDOMRef = undefined;
  }

  private renderReactComponent(node: PmNode) {
    ReactDOM.render(
      <Extension
        editorView={this.view}
        node={node}
        providerFactory={this.providerFactory}
        handleContentDOMRef={this.handleContentDOMRef}
      />,
      this.domRef,
    );
  }

  private handleContentDOMRef = (node?: HTMLElement) => {
    this.contentDOMRef = node;
  };
}

export default function ExtensionNodeView(providerFactory: ProviderFactory) {
  return (node: PmNode, view: EditorView, getPos: () => number): NodeView => {
    return new ExtensionNode(node, view, providerFactory);
  };
}
