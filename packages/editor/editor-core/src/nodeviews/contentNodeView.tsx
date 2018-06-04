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

  constructor(node: PMNode, view: EditorView, elementType: string = 'div') {
    if (view.dom.parentNode) {
      this.contentDOM = view.dom.parentNode.appendChild(
        document.createElement(elementType),
      );
      // @see ED-3790
      // something gets messed up during mutation processing inside of a nodeView if DOM structure has nested plain "div"s,
      // it doesn't see the difference between them and it kills the nodeView
      this.contentDOM.className = `${node.type.name}View-content-wrap`;
    }
  }

  handleRef = (node: HTMLElement | undefined) => this._handleRef(node);

  private _handleRef(node: HTMLElement | undefined) {
    const { contentDOM } = this;
    if (node && contentDOM && !node.contains(contentDOM)) {
      node.appendChild(contentDOM);
    }
  }

  destroy() {
    this.contentDOM = undefined;
  }
}
