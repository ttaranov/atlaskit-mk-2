// @flow
import styled, { css } from 'styled-components';
import { colors, themed } from '@atlaskit/theme';
import { itemSpacing } from '../../constants';

const getFocusColor = themed('appearance', {
  connectivity: { light: colors.B500, dark: colors.B200 },
  confirmation: { light: colors.G400, dark: colors.G400 },
  info: { light: colors.P500, dark: colors.P300 },
  warning: { light: colors.Y500, dark: colors.Y500 },
  error: { light: colors.R500, dark: colors.R500 },
});

export const Root = styled.div`
  display: inline-block;
  max-width: 100%;
  &:focus {
    outline: 1px solid ${getFocusColor};
  }
`;

export const ButtonContents = styled.div`
  align-items: center;
  display: flex;
  text-decoration: none;
  ${({ isHovered }) =>
    isHovered &&
    css`
      color: ${colors.N600};
      text-decoration: underline;
    `};
`;

const getTitleColor = themed({ light: colors.N600, dark: colors.DN600 });
const getTextColor = themed({ light: colors.N300, dark: colors.DN100 });

export const Title = styled.span`
  color: ${getTitleColor};
  font-weight: 500;
  padding: 0 ${itemSpacing}px;
`;

export const Text = styled.span`
  color: ${getTextColor};
  padding: 0 ${itemSpacing}px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
