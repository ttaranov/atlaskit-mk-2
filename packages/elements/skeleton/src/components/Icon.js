// @flow

import React, { Component } from 'react';

import StyledIcon from '../styled/Icon';
import type { SkeletonComponentProps } from '../types';

type Props = SkeletonComponentProps & {
  color?: string,
  size: 'small' | 'medium' | 'large' | 'xlarge',
};

export class Icon extends Component<Props> {
  static defaultProps = {
    size: 'medium',
    appearance: 'normal',
  };

  render() {
    return <StyledIcon {...this.props} />;
  }
}
