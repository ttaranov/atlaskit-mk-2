import * as React from 'react';

export abstract class BaseViewer<Props, State> extends React.Component<
  Props,
  State
> {
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
