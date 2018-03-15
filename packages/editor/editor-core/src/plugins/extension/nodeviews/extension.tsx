import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EditorView, NodeView } from 'prosemirror-view';
import { Node as PmNode } from 'prosemirror-model';
import { ProviderFactory } from '@atlaskit/editor-common';
import { ContentNodeView } from '../../../nodeviews';
import Extension from '../ui/Extension';
import { EventDispatcher } from '../../../event-dispatcher';
import { ExtensionHandlers } from '../../../types';
import WithPluginState from '../../../ui/WithPluginState';
import { pluginKey, ExtensionState } from '../../extension/plugin';

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
  private extensionHandlers: ExtensionHandlers;
  private eventDispatcher: EventDispatcher;

  constructor(
    node: PmNode,
    view: EditorView,
    providerFactory: ProviderFactory,
    extensionHandlers: ExtensionHandlers,
    eventDispatcher: EventDispatcher,
  ) {
    super(node, view);
    const elementType = node.type.name === 'inlineExtension' ? 'span' : 'div';
    this.node = node;
    this.view = view;
    this.providerFactory = providerFactory;
    this.eventDispatcher = eventDispatcher;
    this.domRef = document.createElement(elementType);
    // @see ED-3790
    this.domRef.className = `${node.type.name}View-container`;
    this.extensionHandlers = extensionHandlers;
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

  ignoreMutation(mutation) {
    // Extensions can perform async operations that will change the DOM.
    // To avoid having their tree rebuilt, we need to ignore the mutation.
    return true;
  }

  private renderReactComponent(node: PmNode) {
    ReactDOM.render(
      <WithPluginState
        editorView={this.view}
        eventDispatcher={this.eventDispatcher}
        plugins={{
          extensionState: pluginKey,
        }}
        render={({ extensionState = {} as ExtensionState }) => {
          const { focusedNode } = extensionState;

          return (
            <Extension
              editorView={this.view}
              node={node}
              providerFactory={this.providerFactory}
              handleContentDOMRef={this.handleRef}
              extensionHandlers={this.extensionHandlers}
              isEditMode={this.isFocused(node, focusedNode)}
            />
          );
        }}
      />,
      this.domRef,
    );
  }

  // Focus is used to switch between view and edit mode for bodied extensions handled by extension handlers
  // It basically means that the focus is in the body of an extension
  private isFocused(node, focusedNode) {
    if (!node || !focusedNode || node.type.name !== 'bodiedExtension') {
      return false;
    }

    // when editing a bodied node, changes in content will create new nodes.
    // To make sure we keep the focus, we check if it's the same node without considering the content.
    return node.sameMarkup(focusedNode);
  }
}

export default function ExtensionNodeView(
  providerFactory: ProviderFactory,
  extensionHandlers: ExtensionHandlers,
  eventDispatcher: EventDispatcher,
) {
  return (node: PmNode, view: EditorView, getPos: () => number): NodeView => {
    return new ExtensionNode(
      node,
      view,
      providerFactory,
      extensionHandlers,
      eventDispatcher,
    );
  };
}
