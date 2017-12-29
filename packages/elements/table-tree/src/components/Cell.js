// @flow
import React, { Component } from 'react';
import { Cell as StyledCell } from '../styled';
import withColumnWidth from './withColumnWidth';
import type { CSSWidth } from '../types';

type Props = {
  /** The width of the Headers and Cells in this column. A CSS length string. Unitless numbers are interpreted as pixels. */
  columnWidth?: Array<CSSWidth>,
};

class Cell extends Component<Props> {
  render() {
    const { props } = this;
    return <StyledCell {...props}>{props.children}</StyledCell>;
  }
}

export default withColumnWidth(Cell);
