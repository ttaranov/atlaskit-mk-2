// @flow
import styled, { css } from 'styled-components';
import { borderRadius, colors, themed } from '@atlaskit/theme';

export const TreeRowContainer = styled.div`
  border-bottom: 1px solid ${colors.N30};
`;

export const BulletIcon = styled.span`
  display: inline-block
  width: 20px;
  margin-left: -20px;
  text-align: center;
`;

const indentWidth = 20;

const commonCell = css`
  box-sizing: border-box;
  display: inline-block;
  padding: 10px ${indentWidth}px;
  ${props =>
    props.width &&
    css`
      width: ${props.width};
    `};
`;

export const TreeCell = styled.div`
  ${commonCell} ${props =>
      props.indentLevel &&
      css`
        padding-left: ${indentWidth * props.indentLevel}px;
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
  padding-left: ${indentWidth}px;
  padding-bottom: 8px;
`;
