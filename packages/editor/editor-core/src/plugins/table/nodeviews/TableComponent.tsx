import * as React from 'react';
import rafSchedule from 'raf-schd';
import { updateColumnsOnResize } from 'prosemirror-tables';
import { browser, akEditorTableToolbarSize } from '@atlaskit/editor-common';
import TableFloatingControls from '../ui/TableFloatingControls';
import ColumnControls from '../ui/TableFloatingControls/ColumnControls';
import { stateKey } from '../pm-plugins/main';
import { pluginKey as hoverSelectionPluginKey } from '../pm-plugins/hover-selection-plugin';

import { pluginKey as widthPluginKey } from '../../width';

import WithPluginState from '../../../ui/WithPluginState';
import { calcTableWidth } from '@atlaskit/editor-common';
import { CELL_MIN_WIDTH } from '../';

const isIE11 = browser.ie_version === 11;
const SHADOW_MAX_WIDTH = 8;

import { Props } from './table';
import { containsHeaderRow } from '../utils';

export interface ComponentProps extends Props {
  onComponentUpdate: () => void;
  contentDOM: (element: HTMLElement | undefined) => void;
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
          const tableActive = this.table === pluginState.tableRef;
          const { scroll } = this.state;
          return (
            <div
              style={{
                width: calcTableWidth(node.attrs.layout, containerWidth),
              }}
              className={`table-container ${
                tableActive ? 'with-controls' : ''
              }`}
              data-number-column={node.attrs.isNumberColumnEnabled}
              data-layout={node.attrs.layout}
            >
              <div
                className={`table-row-controls-wrapper ${
                  scroll > 0 ? 'scrolling' : ''
                }`}
              >
                <TableFloatingControls
                  editorView={view}
                  tableRef={this.table || undefined}
                  tableActive={tableActive}
                  isTableHovered={isTableHovered}
                  isTableInDanger={isTableInDanger}
                  isNumberColumnEnabled={node.attrs.isNumberColumnEnabled}
                  hasHeaderRow={containsHeaderRow(view.state, node)}
                  scroll={scroll}
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
                    tableRef={pluginState.tableRef}
                    isTableHovered={isTableHovered}
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
    this.props.onComponentUpdate();
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
    this.updateShadows();
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
      !!stateKey.getState(this.props.view.state).tableRef,
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
