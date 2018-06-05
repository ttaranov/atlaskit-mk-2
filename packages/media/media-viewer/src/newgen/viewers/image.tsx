import * as React from 'react';
import { Context, FileItem } from '@atlaskit/media-core';
import * as deepEqual from 'deep-equal';
import { Outcome } from '../domain';
import { Img, ErrorMessage, ImageWrapper } from '../styled';
import { Spinner } from '../loading';
import { ZoomControls } from '../zoomControls';

export type ObjectUrl = string;
export const REQUEST_CANCELLED = 'request_cancelled';

export type ImageViewerProps = {
  context: Context;
  item: FileItem;
  collectionName?: string;
  onClose?: () => void;
};

export type ImageViewerState = {
  objectUrl: Outcome<ObjectUrl, Error>;
  zoomLevel: number;
};
const initialState: ImageViewerState = {
  objectUrl: { status: 'PENDING' },
  zoomLevel: 1,
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

  componentWillUpdate(nextProps) {
    if (this.needsReset(this.props, nextProps)) {
      this.release();
      this.init(nextProps.item, this.props.context);
    }
  }

  private onZoomChange = zoomLevel => {
    this.setState({ zoomLevel });
  };

  renderImage(src: string) {
    const { zoomLevel } = this.state;
    // We need to set new border value every time the zoom changes
    // to force a re layout in Chrome.
    // https://stackoverflow.com/questions/16687023/bug-with-transform-scale-and-overflow-hidden-in-chrome
    const border = `${zoomLevel / 100}px solid transparent`;
    // We use style attr instead of SC prop for perf reasons
    const imgStyle = {
      transform: `scale(${zoomLevel})`,
      border,
    };

    return (
      <ImageWrapper onClick={this.onClickContentClose}>
        <Img src={src} style={imgStyle} />
        <ZoomControls zoomLevel={zoomLevel} onChange={this.onZoomChange} />
      </ImageWrapper>
    );
  }

  private onClickContentClose = e => {
    const { onClose } = this.props;
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  render() {
    const { objectUrl } = this.state;
    switch (objectUrl.status) {
      case 'PENDING':
        return <Spinner />;
      case 'SUCCESSFUL':
        return this.renderImage(objectUrl.data);
      case 'FAILED':
        return <ErrorMessage>{objectUrl.err.message}</ErrorMessage>;
    }
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
            width: 800,
            height: 600,
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
              err,
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
  public revokeObjectUrl(objectUrl) {
    URL.revokeObjectURL(objectUrl);
  }
}
