// @flow
import styled, { css } from 'styled-components';
import { sizes } from './constants';

const Wrapper = styled.span`
  color: ${p => p.iconColor};
  display: inline-block;
  fill: ${p => p.textColor};
  height: ${p => sizes[p.size]}px;
  position: relative;
  user-select: none;

  > svg {
    fill: inherit;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
  > canvas {
    display: block;
    height: 100%;
    visibility: hidden;
  }
  ${p =>
    /* Only apply this if our stop-colors are inherit, if they aren't we don't need to set stop-color via css */
    p.iconGradientStart === 'inherit' &&
    p.iconGradientStop === 'inherit' &&
    css`
      /* Stop-color doesn't properly apply in chrome when the inherited/current color changes.
      * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS
      * rule) and then override it with currentColor for the color changes to be picked up.
      */
      stop {
        stop-color: currentColor;
      }
    `};
`;

export default Wrapper;
