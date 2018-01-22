// @flow

import React, { Component } from 'react';

import StyledAvatar from '../styled/Avatar';

type Props = {
  color?: string,
  size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge',
};

export class Avatar extends Component<Props> {
  static defaultProps = {
    size: 'medium',
  };

  render() {
    return <StyledAvatar {...this.props} />;
  }
}
