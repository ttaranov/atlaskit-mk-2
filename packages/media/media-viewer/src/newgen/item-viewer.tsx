import * as React from 'react';
import { Context, FileItem } from '@atlaskit/media-core';
import { Outcome, Identifier, MediaViewerFeatureFlags } from './domain';
import { ImageViewer } from './viewers/image';
import { VideoViewer } from './viewers/video';
import { AudioViewer } from './viewers/audio';
import { DocViewer } from './viewers/doc';
import { Spinner } from './loading';
import { Subscription } from 'rxjs';
import * as deepEqual from 'deep-equal';
import { ErrorMessage, createError, MediaViewerError } from './error';
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
  item: Outcome<FileItem, MediaViewerError>;
};

const initialState: State = { item: { status: 'PENDING' } };
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

  render() {
    const {
      context,
      identifier,
      featureFlags,
      showControls,
      onClose,
      previewCount,
    } = this.props;
    const { item } = this.state;
    switch (item.status) {
      case 'PENDING':
        return <Spinner />;
      case 'SUCCESSFUL':
        const itemUnwrapped = item.data;
        const viewerProps = {
          context,
          item: itemUnwrapped,
          collectionName: identifier.collectionName,
          onClose,
          previewCount,
        };
        switch (itemUnwrapped.details.mediaType) {
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
            return (
              <ErrorMessage error={createError('unsupported')}>
                <p>Try downloading the file to view it.</p>
                {this.renderDownloadButton(itemUnwrapped)}
              </ErrorMessage>
            );
        }
      case 'FAILED':
        const error = item.err;
        const fileItem = item.err.fileItem;
        if (fileItem) {
          return (
            <ErrorMessage error={error}>
              <p>Try downloading the file to view it.</p>
              {this.renderDownloadButton(fileItem)}
            </ErrorMessage>
          );
        } else {
          return <ErrorMessage error={error} />;
        }
    }
  }

  private renderDownloadButton(fileItem: FileItem) {
    const { context, identifier } = this.props;
    return renderDownloadButton(fileItem, context, identifier.collectionName);
  }

  private init(props: Props) {
    this.setState(initialState);
    const { context, identifier } = props;
    const provider = context.getMediaItemProvider(
      identifier.id,
      identifier.type,
      identifier.collectionName,
    );

    this.subscription = provider.observable().subscribe({
      next: mediaItem => {
        if (mediaItem.type === 'link') {
          this.setState({
            item: {
              status: 'FAILED',
              err: createError('linksNotSupported'),
            },
          });
        } else {
          const { processingStatus } = mediaItem.details;
          if (processingStatus === 'failed') {
            this.setState({
              item: {
                status: 'FAILED',
                err: createError('previewFailed', mediaItem),
              },
            });
          } else if (processingStatus === 'succeeded') {
            this.setState({
              item: {
                status: 'SUCCESSFUL',
                data: mediaItem,
              },
            });
          }
        }
      },
      error: () => {
        this.setState({
          item: {
            status: 'FAILED',
            err: createError('metadataFailed'),
          },
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

  private release() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
