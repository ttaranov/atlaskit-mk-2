import * as React from 'react';

import { RectangleModel } from '../../scene';
import { colorToCssString } from '../../common';

export interface RectangleRendererProps {
  model: RectangleModel;
}

export class RectangleRenderer extends React.Component<
  RectangleRendererProps,
  {}
> {
  render() {
    const { start, end, color, thickness } = this.props.model;

    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const width = Math.abs(start.x - end.x);
    const height = Math.abs(start.y - end.y);
    const cornerRadius = thickness / 4.0;

    return (
      <rect
        stroke={colorToCssString(color)}
        strokeWidth={thickness}
        x={x}
        y={y}
        width={width}
        height={height}
        rx={cornerRadius}
        ry={cornerRadius}
        fillOpacity={0}
      />
    );
  }
}
