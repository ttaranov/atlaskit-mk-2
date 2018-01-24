// @flow

import React, { Component } from 'react';

import StyledIcon from '../styled/Icon';
import type { SkeletonComponentProps } from '../types';

type Props = SkeletonComponentProps & {
  size: 'small' | 'medium' | 'large' | 'xlarge',
};

export class Icon extends Component<Props> {
  static defaultProps = {
    size: 'medium',
    weight: 'normal',
  };

  render() {
    return <StyledIcon {...this.props} />;
  }
}
