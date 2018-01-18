// @flow

import styled, { injectGlobal } from 'styled-components';
import type { SpinnerPhases } from '../types';

type AnimationParams = {
  delay: number,
  phase: SpinnerPhases,
};

export const keyframeNames = {
  noop: 'atlaskitSpinnerNoop',
  enter_rotate: 'atlaskitSpinnerEnterRotate',
  leave_rotate: 'atlaskitSpinnerLeaveRotate',
  leave_opacity: 'atlaskitSpinnerLeaveOpacity',
};

/* Define keyframes statically to prevent a perfomance issue in styled components v1 where the keyframes function
 * does not cache previous values resulting in each spinner injecting the same keyframe definition
 * in the DOM.
 * This can be reverted to use the keyframes fn when we upgrade to styled components v2
 */
// eslint-disable-next-line no-unused-expressions
injectGlobal`
  @keyframes ${keyframeNames.noop} {
    from { opacity: 0; }
    to { opacity: 0; }
  }

  @keyframes ${keyframeNames.enter_rotate} {
    from { transform: rotate(50deg); }
    to { transform: rotate(230deg); }
  }

  @keyframes ${keyframeNames.leave_rotate} {
    from { transform: rotate(230deg); }
    to { transform: rotate(510deg); }
  }

  @keyframes ${keyframeNames.leave_opacity} {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

export const getContainerAnimation = ({ delay, phase }: AnimationParams) => {
  if (phase === 'DELAY') {
    /* This hides the spinner and allows us to use animationend events to move to the next phase in
     * the same way we do with the other lifecycle stages */
    return `animation: ${delay}s ${keyframeNames.noop};`;
  }

  if (phase === 'ENTER' || phase === 'IDLE') {
    return `animation: 1s ease-in-out forwards ${keyframeNames.enter_rotate};`;
  }

  if (phase === 'LEAVE') {
    return `animation: 0.53s ease-in-out forwards ${keyframeNames.leave_rotate},
      0.2s ease-in-out 0.33s ${keyframeNames.leave_opacity};`;
  }

  return '';
};

const getSize = ({ size }: { size: number }) => `${size}px`;

const Container = styled.div`
  ${getContainerAnimation} display: inline-flex;
  height: ${getSize};
  width: ${getSize};

  /* Rapidly creating and removing spinners will result in multiple spinners being visible while
   * they complete their exit animations. This rules hides the spinner if another one has been
   * added. */
  div + & {
    display: none;
  }
`;
Container.displayName = 'SpinnerContainer';
export default Container;
