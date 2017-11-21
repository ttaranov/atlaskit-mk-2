// @flow
import React, { PureComponent, type ElementType } from 'react';

import styled, { css } from 'styled-components';
import { borderRadius, colors, themed } from '@atlaskit/theme';

export default class TreeCell extends PureComponent {
  render() {
    const Container = styled.div`
      width: ${this.props.width};
      padding-left: ${this.props.paddingLeft};
      box-sizing: border-box;
      display: inline-block;
    `;
    return <Container>{this.props.children}</Container>;
  }
}
