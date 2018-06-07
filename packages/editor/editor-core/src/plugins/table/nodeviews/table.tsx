import * as React from 'react';
import {
  Node as PmNode,
  DOMSerializer,
  DOMOutputSpec,
} from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { akEditorFullPageMaxWidth } from '@atlaskit/editor-common';
import { EventDispatcher } from '../../../event-dispatcher';
import ReactNodeView from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { parseDOMColumnWidths } from '../utils';
import TableComponent from './TableComponent';

export interface Props {
  node: PmNode;
  view: EditorView;
  allowColumnResizing: boolean;
  cellMinWidth?: number;
  portalProviderAPI: PortalProviderAPI;
  eventDispatcher?: EventDispatcher;
  getPos: () => number;
}

const toDOM = (node: PmNode, props: Props) =>
  [
    'table',
    {
      'data-number-column': node.attrs.isNumberColumnEnabled,
      'data-layout': node.attrs.layout,
      'data-autosize': node.attrs.__autoSize,
    },
    props.allowColumnResizing ? ['colgroup'] : '',
    ['tbody', 0],
  ] as DOMOutputSpec;

export default class TableView extends ReactNodeView {
  constructor(props: Props) {
    super(props.node, props.view, props.getPos, props.portalProviderAPI, props);
  }

  getContentDOM() {
    return DOMSerializer.renderSpec(
      document,
      toDOM(this.node, this.reactComponentProps as Props),
    );
  }

  update(node: PmNode, decorations) {
    return super.update(
      node,
      decorations,
      (currentNode, newNode) =>
        node.attrs.isNumberColumnEnabled ===
          this.node.attrs.isNumberColumnEnabled &&
        node.attrs.layout === this.node.attrs.layout,
    );
  }

  render(props, forwardRef) {
    return (
      <TableComponent
        {...props}
        node={this.node}
        contentDOM={forwardRef}
        onComponentUpdate={this.componentDidUpdate}
      />
    );
  }

  componentDidUpdate = () => {
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

    const { state, dispatch } = this.view;
    const { tr } = state;

    if (this.node.attrs.__autoSize) {
      const basePos = this.getPos();
      if (typeof basePos === 'undefined') {
        return;
      }

      const colWidths = parseDOMColumnWidths(this.contentDOM! as HTMLElement);

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
  };

  ignoreMutation(record: MutationRecord) {
    return true;
  }
}
