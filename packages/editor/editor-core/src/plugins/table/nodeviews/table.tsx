import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import TableComponent from './TableComponent';
import { EventDispatcher } from '../../../event-dispatcher';
import ContentNodeView from '../../../nodeviews/contentNodeView';

export interface Props {
  node: PmNode;
  view: EditorView;
  allowColumnResizing: boolean;
  cellMinWidth?: number;
  eventDispatcher?: EventDispatcher;
}

export default class TableView extends ContentNodeView implements NodeView {
  private node: PmNode;
  private domRef: HTMLElement | null;
  private props: Props;
  private component: TableComponent;

  constructor(props: Props) {
    super(props.node, props.view, 'tbody');
    this.props = props;
    this.node = props.node;

    this.domRef = document.createElement('div');

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
    this.component = ReactDOM.render(
      <TableComponent
        {...this.props}
        node={this.node}
        contentDOM={this.handleRef}
      />,
      this.domRef,
    );
  }

  ignoreMutation(record: MutationRecord) {
    if (!this.component) {
      // force initial render
      return false;
    }

    return true;
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.domRef);
    this.domRef = null;
  }
}
