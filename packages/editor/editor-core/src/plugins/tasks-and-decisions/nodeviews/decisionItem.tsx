import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import DecisionItem from '../ui/Decision';
import { ContentNodeView } from '../../../nodeviews';
import { ProviderFactory } from '@atlaskit/editor-common';

type getPosHandler = () => number;

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
}

class Decision extends ContentNodeView implements NodeView {
  private domRef: HTMLElement | undefined;
  private isContentEmpty: boolean = false;
  private node: PMNode;
  private providerFactory: ProviderFactory;

  constructor(
    node: PMNode,
    view: EditorView,
    getPos: getPosHandler,
    providerFactory: ProviderFactory,
  ) {
    super(node, view);
    this.isContentEmpty = node.content.childCount === 0;
    this.node = node;
    this.providerFactory = providerFactory;
    this.renderReactComponent();
  }

  private renderReactComponent() {
    this.domRef = document.createElement('li');
    this.domRef.style['list-style-type'] = 'none';
    const { localId } = this.node.attrs;

    // tslint:disable-next-line:variable-name
    ReactDOM.render(
      <DecisionItem
        localId={localId}
        contentRef={this.handleRef}
        showPlaceholder={this.isContentEmpty}
        providers={this.providerFactory}
      />,
      this.domRef,
    );
  }

  get dom() {
    return this.domRef;
  }

  update(node: PMNode) {
    /**
     * Returning false here when the previous content was empty – fixes an error where the editor fails to set selection
     * inside the contentDOM after a transaction. See ED-2374.
     */
    return !this.isContentEmpty || node.type !== this.node.type;
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.domRef!);
    this.domRef = undefined;
    super.destroy();
  }
}

export function decisionItemNodeViewFactory(providerFactory: ProviderFactory) {
  return (node: any, view: any, getPos: () => number): NodeView => {
    return new Decision(node, view, getPos, providerFactory);
  };
}
