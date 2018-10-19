import styled from 'styled-components';
import { colors, typography } from '@atlaskit/theme';
import gridSizeTimes from '../../util/gridSizeTimes';

export const Screen = styled.div`
  width: 640px;
  margin-bottom: ${gridSizeTimes(4)}px;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
`;

export const Title = styled.div`
  ${typography.h700};
  margin-bottom: ${gridSizeTimes(3)}px;
  margin-top: 0;
`;

export const SectionMessageOuter = styled.div`
  margin: ${gridSizeTimes(3)}px 0;
`;

export const MainInformationList = styled.ul`
  > li {
    margin-top: 16px;
  }
`;

export const AccessibleSitesList = styled.ul`
  list-style: none;
  padding-left: 0;
  font-weight: 600;
`;

export const InfoIconWrapper = styled.span`
  color: ${colors.B300};
  div {
    display: inline-block;
  }
`;
