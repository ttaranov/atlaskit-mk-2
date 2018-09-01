import * as React from 'react';
import { TimelineDataset } from '../../../graphs';
import { COLORS, SELECTED_COLORS, MONTHS } from '../utils';
import { akEditorFullPageMaxWidth } from '@atlaskit/editor-common';
import { TimelineContainer } from './styles';
import TimelineEntry from './TimelineEntry';
import TimelinePoint from './TimelinePoint';
import * as addMonths from 'date-fns/add_months';
import * as startOfMonth from 'date-fns/start_of_month';

export interface Props {
  data: TimelineDataset;
  colors?: Array<string>;
  selectedColors?: Array<string>;
  height?: number;
  width?: number;

  itemHeight?: number;
  itemPadding?: number;

  textPaddingLeft?: number;
  chartSelected: boolean;
  onChartData: (data: TimelineDataset) => void;
  gridlines?: boolean;
}

export interface State {
  viewportStart: number;
  viewportEnd: number;
  dragging: boolean;
  dragStart: number | undefined;
  dragOffset: number;
  selectedEntries: number[];
  resizeDirection: undefined | 'left' | 'right';
  resizeIdx: number | undefined;
}

export default class TimelineChart extends React.Component<Props, State> {
  state: State = {
    viewportStart: 0,
    viewportEnd: 0,
    dragging: false,
    resizeDirection: undefined,

    dragStart: undefined,
    dragOffset: 0,
    selectedEntries: [],
    resizeIdx: undefined,
  };

  canvas?: HTMLCanvasElement;

  static defaultProps = {
    colors: COLORS,
    selectedColors: SELECTED_COLORS,
    height: 250,
    width: akEditorFullPageMaxWidth,

    itemHeight: 40,
    itemPadding: 12,

    textPaddingLeft: 8,
    textPaddingTopBottom: 8,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.drawTimeline();
    }
  }

  static findTimeExtent(data: TimelineDataset, what: 'start' | 'end') {
    return data.entries.reduce((extent, currentEntry) => {
      if (
        what === 'start'
          ? currentEntry.start < extent
          : currentEntry.end! > extent
      ) {
        return currentEntry[what];
      }

      return extent;
    }, data.entries[0][what]!);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.viewportStart === 0 && state.viewportEnd === 0) {
      const viewportStart = TimelineChart.findTimeExtent(props.data, 'start');
      const viewportEnd = TimelineChart.findTimeExtent(props.data, 'end');
      return {
        ...state,
        viewportStart,
        viewportEnd,
      };
    }

    return null;
  }

  render() {
    return (
      <TimelineContainer
        className="ProseMirror-timeline"
        contentEditable={false}
        dragging={this.state.dragging}
        onWheel={this.onWheel}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        onClick={e => {
          this.setState({
            selectedEntries: [],
          });
        }}
      >
        {this.props.gridlines ? this.drawGrid() : null}
        {this.drawTimeline()}
      </TimelineContainer>
    );
  }

  private onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const boundingRect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - boundingRect.left;

    if (this.state.resizeDirection) {
      console.warn('onMouseDown should be handled by TimelineEntry');
    } else if (event.buttons & 1) {
      // handle regular mouse down
      this.setState({
        dragging: true,
        dragStart: x,
      });
    }

    // allow the original event to select the graph, otherwise eat the click
    if (this.props.chartSelected) {
      event.preventDefault();
    }
  };

  private onMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    const { resizeDirection, resizeIdx } = this.state;
    if (resizeDirection !== undefined && resizeIdx !== undefined) {
      const { data } = this.props;

      const dragObj = this.calcStartEndOnDrag(resizeIdx);
      // deep copy
      const newData = JSON.parse(JSON.stringify(data));
      const entry = data.entries[resizeIdx];

      newData.entries[resizeIdx] = {
        ...entry,
        start:
          resizeDirection === 'left' && dragObj.start
            ? dragObj.start
            : entry.start,
        end:
          resizeDirection === 'right' && dragObj.end ? dragObj.end : entry.end,
      };
      this.props.onChartData(newData);
    }

    this.setState({
      dragging: false,
      dragStart: undefined,
      resizeDirection: undefined,
      resizeIdx: undefined,
      dragOffset: 0,
    });
  };

  private onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!this.state.dragging && !this.state.resizeDirection) {
      return;
    }

    const boundingRect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - boundingRect.left;

    if (this.state.resizeDirection) {
      this.setState({
        dragStart: x - this.state.dragOffset,
      });

      return;
    }

    // move the view
    const viewportRange = this.state.viewportEnd - this.state.viewportStart;
    const moveAmount = this.state.dragStart! - x;

    const viewportChange = moveAmount / this.props.width! * viewportRange;

    const viewportStart = this.state.viewportStart + viewportChange;
    const viewportEnd = this.state.viewportEnd + viewportChange;

    this.setState({
      dragStart: x,
      viewportStart,
      viewportEnd,
    });
  };

  private onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();

    let pos = event.clientX - event.currentTarget.getBoundingClientRect().left;
    if (pos < 0) {
      pos = 0;
    }

    const startPct = pos / this.props.width!;
    const endPct = (this.props.width! - pos) / this.props.width!;

    // FIXME: should be scaled based on viewport
    const SCROLL_SCALE = 3000000;

    // take a % of either viewport start or end based on how far from the middle the cursor was
    // closer to the edge we take more of %, the closer to the middle we take 0%
    const delta = event.deltaMode === 0 ? event.deltaY : 30 * event.deltaY;
    const startAdd = delta * SCROLL_SCALE * startPct;
    const endAdd = delta * SCROLL_SCALE * endPct;

    this.setState({
      viewportStart: this.state.viewportStart - startAdd,
      viewportEnd: this.state.viewportEnd + endAdd,
    });
  };

  private drawGrid = () => {
    const { viewportStart, viewportEnd } = this.state;

    // calc start month
    const startDate = new Date(viewportStart);
    const endDate = new Date(viewportEnd);
    const viewportRange = viewportEnd - viewportStart;

    let currentMonthDate = startOfMonth(startDate);
    if (currentMonthDate < startDate) {
      currentMonthDate = addMonths(currentMonthDate, -1);
    }

    let grid: any = [];
    while (currentMonthDate < endDate) {
      const leftPct =
        (currentMonthDate.valueOf() - viewportStart) / viewportRange;
      const left = leftPct * this.props.width!;

      grid.push(
        <div
          className="ProseMirror-timeline_month"
          style={{ left: `${left}px` }}
        >
          <div className="ProseMirror-timeline_month_label">
            {MONTHS[currentMonthDate.getMonth()]}
          </div>
        </div>,
      );

      currentMonthDate = addMonths(currentMonthDate, 1);
    }

    return (
      <div className="ProseMirror-timeline_grid" style={{ userSelect: 'none' }}>
        {grid}
      </div>
    );
  };

  private drawTimeline = () => {
    const { data } = this.props;
    const { viewportStart, viewportEnd } = this.state;
    const viewportRange = viewportEnd - viewportStart;

    const swimlanes: JSX.Element[] = [];
    data.entries.forEach((entry, entryIdx) => {
      let start = entry.start;
      let end = entry.end;

      // see if we need to recalculate a new start or endpoint if resizing
      if (this.state.resizeIdx === entryIdx) {
        const dragObj = this.calcStartEndOnDrag(entryIdx);
        if (dragObj.start) {
          start = dragObj.start;
        }
        if (dragObj.end) {
          end = dragObj.end;
        }
      }
      const leftPct = (start - viewportStart) / viewportRange;
      const leftPx = leftPct * this.props.width!;

      let widthPx = 0;
      if (end) {
        const endPct = (end - viewportStart) / viewportRange;
        const endPx = endPct * this.props.width!;

        widthPx = endPx - leftPx;
      }

      swimlanes.push(
        end ? (
          <TimelineEntry
            key={entryIdx}
            onClick={event => {
              event.stopPropagation();
              event.preventDefault();

              this.selectEntry(entryIdx);
            }}
            selected={this.state.selectedEntries.indexOf(entryIdx) > -1}
            selectedColor={this.props.selectedColors![entryIdx]}
            color={this.props.colors![entryIdx]}
            left={leftPx}
            width={widthPx}
            entry={entry}
            resizing={this.state.resizeIdx === entryIdx}
            startResize={(direction, event) => {
              // const boundingRect = event.currentTarget.parentElement!
              //   .parentElement!.getBoundingClientRect();
              // const x = event.clientX - boundingRect.left;

              this.setState({
                resizeDirection: direction,
                resizeIdx: entryIdx,
                dragStart: leftPx,
                dragOffset: 16, // FIXME: based on padding, should be able to get from client
              });
            }}
          >
            <span>{entry.title}</span>
          </TimelineEntry>
        ) : (
          <TimelinePoint
            key={entryIdx}
            selectedColor={this.props.selectedColors![entryIdx]}
            color={this.props.colors![entryIdx]}
            entry={entry}
            left={leftPx}
          />
        ),
      );
    });

    return <div className="ProseMirror-timeline_swimlanes">{swimlanes}</div>;
  };

  private selectEntry(idx: number) {
    const { selectedEntries } = this.state;

    if (selectedEntries.indexOf(idx) === -1) {
      this.setState({
        selectedEntries: [idx],
      });
    }
  }

  private calcStartEndOnDrag = (
    entryIndex: number,
  ): { start: number; end: number } => {
    const {
      viewportStart,
      viewportEnd,
      resizeDirection,
      dragStart,
    } = this.state;
    const viewportRange = viewportEnd - viewportStart;
    let start;
    let end;

    if (resizeDirection === 'left') {
      start = dragStart! / this.props.width! * viewportRange + viewportStart;
    } else if (resizeDirection === 'right') {
      const _end =
        dragStart! / this.props.width! * viewportRange + viewportStart;
      if (this.props.data.entries[entryIndex].start !== _end) {
        end = _end;
      }
    }

    return { start, end };
  };
}
