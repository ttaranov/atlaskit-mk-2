// @flow
import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme';

const SkeletonContainerItemWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: ${gridSize() * 4}px;
  margin-top: ${gridSize()}px;
  margin-bottom: ${gridSize()}px;
`;

SkeletonContainerItemWrapper.displayName = 'SkeletonContainerItemWrapper';
export default SkeletonContainerItemWrapper;
