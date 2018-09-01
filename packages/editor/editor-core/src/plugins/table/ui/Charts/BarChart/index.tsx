import * as React from 'react';

import { COLORS, upscaleCanvas } from '../utils';
import { NumberChartEntry } from '../../../graphs';
import ChartLegend from '../ChartLegend';

export interface Props {
  data: Array<NumberChartEntry>;
  colors?: Array<string>;
  barWidth?: number;
  legendAlignment?: 'left' | 'right';
  size?: number;
  title?: string;
}

export default class BarChart extends React.Component<Props, any> {
  canvas?: HTMLCanvasElement;

  static defaultProps = {
    colors: COLORS,
    barWidth: 50,
    legendAlignment: 'left',
    size: 250,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.drawCanvas();
    }
  }

  render() {
    const { legendAlignment, colors, data, title } = this.props;

    return (
      <div className={`ProseMirror-chart -legend-${legendAlignment}`}>
        <ChartLegend data={data} colors={colors} title={title} />
        <canvas ref={this.handleRef} />
      </div>
    );
  }

  private drawCanvas = () => {
    const canvas = this.canvas!;
    const ctx = canvas.getContext('2d')!;

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const colors = this.props.colors!;
    const { data } = this.props;

    var maxValue = 0;
    data.forEach(item => {
      maxValue = Math.max(maxValue, item.values[0]);
    });
    const width = this.props.size! / data.length;

    let colorIdx = 0;
    data.forEach((item, index) => {
      const itemValue = item.values[0];
      var height = Math.round(this.props.size! * itemValue / maxValue);

      ctx.save();
      ctx.fillStyle = colors[colorIdx];
      ctx.fillRect(index * width, this.props.size! - height, width, height);
      ctx.restore();

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
