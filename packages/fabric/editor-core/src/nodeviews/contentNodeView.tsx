import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
}

export default class ContentNodeView {
  contentDOM: HTMLElement | undefined;

  constructor(node: PMNode, view: EditorView) {
    if (view.dom.parentNode) {
      this.contentDOM = view.dom.parentNode.appendChild(
        document.createElement('div'),
      );
    }
  }

  handleRef = (node: HTMLElement | undefined) => {
    const { contentDOM } = this;
    if (node && contentDOM && !node.contains(contentDOM)) {
      node.appendChild(contentDOM);
    }
  };

  destroy() {
    this.contentDOM = undefined;
  }
}
