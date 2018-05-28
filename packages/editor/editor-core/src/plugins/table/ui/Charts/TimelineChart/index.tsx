import * as React from 'react';
import { TimelineDataset } from '../../../graphs';
import { upscaleCanvas, COLORS } from '../utils';

export interface Props {
  data: TimelineDataset;
  colors?: Array<string>;
  height?: number;
  width?: number;
}

export default class TimelineChart extends React.Component<Props, any> {
  canvas?: HTMLCanvasElement;

  static defaultProps = {
    colors: COLORS,
    height: 250,
    width: 500,
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

  private drawTimeline = () => {
    const canvas = this.canvas!;
    const ctx = canvas.getContext('2d')!;

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // figure out range
  };

  private handleRef = ref => {
    if (ref) {
      this.canvas = ref;
      upscaleCanvas(ref, this.props.width!, this.props.height!);
      this.drawTimeline();
    }
  };
}
