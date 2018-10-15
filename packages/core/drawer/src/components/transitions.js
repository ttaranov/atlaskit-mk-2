// @flow

import React, { Component, type ComponentType } from 'react';
import { Transition } from 'react-transition-group';
import { layers } from '@atlaskit/theme';

import { transitionDurationMs, transitionTimingFunction } from '../constants';

// Transitions
// ------------------------------

type Styles = { [string]: string | number };
type TransitionProps = {
  children?: Node,
  component?: ComponentType<*> | string,
  onExited?: () => void,
  shouldUnmountOnExit?: boolean,
  in: boolean,
};
type HandlerProps = {
  defaultStyles: Styles,
  transitionProps: {
    appear: boolean,
    mountOnEnter: boolean,
    unmountOnExit: boolean,
  },
  transitionStyles: {
    entering?: Styles,
    entered?: Styles,
    exiting?: Styles,
    exited?: Styles,
  },
};

const defaultTransitionProps = {
  appear: true,
  mountOnEnter: true,
  unmountOnExit: true,
};
class TransitionHandler extends Component<TransitionProps & HandlerProps> {
  static defaultProps = {
    component: 'div',
    transitionProps: defaultTransitionProps,
    onExited: () => {},
  };
  render() {
    const {
      component: Tag = 'div',
      in: inProp,
      defaultStyles,
      transitionStyles,
      transitionProps,
      onExited,
      ...props
    } = this.props;

    return (
      <Transition
        in={inProp}
        timeout={transitionDurationMs}
        onExited={onExited}
        {...transitionProps}
      >
        {state => {
          const style = {
            ...defaultStyles,
            ...transitionStyles[state],
          };

          return <Tag style={style} {...props} />;
        }}
      </Transition>
    );
  }
}

export const Fade = ({ onExited, ...props }: TransitionProps) => (
  <TransitionHandler
    defaultStyles={{
      transition: `opacity ${transitionDurationMs}ms ${transitionTimingFunction}`,
      opacity: 0,
      position: 'fixed',
      zIndex: layers.blanket(),
    }}
    transitionStyles={{
      entering: { opacity: 0 },
      entered: { opacity: 1 },
    }}
    {...props}
  />
);

export const Slide = ({
  shouldUnmountOnExit = true,
  ...props
}: TransitionProps) => (
  <TransitionHandler
    defaultStyles={{
      transition: `left ${transitionDurationMs}ms ${transitionTimingFunction}`,
      left: '-100%',
    }}
    transitionStyles={{
      entered: { left: 0 },
      exited: { left: '-100%' },
    }}
    transitionProps={{
      ...defaultTransitionProps,
      ...{ unmountOnExit: shouldUnmountOnExit },
    }}
    {...props}
  />
);
