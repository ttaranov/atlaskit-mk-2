// @flow
import styled from 'styled-components';

import { gridSize, math } from '@atlaskit/theme';

const SkeletonContainerHeaderText = styled.div`
  height: ${math.multiply(gridSize, 2.5)}px;
  background-color: currentColor;
  border-radius: ${math.divide(gridSize, 2)}px;
  opacity: 0.3;
  margin-left: ${props =>
    props.isAvatarHidden ? gridSize() : gridSize() * 2}px;
  width: ${gridSize() * 18}px;
`;

SkeletonContainerHeaderText.displayName = 'SkeletonContainerHeaderText';
export default SkeletonContainerHeaderText;
