import * as React from 'react';
import { Context, FileItem } from '@atlaskit/media-core';
import * as deepEqual from 'deep-equal';
import { Outcome } from '../domain';
import { ErrorMessage, ImageWrapper } from '../styled';
import { Spinner } from '../loading';
import ZoomableImage from 'react-zoomable-image';

export type ObjectUrl = string;
export const REQUEST_CANCELLED = 'request_cancelled';

export type ImageViewerProps = {
  context: Context;
  item: FileItem;
  collectionName?: string;
};

export type ImageViewerState = {
  objectUrl: Outcome<ObjectUrl, Error>;
  zoomLevel: number;
};
const initialState: ImageViewerState = {
  objectUrl: { status: 'PENDING' },
  zoomLevel: 1,
};

const defaultWidth = 1200;
const defaultHeight = 800;

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

  renderImage(src: string) {
    return (
      <ImageWrapper>
        <ZoomableImage
          displayMap={false}
          baseImage={{
            src,
            width: defaultWidth,
            height: defaultHeight,
          }}
          largeImage={{
            src,
            width: defaultWidth * 1.5,
            height: defaultHeight * 1.5,
          }}
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
            width: defaultWidth,
            height: defaultHeight,
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
