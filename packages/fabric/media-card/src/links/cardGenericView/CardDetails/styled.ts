import styled from 'styled-components';
import {
  akColorN800,
  akColorN300,
  akColorN30,
} from '@atlaskit/util-shared-styles';
import { size, ellipsis, borderRadius } from '../../../styles';
import newCardDetailsHeight from '../../../shared/newCardDetailsHeight';

export interface PlaceholderProps {
  isPlaceholder: boolean;
}

const placeholder = `
  ${borderRadius}
  background-color: ${akColorN30};
`;

export const Wrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  height: ${newCardDetailsHeight}px;
  padding: 8px;
`;

export const ContentWrapper = styled.div`
  flex-grow: 1;
  overflow: hidden;
  padding: 0 4px;
`;

export const Title = styled.div`
  ${ellipsis('100%')} color: ${akColorN800};
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  user-select: text;
`;

export const TitlePlaceholder = styled.div`
  height: 16px;
  margin-top: 2px;
  ${placeholder};
`;

export const Description = styled.div`
  overflow: hidden;
  margin-top: 8px;
  margin-bottom: 8px;
  color: ${akColorN300};
  font-size: 12px;
  line-height: 18px;
  user-select: text;
`;

export const DescriptionPlaceholder1 = styled.div`
  height: 12px;
  width: 85%;
  margin-top: 13px;
  ${placeholder};
`;

export const DescriptionPlaceholder2 = styled.div`
  height: 12px;
  width: 65%;
  margin-top: 6px;
  ${placeholder};
`;

export const Thumbnail = styled.div`
  flex-shrink: 0;
  ${borderRadius} background-color: ${akColorN30};
  ${size(72)} margin-left: 4px;
  ${({ isPlaceholder }: PlaceholderProps) => {
    if (isPlaceholder) {
      return `${placeholder}`;
    } else {
      return '';
    }
  }};
`;
