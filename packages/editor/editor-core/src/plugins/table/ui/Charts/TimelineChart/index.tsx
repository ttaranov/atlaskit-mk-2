import * as React from 'react';
import { TimelineDataset } from '../../../graphs';
import { upscaleCanvas, COLORS } from '../utils';
import { akEditorFullPageMaxWidth } from '@atlaskit/editor-common';

export interface Props {
  data: TimelineDataset;
  colors?: Array<string>;
  height?: number;
  width?: number;

  itemHeight?: number;
  itemPadding?: number;

  textPaddingLeft?: number;
  viewportPaddingPct?: number;
}

export default class TimelineChart extends React.Component<Props, any> {
  state = {
    viewportStart: 0,
    viewportEnd: 0,
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
      };
    }

    return null;
  }

  render() {
    return (
      <canvas
        ref={this.handleRef}
        height={this.props.height}
        width={this.props.width}
      />
    );
  }

  private drawTimeline = () => {
    const canvas = this.canvas!;
    const ctx = canvas.getContext('2d')!;

    const { data, itemHeight, textPaddingLeft } = this.props;
    const { viewportStart, viewportEnd } = this.state;
    const viewportRange = viewportEnd - viewportStart;

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // setup label stuff
    const textHeight = itemHeight! / 3;
    ctx.font = `${textHeight!}px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`;

    let top = 0;
    data.entries.forEach((entry, entryIdx) => {
      const leftPct = (entry.start - viewportStart) / viewportRange;
      const endPct = (entry.end - viewportStart) / viewportRange;

      const left = leftPct * this.props.width!;
      const end = endPct * this.props.width!;

      const width = end - left;

      // draw bar
      ctx.fillStyle = this.props.colors![entryIdx];
      ctx.fillRect(left, top, width, this.props.itemHeight!);

      // apply label
      ctx.fillStyle = 'white';
      ctx.fillText(
        entry.title,
        left + textPaddingLeft!,
        top + itemHeight! / 2 + textHeight / 3,
      );

      top += itemHeight! + this.props.itemPadding!;
    });
  };

  private handleRef = ref => {
    if (ref) {
      this.canvas = ref;
      upscaleCanvas(ref, this.props.width!, this.props.height!);
      this.drawTimeline();
    }
  };
}
