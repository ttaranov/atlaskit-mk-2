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

  constructor(
    node: PmNode,
    view: EditorView,
    providerFactory: ProviderFactory,
  ) {
    const elementType = node.type.name === 'extension' ? 'div' : 'span';
    this.node = node;
    this.domRef = document.createElement(elementType);
    this.renderReactComponent({ node, view, providerFactory });
  }

  get dom() {
    return this.domRef;
  }

  get contentDOM() {
    const { bodyType } = this.node.attrs;
    return bodyType === 'none' ? undefined : this.contentDOMRef;
  }

  update() {
    /**
     * Returning false here fixes an error where the editor fails to set selection
     * inside the contentDOM after a transaction. See ED-2374.
     */
    return false;
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.domRef!);
    this.domRef = undefined;
    this.contentDOMRef = undefined;
  }

  private renderReactComponent(props: Props) {
    const { node, providerFactory, view } = props;

    ReactDOM.render(
      <Extension
        editorView={view}
        node={node}
        providerFactory={providerFactory}
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
