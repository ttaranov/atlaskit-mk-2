import styled, { css } from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { akColorN30 } from '@atlaskit/util-shared-styles';
import { ellipsis, borderRadius, size } from '../../../styles';
import newCardDetailsHeight from '../../../shared/newCardDetailsHeight';

const thumbnailWidth = 40;

import { akColorN900, akColorN300 } from '@atlaskit/util-shared-styles';

const title = css`
  color: ${akColorN900};
  font-size: 16px;
  font-weight: 500;
  line-height: ${20 / 16};
`;

const description = css`
  color: ${akColorN300};
  font-size: 12px;
  line-height: ${16 / 12};
`;

export const ContentWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  height: ${newCardDetailsHeight}px;
  padding: 8px 12px 8px 12px;
`;

export const BodyWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0; /* for Chrome ellipsis */
  flex-basis: 0; /* for IE ellipsis */
`;

export const TopWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
`;

export const LeftWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  min-width: ${thumbnailWidth}px;
`;

export const CopyWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  flex-grow: 1;
  min-width: 0; /* for Chrome ellipsis */
  flex-basis: 0; /* for IE ellipsis */
`;

export const Title: ComponentClass<HTMLAttributes<{}>> = styled.div`
  ${title} ${ellipsis('100%')};
`;

export const Description: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin-top: 4px;
  height: 16px;
  ${description} ${ellipsis('100%')};
`;

export interface BottomWrapperProps {
  padLeft: boolean;
}

export const BottomWrapper: ComponentClass<
  HTMLAttributes<{}> & BottomWrapperProps
> = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
  ${({ padLeft }: BottomWrapperProps) => {
    if (padLeft) {
      return `margin-left: ${thumbnailWidth + 8}px`;
    } else {
      return '';
    }
  }};
`;

export interface ThumbnailProps {
  src: string;
}

export const Thumbnail: ComponentClass<
  HTMLAttributes<{}> & ThumbnailProps
> = styled.div`
  ${borderRadius} ${size(32)} background-color: ${akColorN30};
  background-image: url(${({ src }: ThumbnailProps) => src});
  background-size: cover;
`;
