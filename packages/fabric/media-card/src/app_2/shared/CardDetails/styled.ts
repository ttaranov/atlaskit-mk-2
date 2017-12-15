import styled from 'styled-components';
import { ellipsis } from '../../../styles';
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
