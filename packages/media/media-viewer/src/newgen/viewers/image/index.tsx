import * as React from 'react';
import { Context, ProcessedFileState, MediaItem } from '@atlaskit/media-core';
import { Outcome } from '../../domain';
import { createError, MediaViewerError } from '../../error';
import { InteractiveImg } from './interactive-img';
import { AnalyticViewerProps } from '../../analytics/item-viewer';
import { BaseViewer } from '../base-viewer';

export type ObjectUrl = string;
export const REQUEST_CANCELLED = 'request_cancelled';

export type ImageViewerProps = AnalyticViewerProps & {
  context: Context;
  item: ProcessedFileState;
  collectionName?: string;
  onClose?: () => void;
};

function processedFileStateToMediaItem(file: ProcessedFileState): MediaItem {
  return {
    type: 'file',
    details: {
      id: file.id,
    },
  };
}

export class ImageViewer extends BaseViewer<ObjectUrl, ImageViewerProps> {
  protected get initialState() {
    return { content: Outcome.pending<ObjectUrl, MediaViewerError>() };
  }

  private cancelImageFetch?: () => void;

  // This method is spied on by some test cases, so don't rename or remove it.
  public preventRaceCondition() {
    // Calling setState might introduce a race condition, because the app has
    // already transitioned to a different state. To avoid this we're not doing
    // anything.
  }

  protected async init() {
    const { item: file, context } = this.props;
    try {
      const service = context.getBlobService(this.props.collectionName);
      // MSW-922: once we make getImage cancelable we can use it instead of fetchImageBlobCancelable
      const item = processedFileStateToMediaItem(file);
      const { response, cancel } = service.fetchImageBlobCancelable(item, {
        width: 1920,
        height: 1080,
        mode: 'fit',
        allowAnimated: true,
      });
      this.cancelImageFetch = () => cancel(REQUEST_CANCELLED);
      const objectUrl = URL.createObjectURL(await response);
      this.setState({
        content: Outcome.successful(objectUrl),
      });
    } catch (err) {
      if (err.message === REQUEST_CANCELLED) {
        this.preventRaceCondition();
      } else {
        this.setState({
          content: Outcome.failed(createError('previewFailed', err, file)),
        });
        this.props.onLoad({ status: 'error', errorMessage: err.message });
      }
    }
  }

  protected release() {
    if (this.cancelImageFetch) {
      this.cancelImageFetch();
    }

    this.state.content.whenSuccessful(objectUrl => {
      this.revokeObjectUrl(objectUrl);
    });
  }

  // This method is spied on by some test cases, so don't rename or remove it.
  public revokeObjectUrl(objectUrl: string) {
    URL.revokeObjectURL(objectUrl);
  }

  protected renderSuccessful(content: ObjectUrl) {
    const { onClose } = this.props;
    return (
      <InteractiveImg
        onLoad={this.onLoad}
        onError={this.onError}
        src={content}
        onClose={onClose}
      />
    );
  }

  private onLoad = () => {
    this.props.onLoad({ status: 'success' });
  };

  private onError = () => {
    this.props.onLoad({
      status: 'error',
      errorMessage: 'Interactive-img render failed',
    });
  };
}
