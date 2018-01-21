// @flow

import React, { Component } from 'react';

import Paragraph from '../styled/Paragraph';

type Props = {
  color?: string,
};

export default class extends Component<Props> {
  render() {
    return <Paragraph {...this.props} />;
  }
}
