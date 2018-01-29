import * as React from 'react';
import ComponentTransition from 'react-transition-group/Transition';

type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';
type EnterTransition = 'fade' | 'slide-up';
type ExitTransition = 'fade' | 'slide-down';

const styles = {
  enter: {
    fade: {
      entering: {
        opacity: '0',
      },
      entered: {
        opacity: '1',
      },
    },
    'slide-up': {
      entering: {
        transform: 'translate(0, 100%)',
      },
      entered: {
        transform: 'translate(0, 0)',
      },
    },
  },
  exit: {
    fade: {
      exiting: {
        opacity: '1',
      },
      exited: {
        opacity: '0',
      },
    },
    'slide-down': {
      exiting: {
        transform: 'translate(0, 0)',
      },
      exited: {
        transform: 'translate(0, 100%)',
      },
    },
  },
};

function getStyle(
  type: 'enter' | 'exit',
  name: EnterTransition | ExitTransition,
  state: TransitionState,
): {} {
  return (
    styles && styles[type] && styles[type][name] && styles[type][name][state]
  );
}

export interface TransitionProps {
  visible: boolean;
  enter?: ('fade' | 'slide-up')[];
  exit?: ('fade' | 'slide-down')[];
  timeout: number | { enter: number; exit: number };
  children: React.ReactElement<any>;
}

export default class Transition extends React.Component<TransitionProps> {
  getStyle(status): {} {
    const { enter = [], exit = [], timeout } = this.props;

    if (status === 'entering') {
      return enter.reduce(
        (accum, name) => ({ ...accum, ...getStyle('enter', name, 'entering') }),
        {},
      );
    }

    if (status === 'entered') {
      return {
        ...enter.reduce(
          (accum, name) => ({
            ...accum,
            ...getStyle('enter', name, 'entering'),
          }),
          {},
        ),
        ...enter.reduce(
          (accum, name) => ({
            ...accum,
            ...getStyle('enter', name, 'entered'),
          }),
          {},
        ),
        transition: `all ${timeout}ms`,
      };
    }

    if (status === 'exiting') {
      return {
        ...exit.reduce(
          (accum, name) => ({ ...accum, ...getStyle('exit', name, 'exiting') }),
          {},
        ),
      };
    }

    if (status === 'exited') {
      return {
        ...exit.reduce(
          (accum, name) => ({ ...accum, ...getStyle('exit', name, 'exiting') }),
          {},
        ),
        ...exit.reduce(
          (accum, name) => ({ ...accum, ...getStyle('exit', name, 'exited') }),
          {},
        ),
        transition: `all ${timeout}ms`,
      };
    }

    return {};
  }

  render() {
    const { visible, timeout, children } = this.props;
    return (
      <ComponentTransition
        appear={true}
        enter={true}
        exit={true}
        in={visible}
        timeout={timeout}
      >
        {status =>
          React.cloneElement(children, { style: this.getStyle(status) })
        }
      </ComponentTransition>
    );
  }
}
