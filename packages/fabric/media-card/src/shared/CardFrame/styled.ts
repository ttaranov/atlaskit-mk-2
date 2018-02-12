import styled, { css } from 'styled-components';

import {
  akColorN20,
  akColorN30,
  akColorB50,
  akColorN300,
  akFontFamily,
} from '@atlaskit/util-shared-styles';
import { borderRadius, size, linkCardShadow, ellipsis } from '../../styles';

const wrapperPadding = 8;
export const className = 'media-card-frame';

export interface WrapperProps {
  isInteractive?: boolean;
  minWidth?: number;
  maxWidth?: number;
}

/*

  Conversation confirming widths with @Scotty:

  # (Standalone links/smart-cards with a feature image) OR (Filmstrip links/smart-cards):

    width: 100% => take up the full width of the container
    max-width: 400px; but don't go larger than 400px
    min-width: 240px; but don't go smaller than 240px

      => so they'll all be 400px unless someone resizes the window

  # (Standalone links/smart-cards without a feature image):

    width: 100% => take up the full width of the container
    max-width: 644px; but don't go larger than 664px
    min-width: 240px; but don't go smaller than 240px

      => so they'll all be 664px unless someone resizes the window

 */

const wrapperStyles = css`
  display: inline-flex;
  flex-direction: column;
  box-sizing: border-box;
  font-family: ${akFontFamily};
  padding: 0 ${wrapperPadding}px ${wrapperPadding}px ${wrapperPadding}px;
  ${borderRadius} width: 100%;
  ${({ minWidth }: WrapperProps) => {
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
    }} ${({ isInteractive }: WrapperProps) => {
      if (isInteractive) {
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

export interface ContentProps {
  maxWidth?: number;
}

export const LinkWrapper = styled.a`
  ${wrapperStyles} &:hover {
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

export interface ContentProps {
  isInteractive: boolean;
}

export const Content = styled.div`
  position: relative;

  ${borderRadius} ${linkCardShadow} background-color: white;
  transition: box-shadow 0.3s;

  ${({ isInteractive }: ContentProps) => {
    if (isInteractive) {
      return ` 
          .${className}:hover & {
            box-shadow: 0 4px 8px -2px rgba(23, 43, 77, 0.32),
              0 0 1px rgba(23, 43, 77, 0.25);
          }
        `;
    } else {
      return '';
    }
  }};
`;
