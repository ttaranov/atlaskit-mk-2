// @flow
import React, { Component, Fragment, type Node } from 'react';
import { Manager, Reference } from '@atlaskit/popper';

type Props = {
  children: ({ targetRef: (HTMLElement | void) => any }) => Node,
};

type State = {
  dimensions: {
    left: number,
    right: number,
    top: number,
    bottom: number,
    height: number,
    width: number,
  },
  radius: number,
};

const {
  Consumer: TargetConsumer,
  Provider: TargetProvider,
} = React.createContext({
  dimensions: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: 0,
    width: 0,
  },
  radius: 0,
});

export { TargetConsumer };

export default class Spotlight extends Component<Props, State> {
  state = {
    dimensions: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      height: 0,
      width: 0,
    },
    radius: 0,
  };
  targetRef = (ref: HTMLElement | void) => {
    if (ref) {
      const {
        left,
        right,
        top,
        bottom,
        height,
        width,
      } = ref.getBoundingClientRect();
      const radius = parseInt(
        window.getComputedStyle(ref).getPropertyValue('border-radius'),
        10,
      );
      this.setState({
        dimensions: { left, right, top, bottom, height, width },
        radius,
      });
    }
  };
  render() {
    const { dimensions, radius } = this.state;
    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <TargetProvider value={{ dimensions, radius }}>
              {this.props.children({
                targetRef: elem => {
                  ref(elem);
                  this.targetRef(elem);
                },
              })}
            </TargetProvider>
          )}
        </Reference>
      </Manager>
    );
  }
}
