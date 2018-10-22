import * as React from 'react';
import * as deepEqual from 'deep-equal';
import { Context, ProcessedFileState } from '@atlaskit/media-core';

export type BaseProps = {
  context: Context;
  item: ProcessedFileState;
  collectionName?: string;
};

export abstract class BaseViewer<
  Props extends BaseProps,
  State
> extends React.Component<Props, State> {
  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.release();
  }

  // NOTE: We've moved parts of the logic to reset a component into this method
  // to optimise the performance. Resetting the state before the `componentDidUpdate`
  // lifecycle event allows us avoid one additional render cycle.
  // However, this lifecycle method might eventually be deprecated, so be careful
  // when working with it.
  UNSAFE_componentWillReceiveProps(nextProps: Readonly<Props>): void {
    if (this.needsReset(nextProps, this.props)) {
      this.release();
      this.setState(this.initialState);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.needsReset(prevProps, this.props)) {
      this.init();
    }
  }

  protected needsReset(propsA: Props, propsB: Props) {
    return (
      !deepEqual(propsA.item, propsB.item) ||
      propsA.context !== propsB.context ||
      propsA.collectionName !== propsB.collectionName
    );
  }

  protected abstract init(): void;
  protected abstract release(): void;
  protected abstract get initialState(): State;
}
