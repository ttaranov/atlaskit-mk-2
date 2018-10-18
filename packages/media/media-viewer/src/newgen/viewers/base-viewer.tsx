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
    this.init(this.props.item, this.props.context);
  }

  componentWillUnmount() {
    this.release();
  }

  componentWillUpdate(nextProps: Props) {
    if (this.needsReset(this.props, nextProps)) {
      this.release();
      this.init(nextProps.item, nextProps.context);
    }
  }

  protected needsReset(propsA: Props, propsB: Props) {
    return (
      !deepEqual(propsA.item, propsB.item) ||
      propsA.context !== propsB.context ||
      propsA.collectionName !== propsB.collectionName
    );
  }

  protected abstract init(file: ProcessedFileState, context: Context): void;
  protected abstract release(): void;
}
