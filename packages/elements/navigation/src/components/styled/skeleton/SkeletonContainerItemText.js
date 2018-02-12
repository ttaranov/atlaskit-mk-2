// @flow
import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme';

const SkeletonContainerItemText = styled.div`
  margin-left: ${gridSize()}px;
  width: ${gridSize() * 20}px;
`;

SkeletonContainerItemText.displayName = 'SkeletonContainerItemText';
export default SkeletonContainerItemText;
