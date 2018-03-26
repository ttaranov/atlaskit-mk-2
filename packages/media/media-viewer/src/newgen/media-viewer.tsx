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
      next: async mediaItem => {
        if (mediaItem.type === 'link') {
          this.setState({
            fileDetails: {
              status: 'FAILED',
              err: new Error('links are not supported at the moment'),
            }
          });
        } else {
          const { processingStatus, mediaType } = mediaItem.details;

          if (processingStatus === 'failed') {
            this.setState({
              fileDetails: {
                status: 'FAILED',
                err: new Error('processing failed'),
              }
             });
          } else if (processingStatus === 'succeeded') {
            this.setState({
              fileDetails: {
                status: 'SUCCESSFUL',
                data: {
                  mediaType: mediaType as MediaType,
                },
              }
            });

            switch (mediaItem.details.mediaType) {
              case 'image':
                return await this.populateImagePreviewData(mediaItem, context);
              case 'video':
                return await this.populateVideoPreviewData(mediaItem, context, collectionName);
              default:
                return await this.notSupportedPreview(mediaItem);
            }
          }
        }
      },
      complete: () => {
        /* do nothing */
      },
      error: err => {
        this.setState({
          fileDetails: {
            status: 'FAILED',
            err
          }
        });
      },
    });
  }

  private unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  private async notSupportedPreview(fileItem: FileItem) {
    this.setState({
      previewData: {
        status: 'FAILED',
        err: new Error(`not supported`)
      }
    });
  }

  private async populateVideoPreviewData(fileItem: FileItem, context: Context, collectionName?: string) {
    const videoArtifactUrl = getVideoArtifactUrl(fileItem, true); // HD for now.
    if (videoArtifactUrl) {
      const objectUrl = await constructAuthTokenUrl(videoArtifactUrl, context, collectionName);
      this.setState({
        previewData: {
          status: 'SUCCESSFUL',
          data: {
            viewer: 'VIDEO',
            objectUrl
          }
        }
      });
    } else {
      this.setState({
        previewData: {
          status: 'FAILED',
          err: new Error('no video artifacts found for this file')
        }
      });
    }
  }

  private async populateImagePreviewData (fileItem: MediaItem, context: Context) {
    try {
      // TODO:
      // - 1) MSW-530: revoke object URL
      // - 2) MSW-531: make sure we don't set a new state if the component is unmounted.
      const objectUrl = await getImageObjectUrl(fileItem, context, 800, 600);
      this.setState({
        previewData: {
          status: 'SUCCESSFUL',
          data: {
            viewer: 'IMAGE',
            objectUrl,
          }
        }
      });
    } catch (err) {
      this.setState({
        previewData: {
          status: 'FAILED',
          err
        }
      });
    }
  }
}

function getVideoArtifactUrl(fileItem: FileItem, hd: boolean) {
  const artifact = hd ? 'video_640.mp4' : 'video_1280.mp4';
  return fileItem.details
    && fileItem.details.artifacts
    && fileItem.details.artifacts[artifact]
    && fileItem.details.artifacts[artifact].url;
}

async function getImageObjectUrl(
  mediaItem: MediaItem,
  context: Context,
  width,
  height
): Promise<ObjectUrl> {
  const service = context.getBlobService();
  const blob = await service.fetchImageBlob(mediaItem, {
    width,
    height,
    mode: 'fit',
    allowAnimated: true,
  });
  return URL.createObjectURL(blob);
}
