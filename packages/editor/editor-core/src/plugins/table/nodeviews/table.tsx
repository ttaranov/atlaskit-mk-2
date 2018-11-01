import * as React from 'react';
import {
  Node as PmNode,
  DOMOutputSpec,
  DOMSerializer,
} from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { akEditorFullPageMaxWidth } from '@atlaskit/editor-common';
import ReactNodeView from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { parseDOMColumnWidths, generateColgroup } from '../utils';
import TableComponent from './TableComponent';

import WithPluginState from '../../../ui/WithPluginState';
import { pluginKey as widthPluginKey } from '../../width';
import { pluginKey, getPluginState } from '../pm-plugins/main';
import { pluginConfig as getPluginConfig } from '../index';

export interface Props {
  node: PmNode;
  view: EditorView;
  allowColumnResizing?: boolean;
  cellMinWidth?: number;
  portalProviderAPI: PortalProviderAPI;
  UNSAFE_allowFlexiColumnResizing?: boolean;
  getPos: () => number;
}

const tableAttributes = (node: PmNode) => {
  return {
    'data-number-column': node.attrs.isNumberColumnEnabled,
    'data-layout': node.attrs.layout,
    'data-autosize': node.attrs.__autoSize,
  };
};

const toDOM = (node: PmNode, props: Props) => {
  let colgroup: DOMOutputSpec = '';

  if (props.allowColumnResizing) {
    // @ts-ignore
    colgroup = ['colgroup', {}].concat(generateColgroup(node));
  }

  return [
    'table',
    tableAttributes(node),
    colgroup,
    ['tbody', 0],
  ] as DOMOutputSpec;
};

export default class TableView extends ReactNodeView {
  private table: HTMLElement | undefined;

  constructor(props: Props) {
    super(props.node, props.view, props.getPos, props.portalProviderAPI, props);
  }

  getContentDOM() {
    const rendered = DOMSerializer.renderSpec(
      document,
      toDOM(this.node, this.reactComponentProps as Props),
    );

    if (rendered.dom) {
      this.table = rendered.dom as HTMLElement;
    }

    return rendered;
  }

  setDomAttrs(node) {
    if (!this.table) {
      return;
    }

    const attrs = tableAttributes(node);
    Object.keys(attrs).forEach(attr => {
      this.table!.setAttribute(attr, attrs[attr]);
    });
  }

  render(props, forwardRef) {
    return (
      <WithPluginState
        plugins={{
          containerWidth: widthPluginKey,
          pluginState: pluginKey,
        }}
        editorView={props.view}
        render={pluginStates => (
          <TableComponent
            {...props}
            {...pluginStates}
            node={this.node}
            width={pluginStates.containerWidth.width}
            contentDOM={forwardRef}
            onComponentMount={this.componentDidMount}
          />
        )}
      />
    );
  }

  componentDidMount = () => {
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

export const createTableView = (portalProviderAPI: PortalProviderAPI) => (
  node,
  view,
  getPos,
): NodeView => {
  const { pluginConfig } = getPluginState(view.state);
  const {
    allowColumnResizing,
    UNSAFE_allowFlexiColumnResizing,
  } = getPluginConfig(pluginConfig);

  return new TableView({
    node,
    view,
    allowColumnResizing,
    UNSAFE_allowFlexiColumnResizing,
    portalProviderAPI,
    getPos,
  }).init();
};
