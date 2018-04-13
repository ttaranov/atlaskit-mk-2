import * as React from 'react';
import { Subscription } from 'rxjs';
import * as deepEqual from 'deep-equal';
import Blanket from '@atlaskit/blanket';
import { Context, MediaType, MediaItem, FileItem } from '@atlaskit/media-core';
import { MediaViewerRenderer } from './media-viewer-renderer';
import { Model, Identifier, initialModel } from './domain';
import { constructAuthTokenUrl } from './util';
import { fetch } from './viewers/pdf/pdfComponent';

export type Props = {
  onClose?: () => void;
  context: Context;
  data: Identifier;
};

export type State = Model;

export const REQUEST_CANCELLED = 'request_cancelled';

export class MediaViewer extends React.Component<Props, State> {
  state: State = initialModel;

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.release();
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
      this.release();
      this.init();
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

  private itemDetails?: Subscription;

  private init() {
    const { context } = this.props;
    const { id, type, collectionName } = this.props.data;
    const provider = context.getMediaItemProvider(id, type, collectionName);

    this.itemDetails = provider.observable().subscribe({
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

  private release() {
    if (this.itemDetails) {
      this.itemDetails.unsubscribe();
    }
    if (this.cancelImageFetch) {
      this.cancelImageFetch();
    }
    const { previewData } = this.state;
    if (previewData.status === 'SUCCESSFUL') {
      const { data } = previewData;
      if (data.viewer === 'IMAGE') {
        this.revokeObjectUrl(data.objectUrl);
      }
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
      case 'doc':
        this.populatePDFPreviewData(mediaItem, context, collectionName);
        break;
      default:
        this.notSupportedPreview(mediaItem);
        break;
    }
  }

  private cancelImageFetch?: () => void;

  // This method is spied on by some test cases, so don't rename or remove it.
  public revokeObjectUrl(objectUrl) {
    URL.revokeObjectURL(objectUrl);
  }

  private async populateImagePreviewData(
    fileItem: MediaItem,
    context: Context,
  ) {
    try {
      const service = context.getBlobService();
      const { response, cancel } = service.fetchImageBlobCancelable(fileItem, {
        width: 800,
        height: 600,
        mode: 'fit',
        allowAnimated: true,
      });
      this.cancelImageFetch = () => cancel(REQUEST_CANCELLED);
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
      if (err.message === REQUEST_CANCELLED) {
        this.preventRaceCondition();
      } else {
        this.setState({
          previewData: {
            status: 'FAILED',
            err,
          },
        });
      }
    }
  }

  // This method is spied on by some test cases, so don't rename or remove it.
  public preventRaceCondition() {
    // Calling setState might introduce a race condition, because the app has
    // already transitioned to a different state. To avoid this we're not doing
    // anything.
  }

  private async populateVideoPreviewData(
    fileItem: FileItem,
    context: Context,
    collectionName?: string,
  ) {
    const videoArtifactUrl = getVideoArtifactUrl(fileItem);
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
          err: new Error('no pdf artifacts found for this file'),
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

  private async populatePDFPreviewData(
    fileItem: FileItem,
    context: Context,
    collectionName?: string,
  ) {
    const pdfArtifactUrl = getPDFUrl(fileItem);
    if (pdfArtifactUrl) {
      const src = await constructAuthTokenUrl(
        pdfArtifactUrl,
        context,
        collectionName,
      );
      this.setState({
        previewData: {
          status: 'SUCCESSFUL',
          data: {
            viewer: 'PDF',
            doc: await fetch(src),
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
}

function getVideoArtifactUrl(fileItem: FileItem) {
  const artifact = 'video_640.mp4';
  return (
    fileItem.details &&
    fileItem.details.artifacts &&
    fileItem.details.artifacts[artifact] &&
    fileItem.details.artifacts[artifact].url
  );
}

function getPDFUrl(fileItem: FileItem) {
  const artifact = 'document.pdf';
  return (
    fileItem.details &&
    fileItem.details.artifacts &&
    fileItem.details.artifacts[artifact] &&
    fileItem.details.artifacts[artifact].url
  );
}
