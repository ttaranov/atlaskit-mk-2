// @flow

import React, { PureComponent, type ElementRef, type Node } from 'react';
import { Transition } from 'react-transition-group';

function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

type TransitionState = 'entered' | 'entering' | 'exited' | 'exiting';
type Props = {
  children: ({
    isTransitioning: boolean,
    style: Object,
    transitionState: TransitionState,
  }) => Node,
  innerRef?: ElementRef<*>,
  in: boolean,
  isDisabled?: boolean,
  properties: Array<string>,
  from: Array<number | string>,
  to: Array<number | string>,
};
type State = { isTransitioning: boolean };

const DURATION = 300;

function getTransition(keys) {
  return {
    transform: 'translate3d(0, 0, 0)', // enable GPU acceleration
    transition: keys
      .map(k => `${camelToKebab(k)} ${DURATION}ms cubic-bezier(0.2, 0, 0, 1)`)
      .join(','),
  };
}
function getStyle({ keys, values }) {
  const style = {};
  keys.forEach((k, i) => {
    style[k] = values[i];
  });
  return style;
}

export default class ResizeTransition extends PureComponent<Props, State> {
  static defaultProps = {
    isEnabled: true,
  };
  target: HTMLElement;
  getTarget = (ref: ElementRef<*>) => {
    this.target = ref;

    const { innerRef } = this.props;
    if (innerRef) innerRef(ref);
  };

  render() {
    const { isDisabled, properties, from, to } = this.props;

    return (
      <Transition in={this.props.in} timeout={DURATION}>
        {state => {
          // let consumers now when know when we're animating
          const isTransitioning = ['entering', 'exiting'].includes(state);

          // NOTE: due to the use of 3d transform for GPU acceleration, which
          // changes the stacking context, we only apply the transition during
          // the animation period.
          const applyAnimation = !isDisabled && isTransitioning;
          const transition = applyAnimation ? getTransition(properties) : {};
          const dynamicStyles = {
            exiting: getStyle({ keys: properties, values: from }),
            exited: getStyle({ keys: properties, values: from }),
            entering: getStyle({ keys: properties, values: to }),
            entered: getStyle({ keys: properties, values: to }),
          };

          // build the dynamic style object for consumers to pass onto their child node
          const style = { ...transition, ...dynamicStyles[state] };

          return this.props.children({
            isTransitioning,
            style,
            transitionState: state,
          });
        }}
      </Transition>
    );
  }
}
