// @flow
import React, { type Node } from 'react';
import { Transition } from 'react-transition-group';

const ENTER_DURATION = 120;
const EXIT_DURATION = 120;
const easing = 'cubic-bezier(0.23, 1, 0.32, 1)'; // easeOutQuint

const defaultStyle = timeout => ({
  transition: `transform ${timeout.enter}ms ${easing}, opacity ${
    timeout.enter
  }ms linear`,
  opacity: 0,
});

const transitionStyle = (state, timeout) => {
  const transitions = {
    entering: {},
    entered: {
      opacity: 1,
    },
    exiting: {
      opacity: 0,
      transition: `${timeout.exit}ms linear`,
    },
  };
  return transitions[state];
};

const Animation = ({
  children,
  immediatelyHide,
  immediatelyShow,
  in: inProp,
}: {
  children: Object => Node,
  immediatelyHide: boolean,
  immediatelyShow: boolean,
  in: boolean,
}) => {
  const timeout = {
    enter: immediatelyShow ? 1 : ENTER_DURATION,
    exit: immediatelyHide ? 1 : EXIT_DURATION,
  };
  return (
    <Transition timeout={timeout} in={inProp} unmountOnExit>
      {state => {
        return children({
          ...defaultStyle(timeout),
          ...transitionStyle(state, timeout),
        });
      }}
    </Transition>
  );
};

export default Animation;
