// @flow
import styled from 'styled-components';
import { colors, typography } from '@atlaskit/theme';
import gridSizeTimes from '../../util/gridSizeTimes';

export const Screen = styled.div`
  width: 640px;
  margin-bottom: ${gridSizeTimes(4)}px;
`;

export const Title = styled.div`
  ${typography.h700};
  margin-bottom: ${gridSizeTimes(3)}px;
`;

export const InfoIconWrapper = styled.span`
  color: ${colors.B300};
  div {
    display: inline-block;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${gridSizeTimes(4)}px;
`;
