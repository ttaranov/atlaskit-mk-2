// @flow

import React, { Component } from 'react';

import StyledParagraph from '../styled/Paragraph';

type Props = {
  color?: string,
};

export class Paragraph extends Component<Props> {
  render() {
    return <StyledParagraph {...this.props} />;
  }
}
