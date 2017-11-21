// @flow
import React, { PureComponent, type ElementType } from 'react';

import styled, { css } from 'styled-components';
import { borderRadius, colors, themed } from '@atlaskit/theme';

export default class BulletIcon extends PureComponent {
  render() {
    const Element = styled.span`
      display: inline-block
      width: 2.0em
      text-align: center
    `;
    return <Element>{this.props.children}</Element>;
  }
}
