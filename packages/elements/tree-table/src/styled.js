// @flow
import styled, { css } from 'styled-components';
import { colors, themed } from '@atlaskit/theme';
import React from 'react';

function defaultToPx(length) {
  const number = +length;
  if (number === 0) {
    return 0;
  }
  if (Number.isNaN(number)) {
    return length;
  }
  return `${number}px`;
}

export const iconColor = colors.N800;

export const TreeRowContainer = styled.div`
  border-bottom: 1px solid ${colors.N30};
`;

export const ChevronContainer = styled.span`
  display: inline-block
  width: 20px;
  margin-left: -20px;
`;

const indentWidth = 20;

const commonCell = css`
  box-sizing: border-box;
  display: inline-block;
  padding: 10px ${defaultToPx(indentWidth)};
  ${props =>
    props.columnWidth &&
    css`
      width: ${defaultToPx(props.columnWidth)};
    `};
`;

export const TreeCell = styled.div`
  ${commonCell} ${props =>
      props.indentLevel &&
      css`
        padding-left: ${defaultToPx(indentWidth * props.indentLevel)};
      `};
`;

export const TreeHead = styled.div`
  ${commonCell}
  font-weight: bold;
  font-size: 12px;
  font-weight: bold;
  line-height: 1.67;
  letter-spacing: -0.1px;
  color: ${colors.N800}
  padding-left: ${defaultToPx(indentWidth)};
  padding-bottom: 8px;
`;

export const TreeTableContainer = styled.div``;
