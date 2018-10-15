import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import DecisionItem from '../ui/Decision';
import { ReactNodeView } from '../../../nodeviews';
import { PortalProviderAPI } from '../../../ui/PortalProvider';

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
}

class Decision extends ReactNodeView {
  private isContentEmpty() {
    return this.node.content.childCount === 0;
  }

  createDomRef() {
    const domRef = document.createElement('li');
    domRef.style['list-style-type'] = 'none';
    return domRef;
  }

  getContentDOM() {
    return { dom: document.createElement('div') };
  }

  render(props, forwardRef) {
    return (
      <DecisionItem
        contentRef={forwardRef}
        showPlaceholder={this.isContentEmpty()}
      />
    );
  }

  update(node: PMNode, decorations) {
    /**
     * Returning false here when the previous content was empty – fixes an error where the editor fails to set selection
     * inside the contentDOM after a transaction. See ED-2374.
     */
    return super.update(
      node,
      decorations,
      (currentNode, newNode) => !this.isContentEmpty(),
    );
  }
}

export const decisionItemNodeView = (portalProviderAPI: PortalProviderAPI) => (
  node: any,
  view: any,
  getPos: () => number,
): NodeView => {
  return new Decision(node, view, getPos, portalProviderAPI).init();
};
