import * as React from 'react';
import { ErrorMessage, MediaViewerError } from '../error';
import { Outcome } from '../domain';
import { Spinner } from '../loading';
import { renderDownloadButton } from '../domain/download';
import { Context } from '@atlaskit/media-core/src/context/context';
import { ProcessedFileState } from '@atlaskit/media-core/src/fileState';

export type MinimalProps = {
  context: Context;
  item: ProcessedFileState;
  collectionName?: string;
};

export type MinimalState<T> = {
  resource: Outcome<T, MediaViewerError>;
};

export abstract class BaseViewer<
  T,
  Props extends MinimalProps,
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

  render() {
    return this.state.resource.match({
      successful: resource => this.renderSuccessful(resource),
      pending: () => <Spinner />,
      failed: err => (
        <ErrorMessage error={err}>
          <p>Try downloading the file to view it.</p>
          {this.renderDownloadButton()}
        </ErrorMessage>
      ),
    });
  }

  private renderDownloadButton() {
    const { item, context, collectionName } = this.props;
    return renderDownloadButton(item, context, collectionName);
  }

  protected abstract renderSuccessful(resource: T): React.ReactNode;

  protected abstract init(props: Props): void;
  protected abstract release(): void;
  protected abstract needsReset(currentProps: Props, nextProps: Props): boolean;
}
