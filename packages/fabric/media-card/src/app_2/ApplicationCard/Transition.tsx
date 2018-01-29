import * as React from 'react';
import ComponentTransition from 'react-transition-group/Transition';

type State = 'entering' | 'entered' | 'exiting' | 'exited';
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
  state: State,
): {} {
  return (
    styles && styles[type] && styles[type][name] && styles[type][name][state]
  );
}

export interface TransitionProps {
  enter?: ('fade' | 'slide-up')[];
  exit?: ('fade' | 'slide-down')[];
  timeout: number | { enter: number; exit: number };
  children: null | React.ReactElement<any>;
}

export interface TransitionState {
  visible: boolean;
  children: null | React.ReactElement<any>;
}

export default class Transition extends React.Component<
  TransitionProps,
  TransitionState
> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: props.children !== null,
      children: props.children,
    };
  }

  componentWillReceiveProps(nextProps: TransitionProps) {
    const { children: nextChildren } = nextProps;
    const { children: prevChildren } = this.props;

    // when exiting, show the old element until the transition is finished - otherwise the Alert changes mid-transition
    if (nextChildren !== prevChildren) {
      if (nextChildren === null) {
        this.setState({
          visible: false,
        });
      } else {
        this.setState({
          visible: true,
          children: nextChildren,
        });
      }
    }
  }

  handleExited = () => {
    const { timeout, children } = this.props;
    setTimeout(
      () =>
        this.setState({
          visible: false,
          children,
        }),
      timeout,
    ); // hmm not sure why we have to wait
  };

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
    const { timeout } = this.props;
    const { visible, children } = this.state;
    return (
      <ComponentTransition
        appear={true}
        enter={true}
        exit={true}
        in={visible}
        timeout={timeout}
        onExited={this.handleExited}
      >
        {status => {
          if (children) {
            return React.cloneElement(children, {
              style: this.getStyle(status),
            });
          } else {
            return children;
          }
        }}
      </ComponentTransition>
    );
  }
}
