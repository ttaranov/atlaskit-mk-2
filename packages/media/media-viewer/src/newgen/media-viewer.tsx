import * as React from 'react';
import { Subscription } from 'rxjs';
import * as deepEqual from 'deep-equal';
import { Context, MediaType, FileItem } from '@atlaskit/media-core';
import { MediaViewerRenderer } from './media-viewer-renderer';
import { Model, Identifier, initialModel } from './domain';
import { constructAuthTokenUrl } from './util';
import { fetch } from './viewers/pdf/loader';

export type Props = {
  onClose?: () => void;
  context: Context;
  data: Identifier;
};

export type State = Model;

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
    const { onClose, context } = this.props;
    const { fileDetails } = this.state;
    const item =
      fileDetails.status === 'SUCCESSFUL' ? fileDetails.data.item : void 0;
    return (
      <MediaViewerRenderer
        onClose={onClose}
        item={item}
        context={context}
        model={this.state}
      />
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
                  name: mediaItem.details.name,
                  item: mediaItem,
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
  }

  private populatePreviewData(mediaItem, context, collectionName) {
    switch (mediaItem.details.mediaType) {
      case 'image':
        this.setState({
          previewData: {
            status: 'SUCCESSFUL',
            data: {
              viewer: 'IMAGE',
            },
          },
        });
        break;
      case 'video':
        this.setState({
          previewData: {
            status: 'SUCCESSFUL',
            data: {
              viewer: 'VIDEO',
            },
          },
        });
        break;
      case 'doc':
        this.populatePDFPreviewData(mediaItem, context, collectionName);
        break;
      default:
        this.notSupportedPreview(mediaItem);
        break;
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

function getPDFUrl(fileItem: FileItem) {
  const artifact = 'document.pdf';
  return (
    fileItem.details &&
    fileItem.details.artifacts &&
    fileItem.details.artifacts[artifact] &&
    fileItem.details.artifacts[artifact].url
  );
}
