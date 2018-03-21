//@flow
import styled from 'styled-components';
import { colors, fontSize } from '@atlaskit/theme';

export const Wrapper = styled.div`
  margin-top: 16px;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
`;

export const Title = styled.span`
  font-size: 24px;
  font-weight: 500;
  color: ${colors.heading};
`;

export const Description = styled.div`
  font-size: ${fontSize}px;
  color: ${colors.text};
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
