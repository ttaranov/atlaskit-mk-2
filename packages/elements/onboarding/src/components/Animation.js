// @flow
import React from 'react';
import { Transition } from 'react-transition-group';
import { type ChildrenType, type ComponentType } from '../types';

const duration = 500;
const easing = 'cubic-bezier(0.23, 1, 0.32, 1)'; // easeOutQuint
const verticalOffset = 16;

type EnterType = (node: Element, isAppearing: boolean) => void;
type ExitType = (node: Element) => void;
type Props = {
  children: ChildrenType,
  component: ComponentType,
  onEnter?: EnterType,
  onEntering?: EnterType,
  onEntered?: EnterType,
  onExit?: ExitType,
  onExiting?: ExitType,
  onExited?: ExitType,
  in: boolean,
  style: {},
  styleDefault: {},
  transition: {
    entering?: {},
    entered?: {},
    exiting?: {},
    exited?: {},
  },
};
const defaultProps = {
  component: 'div',
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
    timeout: duration,
    unmountOnExit: true,
  };

  return (
    <Transition {...transitionProps}>
      {status => {
        if (status === 'exited') return null;

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
Animation.defaultProps = defaultProps;

// FADE
// ==============================

export const Fade = props => (
  <Animation
    styleDefault={{
      transition: 'opacity 200ms',
    }}
    transition={{
      entering: { opacity: 0 },
      entered: { opacity: 1 },
      exiting: { opacity: 0 },
    }}
    {...props}
  />
);

// SLIDE UP
// ==============================

export const SlideUp = ({
  stackIndex,
  ...props
}: {
  stackIndex: number,
  props: Array<any>,
}) => {
  const translateY = stackIndex * (verticalOffset / 2);
  const restingTransform = `translate3d(0, ${translateY}px, 0)`;

  return (
    <Animation
      styleDefault={{
        transition: `transform ${duration}ms ${easing}`,
        transform: restingTransform,
      }}
      transition={{
        entering: {
          transform: `translate3d(0, ${verticalOffset * 2}px, 0)`,
        },
        entered: {
          transform: restingTransform,
        },
        exiting: {
          transform: `translate3d(0, -${verticalOffset * 2}px, 0)`,
        },
      }}
      {...props}
    />
  );
};
