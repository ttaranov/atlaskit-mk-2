// @flow
import React, { PureComponent, type ElementType } from 'react';
import styled, { css } from 'styled-components';
import { borderRadius, colors, themed } from '@atlaskit/theme';

export const TreeRowContainer = styled.div`
  border-bottom: 1px solid #ebecf0; /*N30*/
`;

export const TreeCell = styled.div`
  box-sizing: border-box;
  display: inline-block;
  ${props => css`
    width: ${props.width};
    padding: 10px 10px 10px ${20 * props.indentLevel}px;
  `};
`;

export const BulletIcon = styled.span`
  display: inline-block
  width: 2.0em
  text-align: center
`;
