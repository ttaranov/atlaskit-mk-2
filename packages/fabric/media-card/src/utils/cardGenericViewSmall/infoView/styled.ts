/* tslint:disable:variable-name */
import styled from 'styled-components';
import { antialiased, ellipsis } from '../../../styles';
import {
  akGridSizeUnitless,
  akColorN70,
  akColorB300,
  akColorB400,
  akColorB500,
  akColorN900,
} from '@atlaskit/util-shared-styles';

export interface WrapperProps {
  valign?: 'top' | 'bottom';
}

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  ${({ valign }: WrapperProps) => {
    switch (valign) {
      case 'top':
        return 'justify-content: flex-start;';

      case 'bottom':
        return 'justify-content: flex-end;';

      default:
        return 'justify-content: space-around;';
    }
  }};
`;

export const Title = styled.div`
  ${antialiased} ${ellipsis()} font-weight: bold;
  color: ${akColorN900};
  font-size: 12px;
  line-height: 15px;
`;

export const Body = styled.div`
  display: flex;
  align-items: center;
  height: 15px; /* constrain icon height */
  margin-top: 2px;
`;

export const Icon = styled.div`
  display: flex;
  flex-shrink: 0;
  width: ${akGridSizeUnitless * 2.5}px;
  height: ${akGridSizeUnitless * 2}px;
  padding-right: ${akGridSizeUnitless / 2}px;

  & > img {
    width: 100%;
    height: 100%;

    /* prevent default image or alt text from overflowing */
    overflow: hidden;
  }
`;

export interface SubtitleProps {
  isLink?: boolean;
}

export const Subtitle = styled.div`
  ${ellipsis()} color: ${akColorN70};
  font-size: 12px;
  line-height: 15px;
  ${({ isLink }: SubtitleProps) => {
    if (!isLink) {
      return '';
    }

    return `
      color: ${akColorB400};

      .media-card:hover & {
        color: ${akColorB300};
        text-decoration: underline;
      }

      .media-card:active & {
        color: ${akColorB500};
      }

    `;
  }};
`;
