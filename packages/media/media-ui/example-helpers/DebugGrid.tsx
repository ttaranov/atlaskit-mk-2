import * as React from 'react';
import { HTMLAttributes } from 'enzyme';

export interface DebugGridProps {
  width: number;
  height: number;
  hSize?: number;
  vSize?: number;
  bgColor?: string;
  fgColor?: string;
}

export class DebugGrid extends React.Component<
  DebugGridProps & HTMLAttributes,
  {}
> {
  canvas?: HTMLCanvasElement;

  onRef = (canvas: HTMLCanvasElement) => {
    const { width, height, hSize, vSize, bgColor, fgColor } = this.props;
    this.canvas = canvas;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.fillStyle = bgColor!;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = fgColor!;
    for (let y = 0.5; y < height; y += vSize!) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      ctx.closePath();
      for (let x = 0.5; x < width; x += hSize!) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.closePath();
      }
    }
  };

  static defaultProps = {
    hSize: 10,
    vSize: 10,
    bgColor: 'green',
    fgColor: 'white',
  };

  render() {
    return <canvas ref={this.onRef} style={this.props.style} />;
  }
}
