import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import TableComponent from './TableComponent';
import { EventDispatcher } from '../../../event-dispatcher';
import ContentNodeView from '../../../nodeviews/contentNodeView';
import { parseDOMColumnWidths } from '../utils';
import { akEditorFullPageMaxWidth } from '@atlaskit/editor-common';

export interface Props {
  node: PmNode;
  view: EditorView;
  allowColumnResizing: boolean;
  cellMinWidth?: number;
  eventDispatcher?: EventDispatcher;
  getPos: () => number | undefined;
}

export default class TableView extends ContentNodeView implements NodeView {
  private node: PmNode;
  private domRef: HTMLElement | null;
  private props: Props;

  constructor(props: Props) {
    super(props.node, props.view, 'tbody');
    this.props = props;
    this.node = props.node;

    this.domRef = document.createElement('div');
    this.domRef.draggable = true;

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
    ReactDOM.render(
      <TableComponent
        {...this.props}
        node={this.node}
        contentDOM={this.handleRef}
      />,
      this.domRef,
      () => {
        // When we get a table with an 'auto' attribute, we want to:
        // 1. render with table-layout: auto
        // 2. capture the column widths
        // 3. set the column widths as attributes, and remove the 'auto' attribute,
        //    so the table renders the same, but is now fixed-width
        //
        // This can be used to migrate table appearances from other sources that are
        // usually rendered with 'auto'.
        //
        // We use this when migrating TinyMCE tables for Confluence, for example:
        // https://pug.jira-dev.com/wiki/spaces/AEC/pages/3362882215/How+do+we+map+TinyMCE+tables+to+Fabric+tables

        const { state, dispatch } = this.props.view;
        const { tr } = state;

        if (this.node.attrs.__autoSize) {
          const basePos = this.props.getPos();
          if (typeof basePos === 'undefined') {
            return;
          }

          const colWidths = parseDOMColumnWidths(this.contentDOM!);

          // overflow tables require all columns to be fixed width
          const tableWidth = colWidths.dividedWidths.reduce(
            (sum, val) => sum + val,
            0,
          );
          const isOverflowTable = tableWidth > akEditorFullPageMaxWidth;

          this.node.forEach((rowNode, rowOffset, i) => {
            rowNode.forEach((colNode, colOffset, j) => {
              const pos = rowOffset + colOffset + basePos + 2;

              tr.setNodeMarkup(pos, undefined, {
                ...colNode.attrs,
                colwidth: colWidths
                  .width(j, colNode.attrs.colspan, !isOverflowTable)
                  .map(Math.round),
              });
            });
          });

          // clear autosizing on the table node
          tr.setNodeMarkup(basePos, undefined, {
            ...this.node.attrs,
            __autoSize: false,
          });

          dispatch(tr.setMeta('addToHistory', false));
        }
      },
    );
  }

  ignoreMutation(record: MutationRecord) {
    return true;
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.domRef);
    this.domRef = null;
  }
}
