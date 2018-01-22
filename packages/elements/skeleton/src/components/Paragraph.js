// @flow

import React, { Component } from 'react';

import StyledParagraph from '../styled/Paragraph';
import type { SkeletonComponentProps } from '../types';

type Props = SkeletonComponentProps & {
  color?: string,
};

export class Paragraph extends Component<Props> {
  static defaultProps = {
    size: 'medium',
    appearance: 'normal',
  };

  render() {
    return <StyledParagraph {...this.props} />;
  }
}
