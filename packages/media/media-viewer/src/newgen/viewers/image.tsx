import * as React from 'react';
import { Context, FileItem } from '@atlaskit/media-core';
import * as deepEqual from 'deep-equal';
import AnnotateIcon from '@atlaskit/icon/glyph/media-services/annotate';
import Button from '@atlaskit/button';
import { LoadParameters, EditorView } from '@atlaskit/media-editor';
import { Outcome, ZoomLevel } from '../domain';
import { Img, ErrorMessage, ImageWrapper, EditorWrapper } from '../styled';
import { Spinner } from '../loading';
import { ZoomControls } from '../zoomControls';
import { closeOnDirectClick } from '../utils/closeOnDirectClick';

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
  zoomLevel: ZoomLevel;
  isAnnotating: boolean;
};

const initialState: ImageViewerState = {
  objectUrl: { status: 'PENDING' },
  zoomLevel: new ZoomLevel(),
  isAnnotating: false,
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

  private onEditorError = (
    message: string,
    retryHandler?: () => void,
  ): void => {
    // this.props.onShowEditorError({ message, retryHandler });
  };

  private onMediaEditorLoad = (
    url: string,
    loadParameters: LoadParameters,
  ): void => {
    // this.loadParameters = loadParameters;
  };

  private closeEditor = () => {
    this.setState({
      isAnnotating: false,
    });
  };

  private onEditorCancel = (): void => {
    this.closeEditor();
    // this.props.onCloseEditor();
  };

  private onEditorSave = (content: string) => {
    const { context, item, collectionName: collection } = this.props;
    // TODO: find a better name
    const name = `${item.details.name}-1`;

    context
      .uploadFile({
        collection,
        content,
        name,
      })
      .subscribe({
        next: state => {
          console.log(state);
        },
        error: err => {
          console.log(err);
        },
      });

    // TODO: do after upload finish
    this.closeEditor();
  };

  renderEditor = (imageUrl: string) => {
    return (
      <EditorWrapper>
        <EditorView
          imageUrl={imageUrl}
          onSave={this.onEditorSave}
          onCancel={this.onEditorCancel}
          onError={this.onEditorError}
        />
      </EditorWrapper>
    );
  };

  // renderEditor(imageUrl: string): JSX.Element {
  //   // const onError = (url: string, error: Error) => this.onError(error);
  //   const onError = (url: string, error: Error) => {
  //     console.log(error);
  //   };
  //   const onShapeParametersChanged = ({
  //     color,
  //     lineWidth,
  //   }: ShapeParameters) => {
  //     // this.setState({ color, lineWidth });
  //   };
  //   // TODO: pass image dimensions
  //   const dimensions = {width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT};
  //   const color = { red: 0xbf, green: 0x26, blue: 0x00 };
  //   const lineWidth = 10;
  //   const tool = 'arrow';

  //   return (
  //     <MediaEditor
  //       imageUrl={imageUrl}
  //       dimensions={dimensions}
  //       backgroundColor={TRANSPARENT_COLOR}
  //       shapeParameters={{ color, lineWidth, addShadow: true }}
  //       tool={tool}
  //       onLoad={this.onMediaEditorLoad}
  //       onError={onError}
  //       onShapeParametersChanged={onShapeParametersChanged}
  //     />
  //   );
  // }

  onAnnotateClick = () => {
    this.setState({
      isAnnotating: true,
    });
  };

  renderAnnotateButton = () => {
    return (
      <Button
        onClick={this.onAnnotateClick}
        iconBefore={<AnnotateIcon label="annotate" />}
      />
    );
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
        >
          {this.renderAnnotateButton()}
        </ZoomControls>
      </ImageWrapper>
    );
  }

  render() {
    const { objectUrl, isAnnotating } = this.state;
    switch (objectUrl.status) {
      case 'PENDING':
        return <Spinner />;
      case 'SUCCESSFUL':
        if (isAnnotating) {
          return this.renderEditor(objectUrl.data);
        } else {
          return this.renderImage(objectUrl.data);
        }
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
