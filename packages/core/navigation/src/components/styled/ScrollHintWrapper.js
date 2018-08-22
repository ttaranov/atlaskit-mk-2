// @flow
import styled from 'styled-components';
import root from 'window-or-global';
import { getProvided, whenNotCollapsed } from '../../theme/util';
import {
  scrollBarSize,
  scrollHintSpacing,
  scrollHintHeight,
} from '../../shared-variables';

const multiplier = (() => {
  let value = 2;
  if (root && root.navigator && root.navigator.userAgent) {
    if (root.navigator.userAgent.indexOf('AppleWebKit') >= 0) value = 1;
  }
  return value;
})();

const ContainerNavigationChildrenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  overflow: hidden;
  /* Position relative is required so products can position fixed items at top or bottom
   * of the container scrollable area. */
  position: relative;

  ${whenNotCollapsed`
    &:before,
    &:after {
      background: ${({ theme }) => getProvided(theme).keyline};
      display: block;
      flex: 0;
      height: ${scrollHintHeight}px;
      left: ${scrollHintSpacing}px;
      position: absolute;
      z-index: 1;

      // Because we are using a custom scrollbar for WebKit in ScrollHintScrollContainer, the
      // right margin needs to be calculated based on whether that feature is in use.
      right: ${scrollHintSpacing + scrollBarSize * multiplier}px;
    }

    &:before {
      top: 0;
      content: ${({ hasScrollHintTop }) => (hasScrollHintTop ? "''" : 'none')};
    }
  `};
`;
ContainerNavigationChildrenWrapper.displayName =
  'ContainerNavigationChildrenWrapper';
export default ContainerNavigationChildrenWrapper;
