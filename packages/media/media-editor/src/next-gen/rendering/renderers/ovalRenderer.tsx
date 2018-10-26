import * as React from 'react';

import { OvalModel } from '../../scene';
import { colorToCssString } from '../../common';

export interface OvalRendererProps {
  model: OvalModel;
}

export class OvalRenderer extends React.Component<OvalRendererProps, {}> {
  render() {
    const { start, end, color, thickness } = this.props.model;

    const width = Math.abs(start.x - end.x);
    const height = Math.abs(start.y - end.y);
    const xc = (start.x + end.x) / 2;
    const yc = (start.y + end.y) / 2;
    const a = width / Math.SQRT2;
    const b = height / Math.SQRT2;

    return (
      <ellipse
        cx={xc}
        cy={yc}
        rx={a}
        ry={b}
        stroke={colorToCssString(color)}
        strokeWidth={thickness}
        fillOpacity={0}
      />
    );
  }
}
