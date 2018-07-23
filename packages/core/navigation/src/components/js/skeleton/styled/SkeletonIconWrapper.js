// @flow
import styled from 'styled-components';

const SkeletonIconWrapper = styled.div`
  flex-shrink: 0; /* so that too big width of header text does not change width of avatar */
`;

SkeletonIconWrapper.displayName = 'SkeletonIconWrapper';
export default SkeletonIconWrapper;
