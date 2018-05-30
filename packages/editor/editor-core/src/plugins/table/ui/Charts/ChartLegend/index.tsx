import * as React from 'react';

import { COLORS } from '../utils';
import { NumberChartEntry } from '../../../graphs';

export interface Props {
  data: Array<NumberChartEntry>;
  colors?: Array<string>;
}

export default class ChartLegend extends React.Component<Props, any> {
  static defaultProps = {
    colors: COLORS,
  };
  render() {
    const { colors, data } = this.props;

    return (
      <ul className="ProseMirror-chart_legend">
        {data.map((item, index) => {
          const color = colors![index];
          return (
            <li>
              <span
                className="ProseMirror-chart_bullet"
                style={{ backgroundColor: color }}
              />
              <span className="ProseMirror-chart_title">{item.title}</span>
            </li>
          );
        })}
      </ul>
    );
  }
}
