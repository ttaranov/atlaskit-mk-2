import styled from 'styled-components';
import { akColorN30 } from '@atlaskit/util-shared-styles';
import { ellipsis, borderRadius, size } from '../../../styles';
import { title, description } from '../../../styles/cardDetails';

const thumbnailWidth = 40;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding: 8px 12px 8px 12px;
`;

export const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0;
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
  min-width: 0;
`;

export const Title = styled.div`
  ${title} ${ellipsis('100%')};
`;

export const Description = styled.div`
  margin-top: 4px;
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
