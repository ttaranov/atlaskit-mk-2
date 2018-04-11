// @flow
/* eslint-disable react/require-default-props */

import React, { type ComponentType, type Node } from 'react';
import { Transition } from 'react-transition-group';
import type { PositionType, PositionTypeBase } from '../types';

const ENTER_DURATION = 120;
const EXIT_DURATION = 120;
const easing = 'cubic-bezier(0.23, 1, 0.32, 1)'; // easeOutQuint
const distance = 8;

type EnterFunc = (node: HTMLElement, isAppearing: boolean) => void;
type ExitFunc = (node: HTMLElement) => void;

type Props = {
  children: Node,
  component: ComponentType<*>,
  onEnter?: EnterFunc,
  onEntering?: EnterFunc,
  onEntered?: EnterFunc,
  onExit?: ExitFunc,
  onExiting?: ExitFunc,
  onExited?: ExitFunc,
  in: boolean,
  style: {},
  styleDefault: {},
  timeout: number | { enter: number, exit: number },
  transition: {
    entering?: {},
    entered?: {},
    exiting?: {},
    exited?: {},
  },
};

// BASE
// ==============================

/**
  To achieve a "lazy mount" and clean up our component after unmounting,
  the following props must be set to true:
  - appear
  - mountOnEnter
  - unmountOnExit

  Read more https://reactcommunity.org/react-transition-group/#Transition-prop-mountOnEnter
*/

function Animation({
  component: Tag,
  in: hasEntered,
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
  style,
  styleDefault,
  timeout,
  transition,
  ...props
}: Props) {
  const transitionProps = {
    appear: true,
    in: hasEntered,
    mountOnEnter: true,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited,
    timeout,
    unmountOnExit: true,
  };

  return (
    <Transition {...transitionProps}>
      {status => {
        const styles = {
          ...style,
          ...styleDefault,
          ...transition[status],
        };

        return <Tag style={styles} {...props} />;
      }}
    </Transition>
  );
}
const DefaultComponent = props => <div {...props} />;

Animation.defaultProps = {
  component: DefaultComponent,
};

// SLIDE
// ==============================

const xPos = {
  left: distance,
  right: -distance,
  top: 0,
  bottom: 0,
};
const yPos = {
  bottom: -distance,
  top: distance,
  left: 0,
  right: 0,
};

// eslint-disable-next-line import/prefer-default-export
export const Slide = ({
  immediatelyHide,
  immediatelyShow,
  position,
  mousePosition,
  ...props
}: {
  immediatelyHide: boolean,
  immediatelyShow: boolean,
  position: PositionType,
  mousePosition: PositionTypeBase,
  props?: any,
  children: Node,
  in: boolean,
  style: Object,
}) => {
  const truePosition = position === 'mouse' ? mousePosition : position;
  const horizontalOffset = xPos[truePosition];
  const verticalOffset = yPos[truePosition];

  const restingTransform = 'translate3d(0, 0, 0)';
  const timeout = {
    enter: immediatelyShow ? 1 : ENTER_DURATION,
    exit: immediatelyHide ? 1 : EXIT_DURATION,
  };

  return (
    <Animation
      styleDefault={{
        transition: `transform ${timeout.enter}ms ${easing}, opacity ${
          timeout.enter
        }ms linear`,
        transform: restingTransform,
      }}
      transition={{
        entering: {
          opacity: 0,
          transform: `translate3d(${horizontalOffset}px, ${verticalOffset}px, 0)`,
        },
        entered: {
          opacity: 1,
          transform: restingTransform,
        },
        exiting: {
          opacity: 0,
          transition: `opacity ${timeout.exit}ms linear`,
        },
      }}
      timeout={timeout}
      {...props}
    />
  );
};
