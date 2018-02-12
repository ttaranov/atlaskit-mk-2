// @flow
import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme';

const SkeletonContainerItemWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: ${gridSize()}px;
`;

SkeletonContainerItemWrapper.displayName = 'SkeletonContainerItemWrapper';
export default SkeletonContainerItemWrapper;
