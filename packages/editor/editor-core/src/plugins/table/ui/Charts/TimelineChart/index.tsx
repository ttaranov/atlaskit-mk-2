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
}

export default class TimelineChart extends React.Component<Props, any> {
  canvas?: HTMLCanvasElement;

  static defaultProps = {
    colors: COLORS,
    height: 250,
    width: akEditorFullPageMaxWidth,

    itemHeight: 40,
    itemPadding: 12,

    textPaddingLeft: 8,
    textPaddingTopBottom: 8,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.drawTimeline();
    }
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

  static findLatest(data: TimelineDataset) {
    return data.entries.reduce((latest, currentEntry) => {
      if (currentEntry.end > latest) {
        return currentEntry.end;
      }

      return latest;
    }, data.entries[0].end);
  }

  static findEarliest(data: TimelineDataset) {
    return data.entries.reduce((earliest, currentEntry) => {
      if (currentEntry.start < earliest) {
        return currentEntry.start;
      }

      return earliest;
    }, data.entries[0].start);
  }

  private drawTimeline = () => {
    const canvas = this.canvas!;
    const ctx = canvas.getContext('2d')!;

    const { data, itemHeight, textPaddingLeft } = this.props;

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // end of viewport should be end of data
    // FIXME: separate viewport from data range
    const firstEntry = TimelineChart.findEarliest(data);
    const lastEntry = TimelineChart.findLatest(data);

    // setup label stuff
    const textHeight = itemHeight! / 3;
    ctx.font = `${textHeight!}px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`;

    let top = 0;
    data.entries.forEach((entry, entryIdx) => {
      const leftPct = (entry.start - firstEntry) / (lastEntry - firstEntry);
      const endPct = (entry.end - firstEntry) / (lastEntry - firstEntry);

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
