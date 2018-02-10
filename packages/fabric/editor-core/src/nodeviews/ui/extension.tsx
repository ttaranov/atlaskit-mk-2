import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EditorView, NodeView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import { Node as PmNode } from 'prosemirror-model';
import Extension from '../../ui/Extension';
import ContentNodeView from '../contentNodeView';
import { ExtensionHandlers } from '../../editor/types';

export interface Props {
  node: PmNode;
  providerFactory: ProviderFactory;
  view: EditorView;
}

class ExtensionNode extends ContentNodeView implements NodeView {
  private domRef: HTMLElement | undefined;
  private node: PmNode;
  private nextNode: PmNode | null;
  private view: EditorView;
  private providerFactory: ProviderFactory;
  private extensionHandlers: ExtensionHandlers;

  constructor(
    node: PmNode,
    view: EditorView,
    providerFactory: ProviderFactory,
    extensionHandlers: ExtensionHandlers,
  ) {
    super(node, view);
    const elementType = node.type.name === 'bodiedExtension' ? 'div' : 'span';
    this.node = node;
    this.view = view;
    this.providerFactory = providerFactory;
    this.extensionHandlers = extensionHandlers;
    this.domRef = document.createElement(elementType);
    // @see ED-3790
    this.domRef.className = `${node.type.name}View-container`;
    this.renderReactComponent(node);
  }

  get dom() {
    return this.domRef;
  }

  update(node: PmNode) {
    // @see https://github.com/ProseMirror/prosemirror/issues/648
    const isValidUpdate = this.node.type.name === node.type.name;

    if (isValidUpdate) {
      this.nextNode = node;
      // allow mutation when there is an update
      this.renderReactComponent(node);
    }

    return isValidUpdate;
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.domRef!);
    this.domRef = undefined;
    super.destroy();
  }

  ignoreMutation(mutation) {
    // Extensions can perform async operations that will change the DOM.
    // To avoid having their tree rebuilt, we need to ignore the mutation.
    return true;
  }

  stopEvent() {
    // have to block events otherwise form fields for extensions won't work
    return true;
  }

  selectNode() {
    this.renderReactComponent(this.node, true);
  }

  deselectNode() {
    if (!this.domRef) {
      return;
    }

    this.renderReactComponent(this.nextNode || this.node, false);
  }

  private renderReactComponent(node: PmNode, isSelected: Boolean = false) {
    console.log('render component', node);
    ReactDOM.render(
      <Extension
        editorView={this.view}
        node={node}
        providerFactory={this.providerFactory}
        handleContentDOMRef={this.handleRef}
        extensionHandlers={this.extensionHandlers}
        isSelected={isSelected}
      />,
      this.domRef,
    );
  }
}

export default function ExtensionNodeView(
  providerFactory: ProviderFactory,
  extensionHandlers: ExtensionHandlers,
) {
  return (node: PmNode, view: EditorView, getPos: () => number): NodeView => {
    return new ExtensionNode(node, view, providerFactory, extensionHandlers);
  };
}
