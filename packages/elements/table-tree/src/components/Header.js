// @flow
import React, { Component } from 'react';
import { Header as StyledHeader } from '../styled';
import withColumnWidth from './withColumnWidth';
import type { CSSWidth } from '../types';

type Props = {
  /** The width of the Headers and Cells in this column. A CSS length string. Unitless numbers are interpreted as pixels. */
  columnWidth?: Array<CSSWidth>,

  /** If true, this cell will keep its text on one line and cut overflow with an ellipsis. */
  singleLine?: boolean,
};

class Header extends Component<Props> {
  render() {
    const { props } = this;
    return <StyledHeader {...props}>{props.children}</StyledHeader>;
  }
}

export default withColumnWidth(Header);
