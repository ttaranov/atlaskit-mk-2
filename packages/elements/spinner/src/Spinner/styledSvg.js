// @flow

import styled, { css, keyframes } from 'styled-components';
import { colors, themed } from '@atlaskit/theme';
import type { SpinnerPhases } from '../types';

type StyleParams = {
  invertColor: boolean,
  phase: SpinnerPhases,
  size: number,
};

const spinnerColor = themed({ light: colors.N500, dark: colors.N0 });
const spinnerColorInverted = themed({ light: colors.N0, dark: colors.N0 });

export const getStrokeColor = ({
  invertColor,
  ...props
}: {
  invertColor?: boolean,
  // $FlowFixMe TEMPORARY
}): string => (invertColor ? spinnerColorInverted(props) : spinnerColor(props));

export const svgStyles = css`
  ${(props: StyleParams) => {
    const strokeWidth = Math.round(props.size / 10);
    const strokeRadius = props.size / 2 - strokeWidth / 2;
    const circumference = Math.PI * strokeRadius * 2;

    const idleRotation = `0.86s cubic-bezier(0.4, 0.15, 0.6, 0.85) infinite ${keyframes`
      to { transform: rotate(360deg); }
      `}`;

    const spinUpStroke = `0.8s ease-in-out ${keyframes`
      from { stroke-dashoffset: ${circumference}px; }
      to { stroke-dashoffset: ${circumference * 0.8}px; }
      `}`;

    const spinUpOpacity = `0.2s ease-in-out ${keyframes`
      from { opacity: 0; }
      to { opacity: 1; }
      `}`;

    const activeAnimations = [idleRotation];
    if (props.phase === 'ENTER') {
      activeAnimations.push(spinUpStroke, spinUpOpacity);
    }

    return css`
      animation: ${activeAnimations.join(', ')};
      fill: none;
      stroke: ${getStrokeColor};
      stroke-dasharray: ${circumference}px;
      stroke-dashoffset: ${circumference * 0.8}px;
      stroke-linecap: round;
      stroke-width: ${strokeWidth}px;
      transform-origin: center;
    `;
  }};
`;

const Svg = styled.svg`
  ${svgStyles};
`;
Svg.displayName = 'SpinnerSvg';
export default Svg;
