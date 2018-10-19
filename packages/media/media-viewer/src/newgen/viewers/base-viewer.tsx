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
