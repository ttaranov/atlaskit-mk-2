// @flow

import React, { Component } from 'react';

import StyledAvatar from '../styled/Avatar';
import type { SkeletonComponentProps } from '../types';

type Props = SkeletonComponentProps & {
  appearance: 'circle' | 'square',
  size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge',
};

export class Avatar extends Component<Props> {
  static defaultProps = {
    appearance: 'circle',
    size: 'medium',
    weight: 'normal',
  };

  render() {
    return <StyledAvatar {...this.props} />;
  }
}
