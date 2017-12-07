import styled, { css } from 'styled-components';

import {
  akColorN20,
  akColorN30,
  akColorB50,
  akColorN300,
  akFontFamily,
} from '@atlaskit/util-shared-styles';
import { borderRadius, size, linkCardShadow, ellipsis } from '../../styles';

export interface WrapperProps {
  href?: string;
  minWidth?: number;
  maxWidth?: number;
}

const wrapperStyles = css`
  box-sizing: border-box;
  font-family: ${akFontFamily};
  padding: 0 8px 8px 8px;
  ${borderRadius} ${({ minWidth }: WrapperProps) => {
      if (minWidth) {
        return `min-width: ${minWidth}px`;
      } else {
        return '';
      }
    }} ${({ maxWidth }: WrapperProps) => {
      if (maxWidth) {
        return `max-width: ${maxWidth}px`;
      } else {
        return '';
      }
    }} ${({ href }: WrapperProps) => {
      if (href) {
        return `
          cursor: pointer;
          &:hover {
            background-color: ${akColorN30};
          }
          &:active {
            background-color: ${akColorB50};
          }
        `;
      } else {
        return '';
      }
    }} user-select: none;
  background-color: ${akColorN20};
  line-height: initial;
  transition: background 0.3s;
`;

export const LinkWrapper = styled.a`
  ${wrapperStyles} display: block;
  &:hover {
    text-decoration: none;
  }
`;

export const Wrapper = styled.div`
  ${wrapperStyles};
`;

export const Header = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  color: ${akColorN300};
`;

export interface PlaceholderProps {
  isPlaceholder: boolean;
}

export const IconWrapper = styled.div`
  ${borderRadius} ${size(16)} ${({ isPlaceholder }: PlaceholderProps) => {
      if (isPlaceholder) {
        return `
        background-color: ${akColorN30};
      `;
      } else {
        return '';
      }
    }} margin-right: 4px;
`;

export const TextWrapper = styled.div`
  ${({ isPlaceholder }: PlaceholderProps) => {
    if (isPlaceholder) {
      return `
        ${borderRadius}
        width: 125px;
        height: 12px;
        background-color: ${akColorN30};
      `;
    } else {
      return '';
    }
  }} color: ${akColorN300};
  font-size: 12px;
  line-height: 16px;
  ${ellipsis('none')};
`;

export const Content = styled.div`
  ${borderRadius} ${linkCardShadow} background-color: white;
  transition: box-shadow 0.3s;

  .media-card-link:hover & {
    box-shadow: 0 4px 8px -2px rgba(23, 43, 77, 0.32),
      0 0 1px rgba(23, 43, 77, 0.25);
  }
`;
