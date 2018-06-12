import * as React from 'react';
import rafSchedule from 'raf-schd';
import { browser } from '@atlaskit/editor-common';
import TableFloatingControls from '../ui/TableFloatingControls';
import ColumnControls from '../ui/TableFloatingControls/ColumnControls';
import { stateKey } from '../pm-plugins/main';
import { pluginKey as hoverSelectionPluginKey } from '../pm-plugins/hover-selection-plugin';
import {
  hoverColumns,
  hoverTable,
  hoverRows,
  resetHoverSelection,
  insertColumn,
  insertRow,
} from '../actions';

import { pluginKey as widthPluginKey } from '../../width';

import WithPluginState from '../../../ui/WithPluginState';
import { calcTableWidth } from '@atlaskit/editor-common';

const isIE11 = browser.ie_version === 11;
const SHADOW_MAX_WIDTH = 8;

import { Props } from './table';

export interface ComponentProps extends Props {
  onComponentUpdate?: () => void;
  contentDOM: (element: HTMLElement | undefined) => void;
}

class TableComponent extends React.Component<ComponentProps> {
  private wrapper: HTMLDivElement | null;
  private table: HTMLTableElement | null;

  private leftShadow: HTMLDivElement | null;
  private rightShadow: HTMLDivElement | null;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.allowColumnResizing && this.wrapper && !isIE11) {
      this.wrapper.addEventListener('scroll', this.handleScrollDebounced);
    }
  }

  componentWillUnmount() {
    if (this.wrapper && !isIE11) {
      this.wrapper.removeEventListener('scroll', this.handleScrollDebounced);
    }

    this.handleScrollDebounced.cancel();
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
    const {
      isTableHovered,
      isTableInDanger,
    } = hoverSelectionPluginKey.getState(view.state);

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
                width: calcTableWidth(node.attrs.layout, containerWidth),
              }}
              className="table-container"
              data-layout={node.attrs.layout}
            >
              <div className="table-row-controls-wrapper">
                <TableFloatingControls
                  editorView={view}
                  tableElement={pluginState.tableElement}
                  isTableHovered={isTableHovered}
                  hoverTable={hoverTable}
                  hoverRows={hoverRows}
                  resetHoverSelection={resetHoverSelection}
                  insertColumn={insertColumn}
                  insertRow={insertRow}
                  remove={pluginState.remove}
                  isTableInDanger={isTableInDanger}
                />
              </div>
              <div
                className="table-wrapper"
                ref={elem => {
                  this.wrapper = elem;
                  this.props.contentDOM(elem ? elem : undefined);
                  if (elem) {
                    this.table = elem.querySelector('table');
                  }
                }}
              >
                <div className="table-column-controls-wrapper">
                  <ColumnControls
                    editorView={view}
                    tableElement={pluginState.tableElement}
                    isTableHovered={isTableHovered}
                    insertColumn={insertColumn}
                    remove={pluginState.remove}
                    hoverColumns={hoverColumns!}
                    resetHoverSelection={resetHoverSelection!}
                    isTableInDanger={isTableInDanger}
                  />
                </div>
              </div>
              {columnShadows}
            </div>
          );
        }}
      />
    );
  }

  componentDidUpdate() {
    const { onComponentUpdate } = this.props;
    if (onComponentUpdate) {
      onComponentUpdate();
    }
  }

  private handleScroll = (event: Event) => {
    if (
      !this.wrapper ||
      event.target !== this.wrapper ||
      !this.table ||
      !this.leftShadow ||
      !this.rightShadow
    ) {
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
