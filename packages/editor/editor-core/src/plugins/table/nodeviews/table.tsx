import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import TableComponent from './TableComponent';
import { EventDispatcher } from '../../../event-dispatcher';

export interface Props {
  node: PmNode;
  view: EditorView;
  allowColumnResizing: boolean;
  cellMinWidth?: number;
  eventDispatcher?: EventDispatcher;
}

export default class TableView implements NodeView {
  contentDOM: HTMLElement | null;

  private node: PmNode;

  private domRef: HTMLElement | null;
  private reactDomRef: HTMLElement | null;

  private props: Props;

  constructor(props: Props) {
    this.props = props;
    this.node = props.node;

    this.domRef = document.createElement('div');
    this.reactDomRef = this.domRef.appendChild(document.createElement('div'));

    this.render();
  }

  get dom() {
    return this.domRef;
  }

  update(node: PmNode, decorations) {
    if (
      node.attrs.isNumberColumnEnabled !==
        this.node.attrs.isNumberColumnEnabled ||
      node.type !== this.node.type
    ) {
      return false;
    }

    this.node = node;
    this.render();
    return true;
  }

  render() {
    const setContentDOM = elem => (this.contentDOM = elem);

    ReactDOM.render(
      <TableComponent
        {...this.props}
        node={this.node}
        contentDOM={setContentDOM}
      />,
      this.reactDomRef,
    );
  }

  ignoreMutation(record: MutationRecord) {
    return true;
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.reactDomRef);
    this.reactDomRef = null;
    this.domRef = null;
  }
}
