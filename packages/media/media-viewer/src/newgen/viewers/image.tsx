import * as React from 'react';
import { Context, FileItem } from '@atlaskit/media-core';
import * as deepEqual from 'deep-equal';
import { Outcome } from '../domain';
import { Img, ImageWrapper } from '../styled';
import { Spinner } from '../loading';
import { ZoomControls } from '../zoomControls';
import { closeOnDirectClick } from '../utils/closeOnDirectClick';
import { ErrorMessage, createError, MediaViewerError } from '../error';
import { renderDownloadButton } from '../domain/download';
import { ZoomLevel } from '../domain/zoomLevel';

export type ObjectUrl = string;
export const REQUEST_CANCELLED = 'request_cancelled';

export type ImageViewerProps = {
  context: Context;
  item: FileItem;
  collectionName?: string;
  onClose?: () => void;
};

export type ImageViewerState = {
  objectUrl: Outcome<ObjectUrl, MediaViewerError>;
  zoomLevel: ZoomLevel;
};

const initialState: ImageViewerState = {
  objectUrl: { status: 'PENDING' },
  zoomLevel: new ZoomLevel(),
};

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

  private onZoomChange = (zoomLevel: ZoomLevel) => {
    this.setState({ zoomLevel });
  };

  renderImage(src: string) {
    const { onClose } = this.props;
    const { zoomLevel } = this.state;
    // We need to set new border value every time the zoom changes
    // to force a re layout in Chrome.
    // https://stackoverflow.com/questions/16687023/bug-with-transform-scale-and-overflow-hidden-in-chrome
    const border = `${zoomLevel.value / 100}px solid transparent`;
    // We use style attr instead of SC prop for perf reasons
    const imgStyle = {
      transform: `scale(${zoomLevel.value})`,
      border,
    };

    return (
      <ImageWrapper onClick={closeOnDirectClick(onClose)}>
        <Img src={src} style={imgStyle} />
        <ZoomControls
          zoomLevel={this.state.zoomLevel}
          onChange={this.onZoomChange}
        />
      </ImageWrapper>
    );
  }

  render() {
    const { objectUrl } = this.state;
    switch (objectUrl.status) {
      case 'PENDING':
        return <Spinner />;
      case 'SUCCESSFUL':
        return this.renderImage(objectUrl.data);
      case 'FAILED':
        return (
          <ErrorMessage error={objectUrl.err}>
            <p>Try downloading the file to view it.</p>
            {this.renderDownloadButton()}
          </ErrorMessage>
        );
    }
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

  private async init(fileItem: FileItem, context: Context) {
    this.setState(initialState, async () => {
      try {
        const service = context.getBlobService(this.props.collectionName);
        const { response, cancel } = service.fetchImageBlobCancelable(
          fileItem,
          {
            width: 1920,
            height: 1080,
            mode: 'fit',
            allowAnimated: true,
          },
        );
        this.cancelImageFetch = () => cancel(REQUEST_CANCELLED);
        const objectUrl = URL.createObjectURL(await response);
        this.setState({
          objectUrl: {
            status: 'SUCCESSFUL',
            data: objectUrl,
          },
        });
      } catch (err) {
        if (err.message === REQUEST_CANCELLED) {
          this.preventRaceCondition();
        } else {
          this.setState({
            objectUrl: {
              status: 'FAILED',
              err: createError('previewFailed', fileItem, err),
            },
          });
        }
      }
    });
  }

  private release() {
    if (this.cancelImageFetch) {
      this.cancelImageFetch();
    }
    const { objectUrl } = this.state;

    if (objectUrl.status === 'SUCCESSFUL') {
      this.revokeObjectUrl(objectUrl.data);
    }
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
