import * as React from 'react';
import { ComponentClass, StatelessComponent } from 'react';
import * as ReactDOM from 'react-dom';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import ReactPMNode from './ui/prosemirror-node';
import { EventDispatcher } from '../event-dispatcher';
import connect from './connect';

type getPosHandler = () => number;

export interface ReactNodeViewComponents {
  [key: string]: ComponentClass<any> | StatelessComponent<any>;
}

const createTemporaryContainer = (node: PMNode) => {
  return document.createElement(node.type.isBlock ? 'div' : 'span');
};

class NodeViewElem implements NodeView {
  private nodeTypeName: string;
  private domRef: HTMLElement | undefined;
  private view: EditorView;
  private getPos: getPosHandler;
  private providerFactory: ProviderFactory;
  private reactNodeViewComponents: ReactNodeViewComponents;
  private eventDispatcher: EventDispatcher;

  constructor(
    node: PMNode,
    view: EditorView,
    getPos: getPosHandler,
    providerFactory: ProviderFactory,
    reactNodeViewComponents: ReactNodeViewComponents,
  ) {
    this.nodeTypeName = node.type.name;
    this.view = view;
    this.getPos = getPos;
    this.providerFactory = providerFactory;
    this.reactNodeViewComponents = reactNodeViewComponents;

    this.domRef = createTemporaryContainer(node);
    this.eventDispatcher = new EventDispatcher();

    this.setDomAttrs(node);
    this.renderReactComponent(node);
    /**
     * Create temporary containers for children since we are not using contentDOM
     * Without this PM will throw, @see ED-4235
     */
    if (node.content.size) {
      const fragment = document.createDocumentFragment();
      node.content.forEach(child => {
        fragment.appendChild(createTemporaryContainer(child));
      });
      this.domRef.appendChild(fragment);
    }
  }

  get dom() {
    return this.domRef;
  }

  update(node: PMNode) {
    // @see https://github.com/ProseMirror/prosemirror/issues/648
    const isValidUpdate = this.nodeTypeName === node.type.name;

    if (isValidUpdate) {
      if (this.domRef) {
        this.setDomAttrs(node);
        this.eventDispatcher.emit('change', { node });
      } else {
        this.renderReactComponent(node);
      }
    }

    return isValidUpdate;
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.domRef!);
    this.eventDispatcher.destroy();
    this.domRef = undefined;
  }

  private setDomAttrs(node: PMNode) {
    Object.keys(node.attrs || {}).forEach(attr => {
      if (this.domRef) {
        this.domRef.setAttribute(attr, node.attrs[attr]);
      }
    });
  }

  private renderReactComponent(node: PMNode) {
    const {
      getPos,
      providerFactory,
      reactNodeViewComponents,
      view,
      eventDispatcher,
    } = this;

    const ConnectedReactPMNode = connect(
      ReactPMNode,
      eventDispatcher,
    );

    ReactDOM.render(
      <ConnectedReactPMNode
        node={node}
        getPos={getPos}
        view={view}
        providerFactory={providerFactory}
        components={reactNodeViewComponents}
      />,
      this.domRef!,
    );
  }
}

export default function nodeViewFactory(
  providerFactory: ProviderFactory,
  reactNodeViewComponents: ReactNodeViewComponents,
) {
  return (node: PMNode, view: EditorView, getPos: () => number): NodeView => {
    return new NodeViewElem(
      node,
      view,
      getPos,
      providerFactory,
      reactNodeViewComponents,
    );
  };
}
