import * as React from 'react';
import { Context, ProcessedFileState, MediaItem } from '@atlaskit/media-core';
import * as deepEqual from 'deep-equal';
import { Outcome } from '../../domain';
import { Spinner } from '../../loading';
import { ErrorMessage, createError, MediaViewerError } from '../../error';
import { renderDownloadButton } from '../../domain/download';
import { InteractiveImg } from './interactive-img';

export type ObjectUrl = string;
export const REQUEST_CANCELLED = 'request_cancelled';

export type ImageViewerProps = {
  context: Context;
  item: ProcessedFileState;
  collectionName?: string;
  onClose?: () => void;
};

export type ImageViewerState = {
  objectUrl: Outcome<ObjectUrl, MediaViewerError>;
};

const initialState: ImageViewerState = {
  objectUrl: Outcome.pending(),
};

function processedFileStateToMediaItem(file: ProcessedFileState): MediaItem {
  return {
    type: 'file',
    details: {
      id: file.id,
    },
  };
}

export class ImageViewer extends React.Component<
  ImageViewerProps,
  ImageViewerState
> {
  state: ImageViewerState = initialState;

  componentDidMount() {
    this.init(this.props.item, this.props.context);
  }

  componentWillUnmount() {
    this.release();
  }

  componentWillUpdate(nextProps: ImageViewerProps) {
    if (this.needsReset(this.props, nextProps)) {
      this.release();
      this.init(nextProps.item, this.props.context);
    }
  }

  render() {
    const { onClose } = this.props;
    return this.state.objectUrl.match({
      pending: () => <Spinner />,
      successful: objectUrl => (
        <InteractiveImg src={objectUrl} onClose={onClose} />
      ),
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

  private cancelImageFetch?: () => void;

  // This method is spied on by some test cases, so don't rename or remove it.
  public preventRaceCondition() {
    // Calling setState might introduce a race condition, because the app has
    // already transitioned to a different state. To avoid this we're not doing
    // anything.
  }

  private async init(file: ProcessedFileState, context: Context) {
    let state: ImageViewerState = initialState;

    if (file.preview && file.preview.blob) {
      const objectUrl = URL.createObjectURL(file.preview.blob);
      state = {
        objectUrl: Outcome.successful(objectUrl),
      };
    }

    this.setState(state, async () => {
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
          objectUrl: Outcome.successful(objectUrl),
        });
      } catch (err) {
        if (err.message === REQUEST_CANCELLED) {
          this.preventRaceCondition();
        } else {
          this.setState({
            objectUrl: Outcome.failed(createError('previewFailed', err, file)),
          });
        }
      }
    });
  }

  private release() {
    if (this.cancelImageFetch) {
      this.cancelImageFetch();
    }

    this.state.objectUrl.whenSuccessful(objectUrl => {
      this.revokeObjectUrl(objectUrl);
    });
  }

  private needsReset(propsA: ImageViewerProps, propsB: ImageViewerProps) {
    return (
      !deepEqual(propsA.item, propsB.item) || propsA.context !== propsB.context
    );
  }

  // This method is spied on by some test cases, so don't rename or remove it.
  public revokeObjectUrl(objectUrl: string) {
    URL.revokeObjectURL(objectUrl);
  }
}
