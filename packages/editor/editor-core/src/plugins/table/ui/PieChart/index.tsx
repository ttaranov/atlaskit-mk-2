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
    size: 250,
    lineWidth: 35,
  };

  draw(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    // https://coderwall.com/p/vmkk6a/how-to-make-the-canvas-not-look-like-crap-on-retina
    ctx.scale(2, 2);
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

  private handleRef = ref => {
    if (ref) {
      this.draw(ref);
    }
  };
}
