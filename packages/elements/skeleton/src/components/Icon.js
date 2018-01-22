// @flow

import React, { Component } from 'react';

import StyledIcon from '../styled/Icon';

type Props = {
  color?: string,
  size: 'small' | 'medium' | 'large' | 'xlarge',
};

export class Icon extends Component<Props> {
  static defaultProps = {
    size: 'medium',
  };

  render() {
    return <StyledIcon {...this.props} />;
  }
}
