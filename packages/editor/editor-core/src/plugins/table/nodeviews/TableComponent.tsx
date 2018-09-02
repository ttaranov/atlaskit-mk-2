import * as React from 'react';
import rafSchedule from 'raf-schd';
import { updateColumnsOnResize } from 'prosemirror-tables';
import { replaceParentNodeOfType } from 'prosemirror-utils';
import { Selection } from 'prosemirror-state';
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
import PieChart from '../ui/Charts/PieChart';
import BarChart from '../ui/Charts/BarChart';
import TimelineChart from '../ui/Charts/TimelineChart';
import ChartSettingsMenu from '../ui/Charts/ChartSettingsMenu';
import {
  GraphTransformer,
  NumberTransformer,
  TimelineTransformer,
  DonutSettings,
  TimelineSettings,
  ChartSetting,
} from '../graphs';
import { setViewSetting } from '../actions';

export interface ComponentProps extends Props {
  onComponentMount: () => void;
  contentDOM: (element: HTMLElement | undefined) => void;

  containerWidth: number;
  pluginState: TablePluginState;
}

export interface TableComponentState {
  scroll: number;
  chartType: string;
}

class TableComponent extends React.Component<
  ComponentProps,
  TableComponentState
> {
  state = {
    scroll: 0,
    chartType: 'pie',
  };

  private wrapper: HTMLDivElement | null;
  private table: HTMLTableElement | null;
  private chart: HTMLDivElement | null;
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

  get columnNames() {
    const haveHeaderRow = containsHeaderRow(
      this.props.view.state,
      this.props.node,
    );

    const columnNames: string[] = [];
    if (haveHeaderRow) {
      this.props.node.firstChild!.forEach((col, _, colIdx) => {
        columnNames.push(col.textContent);
      });
    } else {
      for (let i = 0; i < this.props.node.firstChild!.childCount; i++) {
        columnNames.push(`Column ${i}`);
      }
    }

    return columnNames;
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

    let graphTransformer: GraphTransformer | undefined;
    let chartData;
    let availableChartSettings: ChartSetting[] | undefined = undefined;

    const { viewModeSettings, viewMode } = node.attrs;
    const activeViewModeSettings = viewModeSettings;

    if (node.attrs.viewMode === 'donut' || node.attrs.viewMode === 'barchart') {
      graphTransformer = new NumberTransformer(
        view.state,
        node,
        activeViewModeSettings,
      );
      availableChartSettings = DonutSettings;
    } else if (node.attrs.viewMode === 'timeline') {
      graphTransformer = new TimelineTransformer(
        view.state,
        node,
        activeViewModeSettings,
      );
      availableChartSettings = TimelineSettings;
    }

    const componentChartSettings: any = availableChartSettings
      ? availableChartSettings.reduce((componentSettings, setting) => {
          if (
            setting.for === 'component' &&
            activeViewModeSettings[setting.name]
          ) {
            componentSettings[setting.name] =
              activeViewModeSettings[setting.name];
          }

          return componentSettings;
        }, {})
      : {};

    if (graphTransformer) {
      chartData = graphTransformer.toChart();
    }

    const isTableViewMode =
      node.attrs.viewMode !== 'table' && !componentChartSettings.showTable;

    return (
      <div className="table-parent-container">
        <div
          style={{
            width: calcTableWidth(node.attrs.layout, containerWidth),
          }}
          className={`table-container ${isTableViewMode ? '-hidden' : ''} ${
            tableActive ? 'with-controls' : ''
          }`}
          data-number-column={node.attrs.isNumberColumnEnabled}
          data-layout={node.attrs.layout}
          data-viewmode={node.attrs.viewMode}
          data-viewmode-settings={JSON.stringify(node.attrs.viewModeSettings)}
          data-summary-row={node.attrs.isSummaryRowEnabled}
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
                  columnNames={this.columnNames}
                  onPopup={this.onChartSettingsPopup}
                  availableChartSettings={
                    availableChartSettings ? availableChartSettings : []
                  }
                  currentSettings={viewModeSettings}
                  tableNode={node}
                  state={view.state}
                  onChange={(key, value) => {
                    const currentSettings = viewModeSettings;
                    currentSettings[key] = value;
                    setViewSetting(viewMode, currentSettings)(
                      view.state,
                      view.dispatch,
                    );
                  }}
                />
              ) : null}
              {node.attrs.viewMode === 'donut' && (
                <PieChart
                  data={chartData.entries}
                  {...componentChartSettings}
                />
              )}
              {node.attrs.viewMode === 'barchart' && (
                <BarChart
                  data={chartData.entries}
                  {...componentChartSettings}
                />
              )}
              {node.attrs.viewMode === 'timeline' && (
                <TimelineChart
                  data={chartData}
                  chartSelected={this.isChartSelected(pluginState)}
                  {...componentChartSettings}
                  onChartData={newChartData => {
                    const node = graphTransformer!.fromChart(
                      newChartData,
                      view.state.schema,
                    );
                    const { state, dispatch } = view;
                    dispatch(
                      replaceParentNodeOfType(state.schema.nodes.table, node)(
                        state.tr,
                      ),
                    );
                  }}
                />
              )}
            </div>
          )}
      </div>
    );
  }

  onChartSettingsPopup = isOpen => {
    this.setState({});
  };

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

  private handleChartClick = event => {
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
    const { tableRef } = pluginState;
    if (!tableRef) {
      return false;
    }
    let node = tableRef;
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
