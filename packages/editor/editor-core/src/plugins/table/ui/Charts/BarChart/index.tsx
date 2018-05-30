import * as React from 'react';

import { COLORS, degreesToRadians, upscaleCanvas } from '../utils';
import { NumberChartEntry } from '../../../graphs';
import ChartLegend from '../ChartLegend';

export interface Props {
  data: Array<NumberChartEntry>;
  dividerWidth?: number;
  colors?: Array<string>;
  lineWidth?: number;
  legentAlignment?: 'left' | 'right';
  size?: number;
}

export default class BarChart extends React.Component<Props, any> {
  canvas?: HTMLCanvasElement;

  static defaultProps = {
    colors: COLORS,
    dividerWidth: 3,
    lineWidth: 50,
    legentAlignment: 'left',
    size: 250,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.drawCanvas();
    }
  }

  render() {
    const { legentAlignment, colors, data } = this.props;

    return (
      <div className={`ProseMirror-chart -legent-${legentAlignment}`}>
        <ChartLegend data={data} colors={colors} />
        <canvas ref={this.handleRef} />
      </div>
    );
  }

  private drawCanvas = () => {
    const canvas = this.canvas!;
    const ctx = canvas.getContext('2d')!;

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const center = this.props.size! / 2;
    const lineWidth = this.props.lineWidth!;
    const dividerWidth = this.props.dividerWidth!;
    const colors = this.props.colors!;
    const radius = center - lineWidth / 2;
    const { data } = this.props;

    const totalValue = data.reduce(
      (r, dataPoint) => r + dataPoint.values[0],
      0,
    );
    let angleFrom = degreesToRadians(-90);
    let colorIdx = 0;
    data.forEach((item, index) => {
      const itemValue = item.values[0];
      const section = itemValue / totalValue * 360;
      const angleTo = angleFrom + degreesToRadians(section);

      // section
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = colors[colorIdx];
      ctx.arc(center, center, radius, angleFrom, angleTo);
      ctx.stroke();

      // divider
      ctx.beginPath();
      ctx.lineWidth = dividerWidth * (index === data.length - 1 ? 1 : 2);
      ctx.strokeStyle = 'white';
      ctx.moveTo(center, center);
      ctx.lineTo(
        center + radius * 2 * Math.cos(angleTo),
        center + radius * 2 * Math.sin(angleTo),
      );
      ctx.stroke();

      angleFrom = angleTo;
      colorIdx++;
      if (colorIdx === colors.length) {
        colorIdx = 0;
      }
    });
  };

  private handleRef = ref => {
    if (ref) {
      upscaleCanvas(ref, this.props.size!, this.props.size!);
      this.canvas = ref;
      this.drawCanvas();
    }
  };
}
