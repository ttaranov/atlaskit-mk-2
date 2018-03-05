import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EditorView, NodeView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import { Node as PmNode } from 'prosemirror-model';
import Extension from '../../ui/Extension';
import ContentNodeView from '../contentNodeView';
import { ExtensionHandlers } from '../../editor/types';
import { EventDispatcher } from '../../editor/event-dispatcher';
import {
  pluginKey,
  ExtensionState,
} from '../../editor/plugins/extension/plugin';
import WithPluginState from '../../editor/ui/WithPluginState';

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
    this.eventDispatcher = eventDispatcher;
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

  private renderReactComponent(node: PmNode) {
    // Using WithPluginState so we can update the component on selection
    ReactDOM.render(
      <WithPluginState
        editorView={this.view}
        eventDispatcher={this.eventDispatcher}
        plugins={{
          extensionState: pluginKey,
        }}
        render={({ extensionState = {} as ExtensionState }) => {
          const { element } = extensionState;

          return (
            <Extension
              editorView={this.view}
              node={node}
              providerFactory={this.providerFactory}
              handleContentDOMRef={this.handleRef}
              extensionHandlers={this.extensionHandlers}
              isSelected={this.isSelected(element)}
              element={element}
            />
          );
        }}
      />,
      this.domRef,
    );
  }

  private isSelected(element) {
    if (!this.domRef || !element) {
      return false;
    }

    if (
      this.domRef.contains(element) &&
      // selecting an extension within a bodied extension would pass the
      // case above making the whole tree of extensions selected. To work
      // around it we rely on the ProseMirror selection;
      this.domRef.classList.contains('ProseMirror-selectednode')
    ) {
      return true;
    }

    return false;
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
