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
import { NumberChartEntry } from '../../graphs';

const degreesToRadians = (degs: number) => {
  return degs / 360 * (2 * Math.PI);
};

const COLORS = [
  akColorP300,
  akColorG300,
  akColorR300,
  akColorY300,
  akColorB300,
  akColorT300,
  akColorN300,
];

const getPixelRatio = () => {
  const ctx = document.createElement('canvas').getContext('2d') as any;
  const devicePixelRatio = window.devicePixelRatio || 1;
  const backingStoreRatio =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;
  return devicePixelRatio / backingStoreRatio;
};

export interface Props {
  data: Array<NumberChartEntry>;
  dividerWidth?: number;
  colors?: Array<string>;
  lineWidth?: number;
  legentAlignment?: 'left' | 'right';
  size?: number;
}

export interface State {
  pixelRatio: number;
}

export default class PieChart extends React.Component<Props, State> {
  canvas?: HTMLCanvasElement;

  state: State = {
    pixelRatio: getPixelRatio(),
  };

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
      this.canvas = ref;
      const { pixelRatio } = this.state;

      // upscale the canvas
      // @see https://www.html5rocks.com/en/tutorials/canvas/hidpi/
      if (pixelRatio !== 1) {
        const ctx = ref.getContext('2d')!;
        const size = this.props.size!;
        ref.width = size * pixelRatio;
        ref.height = size * pixelRatio;
        ref.style.width = size + 'px';
        ref.style.height = size + 'px';
        ctx.scale(pixelRatio, pixelRatio);
      }
      this.drawCanvas();
    }
  };
}
