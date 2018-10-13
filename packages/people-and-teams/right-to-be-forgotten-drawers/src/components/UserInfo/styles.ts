import styled from 'styled-components';
import { typography } from '@atlaskit/theme';

import gridSizeTimes from '../../util/gridSizeTimes';

export const UserInfoOuter = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: ${gridSizeTimes(2)}px;
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${gridSizeTimes(0.5)}px;
`;

export const UserName = styled.span`
  ${typography.h500};
  margin-top: 0;
`;

export const UserEmail = styled.span`
  ${typography.h100};
  margin-top: ${gridSizeTimes(0.5)}px;
`;
