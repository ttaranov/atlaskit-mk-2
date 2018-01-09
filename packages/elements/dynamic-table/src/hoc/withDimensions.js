// @flow
import React, { Component, type ComponentType } from 'react';

type State = {
  width: number,
  height: number,
};

export type WithDimensionsProps = {
  updateDimensions: () => void,
  innerRef: (?HTMLElement) => void,
} & State;


export default function withWidthAndHeight<WrappedProps: {}>(
  WrappedComponent: ComponentType<WrappedProps>
): ComponentType<$Diff<WrappedProps, WithDimensionsProps>> {
  return class extends Component<any, State> {
    ref: ?HTMLElement

    state = {
      width: 0,
      height: 0,
    }

    innerRef = (ref: HTMLElement) => {
      this.ref = ref;      
    }

    updateDimensions = () => {
      if (!this.ref) {
        return;   
      }

      const width = this.ref.offsetWidth;
      const height = this.ref.offsetHeight;

      if (width !== this.state.width || height !== this.state.height) {
        this.setState({width, height});
      }
    }
    
    render() {
      const {width, height} = this.state;

      return <WrappedComponent 
        width={width}
        height={height}
        innerRef={this.innerRef}
        updateDimensions={this.updateDimensions}
        {...this.props} />;
    }
  };
}
