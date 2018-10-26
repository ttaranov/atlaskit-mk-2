import * as React from 'react';

import { LineModel } from '../../scene';
import { colorToCssString } from '../../common';

export interface LineRendererProps {
  model: LineModel;
}

export class LineRenderer extends React.Component<LineRendererProps, {}> {
  render() {
    const { start, end, color, thickness } = this.props.model;

    return (
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={colorToCssString(color)}
        strokeLinecap="round"
        strokeWidth={thickness}
      />
    );
  }
}
