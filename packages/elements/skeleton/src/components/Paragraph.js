// @flow

import React, { Component } from 'react';

import StyledParagraph from '../styled/Paragraph';
import type { SkeletonComponentProps } from '../types';

// Intersection with an empty type is needed for the
// prop types to be extracted in the docs
type Props = SkeletonComponentProps & {};

export class Paragraph extends Component<Props> {
  static defaultProps = {
    appearance: 'normal',
  };

  render() {
    return <StyledParagraph {...this.props} />;
  }
}
