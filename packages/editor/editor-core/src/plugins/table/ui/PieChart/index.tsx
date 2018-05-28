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

const STROKE_WIDTH = 5;

// improves quality, taken from here: https://coderwall.com/p/vmkk6a/how-to-make-the-canvas-not-look-like-crap-on-retina
const SCALE = 5;

export interface Props {
  data: Array<PieChartEntry>;
  colors?: Array<string>;
  size?: number;
  lineWidth?: number;
  legentAlignment?: 'left' | 'right';
}

export default class PieChart extends React.Component<Props, any> {
  canvas?: HTMLCanvasElement;

  static defaultProps = {
    colors: COLORS,
    size: 250,
    lineWidth: 60,
    legentAlignment: 'left',
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.drawPie();
    }
  }

  render() {
    const { legentAlignment, colors, data } = this.props;

    return (
      <div className={`ProseMirror-piechart -legent-${legentAlignment}`}>
        {this.canvas && (
          <ul className="ProseMirror-piechart_legend">
            {data.map((item, index) => {
              const color = colors![index];
              return (
                <li>
                  <span
                    className="ProseMirror-piechart_bullet"
                    style={{ backgroundColor: color }}
                  />
                  <span className="ProseMirror-piechart_title">
                    {item.title}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <canvas
          ref={this.handleRef}
          height={this.props.size}
          width={this.props.size}
        />
      </div>
    );
  }

  private drawPie = () => {
    const canvas = this.canvas!;
    const ctx = canvas.getContext('2d')!;

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const center = this.props.size! / (2 * SCALE);
    const lineWidth = this.props.lineWidth! / SCALE;
    const colors = this.props.colors!;
    const radius = center - lineWidth / 2;

    const dataTotal = this.props.data.reduce(
      (r, dataPoint) => r + dataPoint.value,
      0,
    );
    let startAngle = degsToRadians(-90);
    let colorIndex = 0;
    this.props.data.forEach((dataPoint, index) => {
      const section = dataPoint.value / dataTotal * 360;
      const endAngle = startAngle + degsToRadians(section);
      const color = colors[colorIndex];
      colorIndex++;
      if (colorIndex >= colors.length) {
        colorIndex = 0;
      }
      // pie section
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.stroke();

      // white stroke
      ctx.beginPath();
      ctx.strokeStyle = 'white';
      ctx.lineWidth =
        (index === this.props.data.length - 1
          ? STROKE_WIDTH / 2
          : STROKE_WIDTH) / SCALE;
      ctx.moveTo(center, center);
      ctx.lineTo(
        center + radius * 2 * Math.cos(endAngle),
        center + radius * 2 * Math.sin(endAngle),
      );
      ctx.stroke();

      startAngle = endAngle;
    });
  };

  private handleRef = ref => {
    if (ref) {
      this.canvas = ref;
      const ctx = ref.getContext('2d')!;
      ctx.scale(SCALE, SCALE);
      this.drawPie();
    }
  };
}
