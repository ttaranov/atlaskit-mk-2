import * as React from 'react';
import {
  akColorB300,
  akColorR300,
  akColorY300,
  akColorG300,
  akColorP300,
  akColorT300,
  akColorN300,
} from '@atlaskit/util-shared-styles';
import { PieChartEntry } from '../../nodeviews/graphs/transformer';

export const degsToRadians = (degs: number) => {
  return degs / 360 * (2 * Math.PI);
};

const COLORS = [
  akColorB300,
  akColorR300,
  akColorY300,
  akColorG300,
  akColorP300,
  akColorT300,
  akColorN300,
];

const CANVAS_SIZE = 250;
const LINE_WIDTH = 35;

export interface Props {
  data: Array<PieChartEntry>;
  colors?: Array<string>;
  size?: number;
  lineWidth?: number;
}

export default class PieChart extends React.Component<Props, any> {
  canvas?: HTMLCanvasElement;

  static defaultProps = {
    colors: COLORS,
    size: CANVAS_SIZE,
    lineWidth: LINE_WIDTH,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.draw();
    }
  }

  render() {
    return (
      <canvas
        ref={this.handleRef}
        height={this.props.size}
        width={this.props.size}
      />
    );
  }

  private draw = () => {
    const canvas = this.canvas!;
    const ctx = canvas.getContext('2d')!;

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const center = this.props.size! / 4;
    const lineWidth = this.props.lineWidth!;
    const colors = this.props.colors!;
    const radius = center - lineWidth / 2;
    ctx.lineWidth = lineWidth;

    const dataTotal = this.props.data.reduce(
      (r, dataPoint) => r + dataPoint.value,
      0,
    );
    let startAngle = degsToRadians(-90);
    let colorIndex = 0;
    this.props.data.forEach((dataPoint, i) => {
      const section = dataPoint.value / dataTotal * 360;
      const endAngle = startAngle + degsToRadians(section);
      const color = colors[colorIndex];
      colorIndex++;
      if (colorIndex >= colors.length) {
        colorIndex = 0;
      }
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.stroke();
      startAngle = endAngle;
    });
  };

  private handleRef = ref => {
    if (ref) {
      this.canvas = ref;
      const ctx = ref.getContext('2d')!;
      // improves quality, taken from here: https://coderwall.com/p/vmkk6a/how-to-make-the-canvas-not-look-like-crap-on-retina
      ctx.scale(2, 2);
      this.draw();
    }
  };
}
