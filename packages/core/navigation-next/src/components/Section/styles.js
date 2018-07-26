// @flow

import { keyframes } from 'emotion';
import { gridSize as gridSizeFn } from '@atlaskit/theme';

import {
  transitionDuration,
  transitionTimingFunction,
} from '../../common/constants';

const gridSize = gridSizeFn();

const baseStyles = {
  boxSizing: 'border-box',
  paddingLeft: `${gridSize * 2}px`,
  paddingRight: `${gridSize * 2}px`,
};

const enterAnimationDown = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0%); }
`;

const enterAnimationUp = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0%); }
`;

const exitAnimationDown = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
`;

const exitAnimationUp = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;

type GetTransitionStylesArgs = {
  state: 'entering' | 'entered' | 'exiting' | 'exited',
  traversalDirection: 'up' | 'down' | null,
};

export const getSectionWrapperStyles = ({
  state,
  traversalDirection,
}: GetTransitionStylesArgs) => {
  if (['entering', 'exiting'].includes(state) && traversalDirection) {
    if (state === 'exiting') {
      const animationName =
        traversalDirection === 'down' ? exitAnimationDown : exitAnimationUp;
      return {
        ...baseStyles,
        animationName,
        animationDuration: transitionDuration,
        animationFillMode: 'forwards',
        animationTimingFunction: transitionTimingFunction,
      };
    }

    if (state === 'entering') {
      const animationName =
        traversalDirection === 'down' ? enterAnimationDown : enterAnimationUp;
      return {
        ...baseStyles,
        animationName,
        animationDuration: transitionDuration,
        animationFillMode: 'forwards',
        animationTimingFunction: transitionTimingFunction,
        position: 'absolute',
        width: '100%',
      };
    }
  }

  return baseStyles;
};
