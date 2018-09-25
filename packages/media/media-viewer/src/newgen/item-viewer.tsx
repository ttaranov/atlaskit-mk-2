import * as React from 'react';
import { Context, FileState, ProcessedFileState } from '@atlaskit/media-core';
import { Outcome, Identifier, MediaViewerFeatureFlags } from './domain';
import { ImageViewer } from './viewers/image';
import { VideoViewer } from './viewers/video';
import { AudioViewer } from './viewers/audio';
import { DocViewer } from './viewers/doc';
import { Spinner } from './loading';
import { Subscription } from 'rxjs/Subscription';
import * as deepEqual from 'deep-equal';
import {
  ErrorMessage,
  createError,
  MediaViewerError,
  ErrorName,
} from './error';
import { renderDownloadButton } from './domain/download';

export type Props = Readonly<{
  identifier: Identifier;
  context: Context;
  featureFlags?: MediaViewerFeatureFlags;
  showControls?: () => void;
  onClose?: () => void;
  previewCount: number;
}>;

export type State = {
  item: Outcome<FileState, MediaViewerError>;
};

const initialState: State = { item: Outcome.pending() };
export class ItemViewer extends React.Component<Props, State> {
  state: State = initialState;

  private subscription?: Subscription;

  componentWillUpdate(nextProps: Props) {
    if (this.needsReset(this.props, nextProps)) {
      this.release();
      this.init(nextProps);
    }
  }

  componentWillUnmount() {
    this.release();
  }

  componentDidMount() {
    this.init(this.props);
  }

  renderProcessedFile = (item: ProcessedFileState) => {
    const {
      context,
      identifier,
      featureFlags,
      showControls,
      onClose,
      previewCount,
    } = this.props;

    const viewerProps = {
      context,
      item,
      collectionName: identifier.collectionName,
      onClose,
      previewCount,
    };
    switch (item.mediaType) {
      case 'image':
        return <ImageViewer {...viewerProps} />;
      case 'audio':
        return <AudioViewer {...viewerProps} />;
      case 'video':
        return (
          <VideoViewer
            showControls={showControls}
            featureFlags={featureFlags}
            {...viewerProps}
          />
        );
      case 'doc':
        return <DocViewer {...viewerProps} />;
      default:
        return this.renderError('unsupported', item);
    }
  };

  renderError = (errorName: ErrorName, file?: FileState) => {
    if (file) {
      return (
        <ErrorMessage error={createError(errorName, undefined, file)}>
          <p>Try downloading the file to view it.</p>
          {this.renderDownloadButton(file)}
        </ErrorMessage>
      );
    } else {
      return <ErrorMessage error={createError(errorName)} />;
    }
  };

  render() {
    return this.state.item.match({
      successful: item => {
        switch (item.status) {
          case 'processed':
            return this.renderProcessedFile(item);
          case 'error':
            return this.renderError('previewFailed', item);
          default:
            return <Spinner />;
        }
      },
      pending: () => <Spinner />,
      failed: err => this.renderError(err.errorName, this.state.item.data),
    });
  }

  private renderDownloadButton(file: FileState) {
    const { context, identifier } = this.props;
    return renderDownloadButton(file, context, identifier.collectionName);
  }

  private init(props: Props) {
    this.setState(initialState);
    const { context, identifier } = props;
    this.subscription = context
      .getFile(identifier.id, { collectionName: identifier.collectionName })
      .subscribe({
        next: file => {
          this.setState({
            item: Outcome.successful(file),
          });
        },
        error: err => {
          this.setState({
            item: Outcome.failed(createError('metadataFailed', err)),
          });
        },
      });
  }

  // It's possible that a different identifier or context was passed.
  // We therefore need to reset Media Viewer.
  private needsReset(propsA: Props, propsB: Props) {
    return (
      !deepEqual(propsA.identifier, propsB.identifier) ||
      propsA.context !== propsB.context
    );
  }

  release() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
