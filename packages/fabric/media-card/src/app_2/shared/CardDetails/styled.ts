// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
import { HTMLAttributes, ClassAttributes } from 'react';
import { akColorN30 } from '@atlaskit/util-shared-styles';
import { ellipsis, borderRadius, size } from '../../../styles';
import { title, description } from '../../../styles/cardDetails';
import newCardDetailsHeight from '../../../shared/newCardDetailsHeight';

const thumbnailWidth = 40;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  height: ${newCardDetailsHeight}px;
  padding: 8px 12px 8px 12px;
`;

export const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  /* make ellipsis work */
  overflow: hidden;

  /* 
    move the avatars below the alert - I'd like to not use z-index which can have flow-on affects, 
    but I need to use it because the avatars use z-index 
  */
  z-index: 0;
`;

export const TopWrapper = styled.div`
  display: flex;
`;

export const LeftWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  min-width: ${thumbnailWidth}px;
`;

export const CopyWrapper = styled.div`
  flex-grow: 1;

  /* make ellipsis work */
  overflow: hidden;
`;

export const Title = styled.div`
  ${title} ${ellipsis('100%')};
`;

export const Description = styled.div`
  margin-top: 4px;
  height: 16px;
  ${description} ${ellipsis('100%')};
`;

export interface BottomWrapperProps {
  padLeft: boolean;
}

export const BottomWrapper = styled.div`
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

export const Thumbnail = styled.div`
  ${borderRadius} ${size(32)} background-color: ${akColorN30};
  background-image: url(${({ src }: ThumbnailProps) => src});
  background-size: cover;
`;
