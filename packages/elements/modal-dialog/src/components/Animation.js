// @flow
import React from 'react';
import { Transition } from 'react-transition-group';
import type { ComponentType } from '../types';

const duration = 500;
const easing = 'cubic-bezier(0.23, 1, 0.32, 1)'; // easeOutQuint
const verticalOffset = 16;

type EnterType = (node: Element, isAppearing: boolean) => void;
type ExitType = (node: Element) => void;

type TransitionType = {
  entering?: {},
  entered?: {},
  exiting?: {},
  exited?: {},
};

type Props = {
  in: boolean,
  component: ComponentType,
  onEnter?: EnterType,
  onEntering?: EnterType,
  onEntered?: EnterType,
  onExit?: ExitType,
  onExiting?: ExitType,
  onExited?: ExitType,
  style?: {},
  styleDefault: {},
  transition: TransitionType,
};
const DefaultProps = {
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
  in: transitionIn,
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
  return (
    <Transition
      appear
      in={transitionIn}
      mountOnEnter
      onEnter={onEnter}
      onEntering={onEntering}
      onEntered={onEntered}
      onExit={onExit}
      onExiting={onExiting}
      onExited={onExited}
      timeout={duration}
      unmountOnExit
    >
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
Animation.defaultProps = DefaultProps;

// FADE
// ==============================
type FadeProps = $Diff<
  Props,
  { style: {}, styleDefault: {}, transition: TransitionType },
>;
export const Fade = (props: FadeProps) => (
  <Animation
    styleDefault={{
      transition: `opacity ${duration / 2}ms`,
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
type SlideUpProps = $Diff<
  Props,
  { style: {}, styleDefault: {}, transition: TransitionType },
>;
export const SlideUp = ({
  stackIndex,
  ...props
}: { stackIndex: number } & SlideUpProps) => {
  const translateY = stackIndex * (verticalOffset / 2);
  const restingTransform = `translate3d(0, ${translateY}px, 0)`;

  return (
    <Animation
      in={props.in}
      style={props.style}
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
