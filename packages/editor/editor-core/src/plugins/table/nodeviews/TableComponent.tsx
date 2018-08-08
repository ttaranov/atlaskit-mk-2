import * as React from 'react';
import rafSchedule from 'raf-schd';
import { updateColumnsOnResize } from 'prosemirror-tables';
import { browser, akEditorTableToolbarSize } from '@atlaskit/editor-common';
import TableFloatingControls from '../ui/TableFloatingControls';
import ColumnControls from '../ui/TableFloatingControls/ColumnControls';

import { getPluginState } from '../pm-plugins/main';
import { TablePluginState } from '../types';
import { calcTableWidth } from '@atlaskit/editor-common';
import { CELL_MIN_WIDTH } from '../';

const isIE11 = browser.ie_version === 11;
const SHADOW_MAX_WIDTH = 8;

import { Props } from './table';
import {
  containsHeaderRow,
  checkIfHeaderColumnEnabled,
  checkIfHeaderRowEnabled,
} from '../utils';

export interface ComponentProps extends Props {
  onComponentMount: () => void;
  contentDOM: (element: HTMLElement | undefined) => void;

  containerWidth: number;
  pluginState: TablePluginState;
}

class TableComponent extends React.Component<ComponentProps> {
  state: { scroll: number } = { scroll: 0 };

  private wrapper: HTMLDivElement | null;
  private table: HTMLTableElement | null;

  private leftShadow: HTMLDivElement | null;
  private rightShadow: HTMLDivElement | null;

  constructor(props) {
    super(props);

    // Disable inline table editing and resizing controls in Firefox
    // https://github.com/ProseMirror/prosemirror/issues/432
    if ('execCommand' in document) {
      ['enableObjectResizing', 'enableInlineTableEditing'].forEach(cmd => {
        if (document.queryCommandSupported(cmd)) {
          document.execCommand(cmd, false, 'false');
        }
      });
    }
  }

  componentDidMount() {
    this.props.onComponentMount();

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
    const {
      view,
      node,
      allowColumnResizing,
      pluginState,
      containerWidth,
    } = this.props;
    const {
      pluginConfig: { allowControls = true },
    } = pluginState;
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
    const { isTableHovered, isTableInDanger } = getPluginState(view.state);

    const tableRef = this.table || undefined;
    const tableActive = this.table === pluginState.tableRef;
    const { scroll } = this.state;

    const rowControls = [
      <div
        key={0}
        className={`table-row-controls-wrapper ${
          scroll > 0 ? 'scrolling' : ''
        }`}
      >
        <TableFloatingControls
          editorView={view}
          tableRef={tableRef}
          tableActive={tableActive}
          isTableHovered={isTableHovered}
          isTableInDanger={isTableInDanger}
          isNumberColumnEnabled={node.attrs.isNumberColumnEnabled}
          isHeaderColumnEnabled={checkIfHeaderColumnEnabled(view.state)}
          isHeaderRowEnabled={checkIfHeaderRowEnabled(view.state)}
          hasHeaderRow={containsHeaderRow(view.state, node)}
          // pass `selection` and `tableHeight` to control re-render
          selection={view.state.selection}
          tableHeight={tableRef ? tableRef.offsetHeight : undefined}
        />
      </div>,
    ];

    const columnControls = [
      <div key={0} className="table-column-controls-wrapper">
        <ColumnControls
          editorView={view}
          tableRef={tableRef}
          isTableHovered={isTableHovered}
          isTableInDanger={isTableInDanger}
          // pass `selection` and `numberOfColumns` to control re-render
          selection={view.state.selection}
          numberOfColumns={node.firstChild!.childCount}
        />
      </div>,
    ];

    return (
      <div
        style={{
          width: calcTableWidth(node.attrs.layout, containerWidth),
        }}
        className={`table-container ${tableActive ? 'with-controls' : ''}`}
        data-number-column={node.attrs.isNumberColumnEnabled}
        data-layout={node.attrs.layout}
      >
        {allowControls && rowControls}
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
          {allowControls && columnControls}
        </div>
        {columnShadows}
      </div>
    );
  }

  componentDidUpdate() {
    this.updateShadows();

    if (this.props.allowColumnResizing && this.table) {
      updateColumnsOnResize(
        this.props.node,
        this.table.querySelector('colgroup')!,
        this.table,
        CELL_MIN_WIDTH,
      );
    }
  }

  private handleScroll = (event: Event) => {
    if (!this.wrapper || event.target !== this.wrapper) {
      return;
    }

    this.setState({ scroll: this.wrapper.scrollLeft });
  };

  private updateShadows() {
    if (!this.wrapper || !this.table || !this.leftShadow || !this.rightShadow) {
      return;
    }

    updateShadows(
      this.wrapper,
      this.table,
      this.leftShadow,
      this.rightShadow,
      !!getPluginState(this.props.view.state).tableRef,
    );
  }

  private handleScrollDebounced = rafSchedule(this.handleScroll);
}

export const updateShadows = (
  wrapper,
  table,
  leftShadow,
  rightShadow,
  tableActive: boolean,
) => {
  const { scrollLeft, offsetWidth } = wrapper as HTMLElement;
  const tableOffsetWidth = table.offsetWidth;

  const diff = tableOffsetWidth - offsetWidth;
  const scrollDiff = scrollLeft - diff > 0 ? scrollLeft - diff : 0;
  const width = diff
    ? Math.min(SHADOW_MAX_WIDTH, SHADOW_MAX_WIDTH - scrollDiff + 2)
    : 0;

  const paddingLeft = getComputedStyle(wrapper.parentElement!).paddingLeft;
  const paddingLeftPx = paddingLeft
    ? Number(paddingLeft.substr(0, paddingLeft.length - 2))
    : 0;

  leftShadow.style.left = `${paddingLeftPx + 1}px`;
  leftShadow.style.width = `${Math.min(scrollLeft, SHADOW_MAX_WIDTH)}px`;

  rightShadow.style.left = `${offsetWidth -
    (diff ? width : SHADOW_MAX_WIDTH) -
    scrollDiff +
    paddingLeftPx}px`;

  const rightDiff =
    diff - scrollLeft - 1 + (tableActive ? akEditorTableToolbarSize : 0);
  const rightWidth = rightDiff > 0 ? Math.min(rightDiff, SHADOW_MAX_WIDTH) : 0;
  rightShadow.style.width = `${rightWidth}px`;

  // fix shadow height
  const height =
    table.offsetHeight + (tableActive ? akEditorTableToolbarSize : 0) - 1;

  leftShadow.style.height = `${height}px`;
  rightShadow.style.height = `${height}px`;
};

export default TableComponent;
