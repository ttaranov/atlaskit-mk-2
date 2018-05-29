import * as React from 'react';
import { TimelineDataset } from '../../../graphs';
import { COLORS } from '../utils';
import { akEditorFullPageMaxWidth } from '@atlaskit/editor-common';
import { TimelineContainer, TimelineEntry } from './styles';

export interface Props {
  data: TimelineDataset;
  colors?: Array<string>;
  height?: number;
  width?: number;

  itemHeight?: number;
  itemPadding?: number;

  textPaddingLeft?: number;
  viewportPaddingPct?: number;
  chartSelected: boolean;
}

export default class TimelineChart extends React.Component<Props, any> {
  state = {
    viewportStart: 0,
    viewportEnd: 0,
    startExtent: 0,
    endExtent: 0,
    dragging: false,
    dragStart: undefined,
  };

  canvas?: HTMLCanvasElement;

  static defaultProps = {
    colors: COLORS,
    height: 250,
    width: akEditorFullPageMaxWidth,

    itemHeight: 40,
    itemPadding: 12,

    textPaddingLeft: 8,
    textPaddingTopBottom: 8,

    viewportPaddingPct: 5,
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
          : currentEntry.end > extent
      ) {
        return currentEntry[what];
      }

      return extent;
    }, data.entries[0][what]);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.viewportStart === 0 && state.viewportEnd === 0) {
      const viewportStart = TimelineChart.findTimeExtent(props.data, 'start');
      const viewportEnd = TimelineChart.findTimeExtent(props.data, 'end');

      const viewportRange = viewportEnd - viewportStart;

      return {
        ...state,
        viewportStart:
          viewportStart - viewportRange * (props.viewportPaddingPct / 100),
        viewportEnd:
          viewportEnd + viewportRange * (props.viewportPaddingPct / 100),
        startExtent: viewportStart,
        endExtent: viewportEnd,
      };
    }

    return null;
  }

  render() {
    const swimlanes = this.drawTimeline();
    return (
      <TimelineContainer
        dragging={this.state.dragging}
        onWheel={this.onWheel}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
      >
        {swimlanes}
      </TimelineContainer>
    );
  }

  private onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.buttons & 1) {
      const boundingRect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - boundingRect.left;

      this.setState({
        dragging: true,
        dragStart: x,
      });

      // allow the original event to select the graph, otherwise eat the click
      if (this.props.chartSelected) {
        event.preventDefault();
      }
    }
  };

  private onMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!this.state.dragging) {
      return;
    }

    this.setState({
      dragging: false,
      dragStart: undefined,
    });
  };

  private onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!this.state.dragging) {
      return;
    }

    const boundingRect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - boundingRect.left;

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

  private drawTimeline = () => {
    const { data } = this.props;
    const { viewportStart, viewportEnd } = this.state;
    const viewportRange = viewportEnd - viewportStart;

    const swimlanes: JSX.Element[] = [];
    data.entries.forEach((entry, entryIdx) => {
      const leftPct = (entry.start - viewportStart) / viewportRange;
      const endPct = (entry.end - viewportStart) / viewportRange;

      const left = leftPct * this.props.width!;
      const end = endPct * this.props.width!;

      const width = end - left;

      swimlanes.push(
        <TimelineEntry
          key={entryIdx}
          style={{
            left: `${left}px`,
            width: `${width}px`,
            backgroundColor: this.props.colors![entryIdx],
          }}
        >
          {entry.title}
        </TimelineEntry>,
      );
    });

    return swimlanes;
  };
}
