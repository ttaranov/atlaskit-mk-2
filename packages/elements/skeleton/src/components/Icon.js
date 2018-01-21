// @flow

import React, { Component } from 'react';

import Icon from '../styled/Icon';

type Props = {
  color?: string,
  size: 'small' | 'medium' | 'large' | 'xlarge',
};

export default class extends Component<Props> {
  static defaultProps = {
    size: 'medium',
  };

  render() {
    return <Icon {...this.props} />;
  }
}
