import * as React from 'react';
import { MediaViewerError } from '../error';
import { Outcome } from '../domain';

export type MinimalState<T> = {
  resource: Outcome<T, MediaViewerError>;
};

export abstract class BaseViewer<
  T,
  Props,
  State extends MinimalState<T>
> extends React.Component<Props, State> {
  componentDidMount() {
    this.init(this.props);
  }

  componentWillUnmount() {
    this.release();
  }

  componentWillUpdate(nextProps: Props) {
    if (this.needsReset(this.props, nextProps)) {
      this.release();
      this.init(nextProps);
    }
  }

  protected abstract init(props: Props): void;
  protected abstract release(): void;
  protected abstract needsReset(currentProps: Props, nextProps: Props): boolean;
}
