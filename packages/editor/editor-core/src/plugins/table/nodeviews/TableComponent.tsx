import * as React from 'react';
import rafSchedule from 'raf-schd';
import { updateColumnsOnResize } from 'prosemirror-tables';
import { Selection } from 'prosemirror-state';
import { replaceParentNodeOfType } from 'prosemirror-utils';
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
import PieChart from '../ui/Charts/PieChart';
import TimelineChart from '../ui/Charts/TimelineChart';
import ChartSettingsMenu from '../ui/Charts/ChartSettingsMenu';

const isIE11 = browser.ie_version === 11;
const SHADOW_MAX_WIDTH = 8;
const DEFAULT_CELL_MIN_WIDTH = 25;

import { Props } from './table';
import {
  GraphTransformer,
  NumberTransformer,
  TimelineTransformer,
} from '../graphs';

export interface ComponentProps extends Props {
  contentDOM: (element: HTMLElement | undefined) => void;
}

class TableComponent extends React.Component<ComponentProps> {
  private wrapper: HTMLDivElement | null;
  private table: HTMLTableElement | null;
  private chart: HTMLDivElement | null;
  private colgroup: HTMLTableColElement | null;

  private leftShadow: HTMLDivElement | null;
  private rightShadow: HTMLDivElement | null;

  state = {
    chartType: 'pie',
  };

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

      if (this.wrapper && !isIE11) {
        this.wrapper.addEventListener('scroll', this.handleScrollDebounced);
      }
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

    let graphTransformer: GraphTransformer | undefined;
    let chartData;

    if (node.attrs.viewMode === 'donut') {
      graphTransformer = new NumberTransformer(
        this.props.view.state,
        this.props.node,
      );
    } else if (node.attrs.viewMode === 'timeline') {
      graphTransformer = new TimelineTransformer(
        this.props.view.state,
        this.props.node,
      );
    }

    if (graphTransformer) {
      chartData = graphTransformer.toChart();
    }

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
            <div className="table-parent-container">
              <div
                style={{
                  width: calcTableWidth(node.attrs.layout, containerWidth),
                }}
                className={`table-container ${
                  node.attrs.viewMode !== 'table' ? '-hidden' : ''
                }`}
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
                  <table
                    ref={elem => {
                      this.table = elem;
                      this.props.contentDOM(elem ? elem : undefined);
                    }}
                    data-number-column={node.attrs.isNumberColumnEnabled}
                    data-layout={node.attrs.layout}
                    data-autosize={node.attrs.__autoSize}
                    data-viewmode={node.attrs.viewMode}
                  >
                    {allowColumnResizing ? (
                      <colgroup
                        ref={elem => {
                          this.colgroup = elem;
                        }}
                      />
                    ) : null}
                  </table>
                </div>
                {columnShadows}
              </div>
              {node.attrs.viewMode !== 'table' &&
                chartData && (
                  <div
                    className={`ProseMirror-chart-container ${
                      this.isChartSelected(pluginState) ? 'selected' : ''
                    }`}
                    ref={elem => {
                      this.chart = elem;
                    }}
                    onClick={this.handleChartClick}
                  >
                    {this.isChartSelected(pluginState) ? (
                      <ChartSettingsMenu
                        target={this.chart!}
                        onPopup={this.onChartSettingsPopup}
                      />
                    ) : null}
                    {node.attrs.viewMode === 'donut' && (
                      <PieChart
                        data={chartData.entries}
                        legentAlignment="left"
                      />
                    )}
                    {node.attrs.viewMode === 'timeline' && (
                      <TimelineChart
                        data={chartData}
                        chartSelected={this.isChartSelected(pluginState)}
                        onChartData={newChartData => {
                          const node = graphTransformer!.fromChart(
                            newChartData,
                            view.state.schema,
                          );
                          const { state, dispatch } = view;
                          dispatch(
                            replaceParentNodeOfType(
                              state.schema.nodes.table,
                              node,
                            )(state.tr),
                          );
                        }}
                      />
                    )}
                  </div>
                )}
            </div>
          );
        }}
      />
    );
  }

  onChartSettingsPopup = isOpen => {
    this.setState({});
  };

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
    const rightShadowX = offsetWidth - width - scrollDiff + paddingLeftPx;
    this.rightShadow.style.left = `${rightShadowX}px`;
    this.rightShadow.style.width = `${rightShadowX > 0 ? width : 0}px`;
  };

  private handleScrollDebounced = rafSchedule(this.handleScroll);

  private handleChartClick = event => {
    // event.preventDefault();

    let target = event.currentTarget;
    let toolbarTarget;
    while (target) {
      if (
        target.className === 'table-parent-container' ||
        target.className === 'ProseMirror-chart-container'
      ) {
        toolbarTarget = target;
        break;
      }
      target = target.parentNode as HTMLElement;
    }

    if (toolbarTarget) {
      const { state, dispatch } = this.props.view;
      const tablePos = (this.props.view as any).posAtDOM(toolbarTarget);
      dispatch(
        state.tr.setSelection(Selection.near(state.doc.resolve(tablePos))),
      );
    }
  };

  private isChartSelected = pluginState => {
    const { tableElement, tableActive } = pluginState;
    if (!tableElement || !tableActive) {
      return false;
    }
    let node = tableElement;
    let toolbarTarget;
    while (node) {
      if (
        node.className === 'table-parent-container' ||
        node.className === 'ProseMirror-chart-container'
      ) {
        toolbarTarget = node;
        break;
      }
      node = node.parentNode as HTMLElement;
    }

    return toolbarTarget.contains(this.chart) || toolbarTarget === this.chart;
  };
}

export default TableComponent;
