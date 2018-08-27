// @flow
import styled, { keyframes } from 'styled-components';
import {
  akAnimationMixins,
  akGridSizeUnitless,
} from '@atlaskit/util-shared-styles';

const { createBold, interpolate } = akAnimationMixins;

// animation constants
const animDistance = 2 * akGridSizeUnitless;
const animDelay = 0.1;
const animTime = animDelay + 1;

// properties to animate
const slideUp = {
  property: 'transform',
  value: interpolate`translateY(${t => t}px)`,
  deltas: [{ from: animDistance, to: 0 }],
};
const slideDown = {
  property: 'transform',
  value: interpolate`translateY(${t => t}px)`,
  deltas: [{ from: -animDistance, to: 0 }],
};
const slideLeft = {
  property: 'transform',
  value: interpolate`translateX(${t => t}px)`,
  deltas: [{ from: animDistance, to: 0 }],
};
const slideRight = {
  property: 'transform',
  value: interpolate`translateX(${t => t}px)`,
  deltas: [{ from: -animDistance, to: 0 }],
};
const fadeIn = {
  property: 'opacity',
  deltas: [{ from: 0, to: 1 }],
};

const KEYFRAMES = {
  bottom: keyframes`${createBold([slideDown, fadeIn])}`,
  left: keyframes`${createBold([slideLeft, fadeIn])}`,
  right: keyframes`${createBold([slideRight, fadeIn])}`,
  top: keyframes`${createBold([slideUp, fadeIn])}`,
};

const KEYFRAMES_FLIPPED = {
  bottom: KEYFRAMES.top,
  left: KEYFRAMES.right,
  right: KEYFRAMES.left,
  top: KEYFRAMES.bottom,
};

export const getKeyframeName = (props: any) => {
  const { position, isFlipped } = props;
  const mainPosition = position.split(' ')[0];

  return isFlipped ? KEYFRAMES_FLIPPED[mainPosition] : KEYFRAMES[mainPosition];
};

export const AnimationWrapper = styled.div`
  animation: ${props => getKeyframeName(props)} ${animTime}s ${animDelay}s
    backwards;
`;
