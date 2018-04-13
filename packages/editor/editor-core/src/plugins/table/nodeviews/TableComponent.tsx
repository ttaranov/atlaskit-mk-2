import * as React from 'react';
import rafSchedule from 'raf-schd';
import { updateColumnsOnResize } from 'prosemirror-tables';
import TableFloatingControls from '../ui/TableFloatingControls';
import ColumnControls from '../ui/TableFloatingControls/ColumnControls';
import { stateKey } from '../pm-plugins/main';
import { pluginKey as hoverSelectionPluginKey } from '../pm-plugins/hover-selection-plugin';
import {
  hoverColumn,
  hoverTable,
  hoverRow,
  resetHoverSelection,
  insertColumn,
  insertRow,
} from '../actions';

import { pluginKey as widthPluginKey } from '../../width';

import WithPluginState from '../../../ui/WithPluginState';
import { TableLayout, akEditorFullPageMaxWidth } from '@atlaskit/editor-common';

const SHADOW_MAX_WIDTH = 8;
const DEFAULT_CELL_MIN_WIDTH = 25;
// TODO: Should be 50 after ED-4280 is fixed
const CONTROLLER_PADDING = 52;

import { Props } from './table';

export interface ComponentProps extends Props {
  contentDOM: (element: HTMLTableSectionElement) => void;
}

class TableComponent extends React.Component<ComponentProps> {
  private wrapper: HTMLDivElement | null;
  private table: HTMLTableElement | null;
  private colgroup: HTMLTableColElement | null;

  private leftShadow: HTMLDivElement | null;
  private rightShadow: HTMLDivElement | null;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.allowColumnResizing) {
      if (this.colgroup && this.table) {
        updateColumnsOnResize(
          this.props.node,
          this.colgroup,
          this.table,
          this.props.cellMinWidth || DEFAULT_CELL_MIN_WIDTH,
        );
      }

      if (this.wrapper) {
        this.wrapper.addEventListener('scroll', this.handleScrollDebounced);
      }
    }
  }

  componentWillUnmount() {
    if (this.wrapper) {
      this.wrapper.removeEventListener('scroll', this.handleScrollDebounced);
    }

    this.handleScrollDebounced.cancel();
  }

  calcWidth(layout: TableLayout, containerWidth: number): string {
    switch (layout) {
      case 'full-width':
        return `${containerWidth - CONTROLLER_PADDING}px`;
      default:
        return '100%';
    }
  }

  render() {
    const { eventDispatcher, view, node, allowColumnResizing } = this.props;
    const columnShadows = allowColumnResizing
      ? [
          <div
            key="left"
            className="table-shadow -left"
            ref={elem => {
              this.leftShadow = elem;
            }}
          />,
          <div
            key="right"
            className="table-shadow -right"
            ref={elem => {
              this.rightShadow = elem;
            }}
          />,
        ]
      : [];

    // doesn't work well with WithPluginState
    const { isTableHovered } = hoverSelectionPluginKey.getState(view.state);

    return (
      <WithPluginState
        plugins={{
          containerWidth: widthPluginKey,
          pluginState: stateKey,
        }}
        eventDispatcher={eventDispatcher}
        editorView={view}
        render={({ containerWidth, pluginState }) => {
          return (
            <div
              style={{
                width: this.calcWidth(node.attrs.layout, containerWidth),
                maxWidth:
                  containerWidth <= akEditorFullPageMaxWidth
                    ? '100%'
                    : `${containerWidth}px`,
              }}
              className="table-container"
              data-layout={node.attrs.layout}
            >
              <div className="table-row-controls">
                <TableFloatingControls
                  editorView={view}
                  tableElement={pluginState.tableElement}
                  isTableHovered={isTableHovered}
                  hoverTable={hoverTable}
                  hoverRow={hoverRow}
                  hoverColumn={hoverColumn}
                  resetHoverSelection={resetHoverSelection}
                  insertColumn={insertColumn}
                  insertRow={insertRow}
                />
              </div>
              <div
                className="table-wrapper"
                ref={elem => {
                  this.wrapper = elem;
                }}
              >
                <div className="table-column-controls">
                  <ColumnControls
                    editorView={view}
                    tableElement={pluginState.tableElement}
                    isTableHovered={isTableHovered}
                    insertColumn={insertColumn}
                    hoverColumn={hoverColumn!}
                    resetHoverSelection={resetHoverSelection!}
                  />
                </div>
                <table
                  ref={elem => {
                    this.table = elem;
                  }}
                  data-number-column={node.attrs.isNumberColumnEnabled}
                  data-layout={node.attrs.layout}
                >
                  {allowColumnResizing ? (
                    <colgroup
                      ref={elem => {
                        this.colgroup = elem;
                      }}
                    />
                  ) : null}
                  <tbody ref={this.props.contentDOM} />
                </table>
              </div>
              {columnShadows}
            </div>
          );
        }}
      />
    );
  }

  componentDidUpdate() {
    const { allowColumnResizing, node, cellMinWidth } = this.props;
    if (allowColumnResizing && this.colgroup && this.table) {
      updateColumnsOnResize(
        node,
        this.colgroup,
        this.table,
        cellMinWidth || DEFAULT_CELL_MIN_WIDTH,
      );
    }
  }

  private handleScroll = (event: Event) => {
    if (event.target !== this.wrapper) {
      return;
    }

    if (!this.table || !this.leftShadow || !this.rightShadow) {
      return;
    }

    const { scrollLeft, offsetWidth } = event.target as HTMLElement;
    const tableOffsetWidth = this.table.offsetWidth;

    const diff = tableOffsetWidth - offsetWidth;
    const scrollDiff = scrollLeft - diff > 0 ? scrollLeft - diff : 0;
    const width = diff
      ? Math.min(SHADOW_MAX_WIDTH, SHADOW_MAX_WIDTH - scrollDiff + 2)
      : 0;

    const paddingLeft = getComputedStyle(this.wrapper.parentElement!)
      .paddingLeft;
    const paddingLeftPx = paddingLeft
      ? Number(paddingLeft.substr(0, paddingLeft.length - 2))
      : 0;

    this.leftShadow.style.left = `${paddingLeftPx}px`;
    this.leftShadow.style.width = `${Math.min(scrollLeft, SHADOW_MAX_WIDTH)}px`;
    this.rightShadow.style.left = `${offsetWidth -
      width -
      scrollDiff +
      paddingLeftPx}px`;
    this.rightShadow.style.width = `${width}px`;
  };

  private handleScrollDebounced = rafSchedule(this.handleScroll);
}

export default TableComponent;
