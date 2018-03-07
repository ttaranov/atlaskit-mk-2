import * as React from 'react';
import * as ReactDOM from 'react-dom';
import rafSchedule from 'raf-schd';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { updateColumnsOnResize } from 'prosemirror-tables';
import TableFloatingControls from '../../ui/TableFloatingControls';
import ColumnControls from '../../ui/TableFloatingControls/ColumnControls';
import { stateKey } from '../../plugins/table';
import { pluginKey as hoverSelectionPluginKey } from '../../editor/plugins/table/hover-selection-plugin';
import {
  hoverColumn,
  hoverTable,
  hoverRow,
  resetHoverSelection,
  selectTable,
  selectColumn,
  selectRow,
} from '../../editor/plugins/table/actions';
import {
  checkIfTableSelected,
  checkIfColumnSelected,
  checkIfRowSelected,
} from '../../editor/plugins/table/utils';

const SHADOW_MAX_WIDTH = 8;

export interface Props {
  node: PmNode;
  view: EditorView;
  allowColumnResizing: boolean;
  cellMinWidth?: number;
}

export default class TableView {
  contentDOM: HTMLElement | undefined;

  private node: PmNode;
  private cellMinWidth: number;
  private view: EditorView;
  private allowColumnResizing: boolean;

  private domRef: HTMLElement | undefined;
  private columntControls: HTMLElement;
  private rowControls: HTMLElement;
  private table: HTMLElement;
  private wrapper: HTMLElement;
  private colgroup: HTMLElement;
  private leftShadow: HTMLElement;
  private rightShadow: HTMLElement;

  constructor({
    node,
    view,
    allowColumnResizing = false,
    cellMinWidth = 25,
  }: Props) {
    this.node = node;
    this.view = view;
    this.cellMinWidth = cellMinWidth;
    this.allowColumnResizing = allowColumnResizing;

    this.domRef = document.createElement('div');
    this.domRef.className = 'table-container';

    this.rowControls = this.domRef.appendChild(document.createElement('div'));
    this.rowControls.className = 'table-row-controls';

    this.wrapper = this.domRef.appendChild(document.createElement('div'));
    this.wrapper.className = 'table-wrapper';

    this.columntControls = this.wrapper.appendChild(
      document.createElement('div'),
    );
    this.columntControls.className = 'table-column-controls';

    this.table = this.wrapper.appendChild(document.createElement('table'));

    if (this.allowColumnResizing) {
      this.leftShadow = this.domRef.appendChild(document.createElement('div'));
      this.leftShadow.className = 'table-shadow -left';

      this.rightShadow = this.domRef.appendChild(document.createElement('div'));
      this.rightShadow.className = 'table-shadow -right';

      this.colgroup = this.table.appendChild(
        document.createElement('colgroup'),
      );

      updateColumnsOnResize(node, this.colgroup, this.table, this.cellMinWidth);
      this.wrapper.addEventListener('scroll', this.handleScrollDebounced);
    }
    this.contentDOM = this.table.appendChild(document.createElement('tbody'));
    this.updateControls(node);
    this.updateAttrs(node);
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
    this.updateControls(node);
    this.updateAttrs(node);

    if (this.allowColumnResizing) {
      updateColumnsOnResize(node, this.colgroup, this.table, this.cellMinWidth);
    }

    return true;
  }

  updateAttrs(node: PmNode) {
    this.table.setAttribute(
      'data-number-column',
      node.attrs.isNumberColumnEnabled,
    );
  }

  ignoreMutation(record) {
    const { target, type } = record;
    const {
      table,
      columntControls,
      rowControls,
      allowColumnResizing,
      colgroup,
      leftShadow,
      rightShadow,
    } = this;
    const tableMutation = target === table;

    const controlsMutation =
      columntControls.contains(target) || rowControls.contains(target);

    const resizingMutation =
      allowColumnResizing &&
      (colgroup.contains(target) ||
        leftShadow.contains(target) ||
        rightShadow.contains(target));

    return (
      type === 'attributes' &&
      (tableMutation || controlsMutation || resizingMutation)
    );
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.columntControls);
    ReactDOM.unmountComponentAtNode(this.rowControls);
    this.wrapper.removeEventListener('scroll', this.handleScrollDebounced);
    this.handleScrollDebounced.cancel();
    this.domRef = undefined;
    this.contentDOM = undefined;
  }

  private updateControls(node: PmNode) {
    const { view } = this;
    const pluginState = stateKey.getState(view.state);
    const { isTableHovered } = hoverSelectionPluginKey.getState(view.state);

    ReactDOM.render(
      <ColumnControls
        editorView={view}
        tableElement={pluginState.tableElement}
        isTableHovered={isTableHovered}
        checkIfSelected={checkIfColumnSelected!}
        selectColumn={selectColumn!}
        insertColumn={pluginState.insertColumn}
        hoverColumn={hoverColumn!}
        resetHoverSelection={resetHoverSelection!}
      />,
      this.columntControls,
    );

    ReactDOM.render(
      <TableFloatingControls
        editorView={view}
        tableElement={pluginState.tableElement}
        isTableHovered={isTableHovered}
        hoverTable={hoverTable}
        hoverRow={hoverRow}
        hoverColumn={hoverColumn}
        resetHoverSelection={resetHoverSelection}
        selectTable={selectTable}
        selectColumn={selectColumn}
        selectRow={selectRow}
        checkIfTableSelected={checkIfTableSelected}
        checkIfColumnSelected={checkIfColumnSelected}
        checkIfRowSelected={checkIfRowSelected}
        insertColumn={pluginState.insertColumn}
        insertRow={pluginState.insertRow}
      />,
      this.rowControls,
    );
  }

  private handleScroll = (event: Event) => {
    if (event.target !== this.wrapper) {
      return;
    }
    const { scrollLeft, offsetWidth } = event.target as HTMLElement;
    const tableOffsetWidth = this.table.offsetWidth;

    const diff = tableOffsetWidth - offsetWidth;
    const scrollDiff = scrollLeft - diff > 0 ? scrollLeft - diff : 0;
    const width = diff
      ? Math.min(SHADOW_MAX_WIDTH, SHADOW_MAX_WIDTH - scrollDiff + 2)
      : 0;

    this.leftShadow.style.width = `${Math.min(scrollLeft, SHADOW_MAX_WIDTH)}px`;
    this.rightShadow.style.left = `${offsetWidth - width - scrollDiff}px`;
    this.rightShadow.style.width = `${width}px`;
  };

  private handleScrollDebounced = rafSchedule(this.handleScroll);
}
