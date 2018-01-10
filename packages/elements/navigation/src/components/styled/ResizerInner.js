import styled from 'styled-components';
import { unthemedColors, resizerClickableWidth, resizerVisibleWidth } from '../../shared-variables';

const ResizerInner = styled.div`
  cursor: ew-resize;
  height: 100%;

  /* position: absolute so that it will not effect the width of the navigation */
  position: absolute;

  right: -${resizerClickableWidth}px;
  width: ${resizerClickableWidth}px;

  &:hover::before {
    background: ${unthemedColors.resizer};
  }
  &:before {
    content: '';
    width: ${resizerVisibleWidth}px;
    height: 100%;
    position: absolute;
    left: -${resizerVisibleWidth / 2}px;
  }
`;

ResizerInner.displayName = 'ResizerInner';
export default ResizerInner;
