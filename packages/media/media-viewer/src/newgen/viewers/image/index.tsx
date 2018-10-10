import * as React from 'react';
import { Context, ProcessedFileState, MediaItem } from '@atlaskit/media-core';
import * as deepEqual from 'deep-equal';
import { Outcome } from '../../domain';
import { createError, MediaViewerError } from '../../error';
import { InteractiveImg } from './interactive-img';
import { BaseViewer } from '../base-viewer';

export type ObjectUrl = string;
export const REQUEST_CANCELLED = 'request_cancelled';

export type ImageViewerProps = {
  context: Context;
  item: ProcessedFileState;
  collectionName?: string;
  onClose?: () => void;
};

export type ImageViewerState = {
  resource: Outcome<ObjectUrl, MediaViewerError>;
};

function processedFileStateToMediaItem(file: ProcessedFileState): MediaItem {
  return {
    type: 'file',
    details: {
      id: file.id,
    },
  };
}

export class ImageViewer extends BaseViewer<
  ObjectUrl,
  ImageViewerProps,
  ImageViewerState
> {
  protected get initialState(): ImageViewerState {
    return {
      resource: Outcome.pending(),
    };
  }

  renderSuccessful(objectUrl: ObjectUrl) {
    const { onClose } = this.props;
    return <InteractiveImg src={objectUrl} onClose={onClose} />;
  }

  protected async init(props: ImageViewerProps) {
    const { item: file, context } = props;
    this.setState(this.initialState, async () => {
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
          resource: Outcome.successful(objectUrl),
        });
      } catch (err) {
        if (err.message === REQUEST_CANCELLED) {
          this.preventRaceCondition();
        } else {
          this.setState({
            resource: Outcome.failed(createError('previewFailed', err, file)),
          });
        }
      }
    });
  }

  protected release() {
    if (this.cancelImageFetch) {
      this.cancelImageFetch();
    }

    this.state.resource.whenSuccessful(objectUrl => {
      this.revokeObjectUrl(objectUrl);
    });
  }

  private cancelImageFetch?: () => void;

  // This method is spied on by some test cases, so don't rename or remove it.
  public preventRaceCondition() {
    // Calling setState might introduce a race condition, because the app has
    // already transitioned to a different state. To avoid this we're not doing
    // anything.
  }

  protected needsReset(propsA: ImageViewerProps, propsB: ImageViewerProps) {
    return (
      !deepEqual(propsA.item, propsB.item) || propsA.context !== propsB.context
    );
  }

  // This method is spied on by some test cases, so don't rename or remove it.
  public revokeObjectUrl(objectUrl: string) {
    URL.revokeObjectURL(objectUrl);
  }
}
