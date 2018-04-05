import * as React from 'react';
import { style } from 'typestyle';
import * as cx from 'classnames';
import { colors } from '@atlaskit/theme';

export const countStyle = style({
  flex: 'auto',
  fontSize: '12px',
  lineHeight: '24px',
  minWidth: '12px',
  color: colors.N90,
});

export const highlightStyle = style({
  color: colors.B400,
  fontWeight: 600,
});

export type Props = {
  value: number;
  highlight?: boolean;
  limit?: number;
  overLimitLabel?: string;
  className?: string;
};

export default class Counter extends React.PureComponent<Props> {
  static defaultProps = {
    highlight: false,
    limit: 100,
    overLimitLabel: '99+',
    className: undefined,
  };

  private getLabel = (): string => {
    const { value, limit, overLimitLabel } = this.props;
    if (limit && value >= limit) {
      return overLimitLabel || '';
    } else {
      return value.toString();
    }
  };

  render() {
    const label = this.getLabel();

    const className = cx(countStyle, this.props.className, {
      [highlightStyle]: this.props.highlight,
    });

    return (
      <div className={className} style={{ width: label.length * 10 }}>
        {label}
      </div>
    );
  }
}
