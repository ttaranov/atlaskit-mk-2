import * as React from 'react';
import Blanket from '@atlaskit/blanket';
import { Context, MediaType, MediaItem, FileItem } from '@atlaskit/media-core';
import * as deepEqual from 'deep-equal';
import { MediaViewerRenderer } from './media-viewer-renderer';
import { Model, Identifier, initialModel, ObjectUrl } from './domain';
import { constructAuthTokenUrl } from './util';

export type Props = {
  onClose?: () => void;
  context: Context;
  data: Identifier;
};

export type State = Model;

export class MediaViewer extends React.Component<Props, State> {
  state: State = initialModel;

  componentDidMount() {
    this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // It's possible that a different identifier or context was passed.
  // We therefore need to reset Media Viewer.
  componentWillUpdate(nextProps) {
    if (this.needsReset(this.props, nextProps)) {
      this.setState(initialModel);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.needsReset(this.props, prevProps)) {
      this.unsubscribe();
      this.subscribe();
    }
  }

  render() {
    const { onClose } = this.props;
    return (
      <div>
        <Blanket onBlanketClicked={onClose} isTinted />
        <MediaViewerRenderer model={this.state} />
      </div>
    );
  }

  // It's possible that a different identifier or context was passed.
  // We therefore need to reset Media Viewer.
  private needsReset(propsA, propsB) {
    return (
      !deepEqual(propsA.data, propsB.data) || propsA.context !== propsB.context
    );
  }

  private subscription?: any;

  private subscribe() {
    const { context } = this.props;
    const { id, type, collectionName } = this.props.data;
    const provider = context.getMediaItemProvider(id, type, collectionName);

    this.subscription = provider.observable().subscribe({
      next: mediaItem => {
        if (mediaItem.type === 'link') {
          this.setState({
            fileDetails: {
              status: 'FAILED',
              err: new Error('links are not supported at the moment'),
            },
          });
        } else {
          const { processingStatus, mediaType } = mediaItem.details;

          if (processingStatus === 'failed') {
            this.setState({
              fileDetails: {
                status: 'FAILED',
                err: new Error('processing failed'),
              },
            });
          } else if (processingStatus === 'succeeded') {
            this.setState({
              fileDetails: {
                status: 'SUCCESSFUL',
                data: {
                  mediaType: mediaType as MediaType,
                },
              },
            });

            this.populatePreviewData(mediaItem, context, collectionName);
          }
        }
      },
      error: err => {
        this.setState({
          fileDetails: {
            status: 'FAILED',
            err,
          },
        });
      },
    });
  }

  private unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private populatePreviewData(mediaItem, context, collectionName) {
    switch (mediaItem.details.mediaType) {
      case 'image':
        this.populateImagePreviewData(mediaItem, context);
        break;
      case 'video':
        this.populateVideoPreviewData(mediaItem, context, collectionName);
        break;
      default:
        this.notSupportedPreview(mediaItem);
        break;
    }
  }

  private async populateImagePreviewData(
    fileItem: MediaItem,
    context: Context,
  ) {
    try {
      // TODO:
      // - 1) MSW-530: revoke object URL
      // - 2) MSW-531: make sure we don't set a new state if the component is unmounted.
      const service = context.getBlobService();
      const { response } = service.fetchImageBlobCancelable(fileItem, {
        width: 800,
        height: 600,
        mode: 'fit',
        allowAnimated: true,
      });
      const objectUrl = URL.createObjectURL(await response);
      this.setState({
        previewData: {
          status: 'SUCCESSFUL',
          data: {
            viewer: 'IMAGE',
            objectUrl,
          },
        },
      });
    } catch (err) {
      this.setState({
        previewData: {
          status: 'FAILED',
          err,
        },
      });
    }
  }

  private async populateVideoPreviewData(
    fileItem: FileItem,
    context: Context,
    collectionName?: string,
  ) {
    const artifact = 'video_640.mp4';
    const videoArtifactUrl =
      fileItem.details &&
      fileItem.details.artifacts &&
      fileItem.details.artifacts[artifact] &&
      fileItem.details.artifacts[artifact].url;
    if (videoArtifactUrl) {
      const src = await constructAuthTokenUrl(
        videoArtifactUrl,
        context,
        collectionName,
      );
      this.setState({
        previewData: {
          status: 'SUCCESSFUL',
          data: {
            viewer: 'VIDEO',
            src,
          },
        },
      });
    } else {
      this.setState({
        previewData: {
          status: 'FAILED',
          err: new Error('no video artifacts found for this file'),
        },
      });
    }
  }

  private notSupportedPreview(fileItem: FileItem) {
    this.setState({
      previewData: {
        status: 'FAILED',
        err: new Error(`not supported`),
      },
    });
  }
}
