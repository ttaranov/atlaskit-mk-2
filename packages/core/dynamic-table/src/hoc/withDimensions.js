// @flow
import React, { Component, type ComponentType } from 'react';

type State = {
  refWidth: number,
  refHeight: number,
};

export type WithDimensionsProps = {
  innerRef: (?HTMLElement) => void,
} & State;

type Props = {
  isRanking: boolean,
};

// Compute height and width of wrapped component before ranking
export default function withDimensions<WrappedComponentProps: {}>(
  WrappedComponent: ComponentType<WrappedComponentProps>,
): ComponentType<$Diff<WrappedComponentProps, WithDimensionsProps>> {
  return class WithDimensions extends Component<any, State> {
    ref: ?HTMLElement;

    state = {
      refWidth: 0,
      refHeight: 0,
    };

    innerRef = (ref: HTMLElement) => {
      if (ref !== null && !this.props.isRanking) {
        this.ref = ref;
      }
    };

    componentWillReceiveProps(nextProps: Props) {
      const wasRanking = this.props.isRanking;
      const willRanking = nextProps.isRanking;

      if (willRanking && !wasRanking) {
        this.updateDimensions();
      }
    }

    updateDimensions = () => {
      if (!this.ref) {
        return;
      }

      const clientRect = this.ref.getBoundingClientRect();

      const width = clientRect.width;
      const height = clientRect.height;

      if (width !== this.state.refWidth || height !== this.state.refHeight) {
        this.setState({ refWidth: width, refHeight: height });
      }
    };

    render() {
      const { refWidth, refHeight } = this.state;

      return (
        <WrappedComponent
          refWidth={refWidth}
          refHeight={refHeight}
          innerRef={this.innerRef}
          {...this.props}
        />
      );
    }
  };
}
