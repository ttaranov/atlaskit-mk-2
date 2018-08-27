// @flow
import styled from 'styled-components';
import { gridSize, math } from '@atlaskit/theme';

import {
  errorIconColor,
  errorTitleColor,
  errorTextColor,
} from '../styled/constants';

export const ErrorWrapper = styled.div`
  text-align: center;
  padding: ${math.multiply(gridSize, 3)}px;
  color: ${errorIconColor};
`;

export const ErrorTitle = styled.p`
  color: ${errorTitleColor};
  line-height: ${math.multiply(gridSize, 3)}px;
  margin: ${gridSize}px 0;
`;

export const ErrorText = styled.span`
  color: ${errorTextColor};
`;
