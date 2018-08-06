import * as React from 'react';
import { BaselineExtend, ImageWrapper, Img } from '../../styled';
import { ZoomLevel } from '../../domain/zoomLevel';
import { closeOnDirectClick } from '../../utils/closeOnDirectClick';
import { ZoomControls } from '../../zoomControls';
import { Outcome } from '../../domain';
import { Rectangle, Camera, Vector2 } from '../../domain/camera';

export function zoomLevelAfterResize(
  newCamera: Camera,
  oldCamera: Camera,
  oldZoomLevel: ZoomLevel,
) {
  const isImgScaledToFit = oldZoomLevel.value === oldCamera.scaleDownToFit;
  const zoomLevelToRefit = new ZoomLevel(newCamera.scaleDownToFit);
  return isImgScaledToFit ? zoomLevelToRefit : oldZoomLevel;
}

const clientRectangle = (el: HTMLElement): Rectangle => {
  const { clientWidth, clientHeight } = el;
  return new Rectangle(clientWidth, clientHeight);
};

const naturalSizeRectangle = (el: HTMLImageElement): Rectangle => {
  const { naturalWidth, naturalHeight } = el;
  return new Rectangle(naturalWidth, naturalHeight);
};

export type Props = {
  src: string;
  onClose?: () => void;
};

export type State = {
  zoomLevel: ZoomLevel;
  camera: Outcome<Camera, never>;
};

const initialState: State = {
  zoomLevel: new ZoomLevel(1),
  camera: { status: 'PENDING' },
};

export class InteractiveImg extends React.Component<Props, State> {
  state: State = initialState;
  private wrapper?: HTMLDivElement;
  private saveWrapperRef = (ref: HTMLDivElement) => (this.wrapper = ref);

  componentDidMount() {
    this.state = initialState;
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  render() {
    const { src, onClose } = this.props;
    const { zoomLevel, camera } = this.state;

    // We use style attr instead of SC prop for perf reasons
    const imgStyle =
      camera.status === 'SUCCESSFUL'
        ? camera.data.scaledImg(zoomLevel.value)
        : {};

    return (
      <ImageWrapper
        onClick={closeOnDirectClick(onClose)}
        innerRef={this.saveWrapperRef}
      >
        <Img src={src} style={imgStyle} onLoad={this.onImgLoad} />
        {/*
          The BaselineExtend element is required to align the Img element in the
          vertical center of the page. It ensures that the parent container is
          at least 100% of the viewport height and makes it possible to set
          vertical-align: middle on the image.
         */}
        <BaselineExtend />
        <ZoomControls zoomLevel={zoomLevel} onChange={this.onZoomChange} />
      </ImageWrapper>
    );
  }

  private onImgLoad = (ev: React.SyntheticEvent<HTMLImageElement>) => {
    if (this.wrapper) {
      const viewport = clientRectangle(this.wrapper);
      const originalImg = naturalSizeRectangle(ev.currentTarget);
      const camera = new Camera(viewport, originalImg);
      this.setState({
        camera: {
          status: 'SUCCESSFUL',
          data: camera,
        },
        zoomLevel: new ZoomLevel(camera.scaleDownToFit),
      });
    }
  };

  private onResize = () => {
    if (this.wrapper && this.state.camera.status === 'SUCCESSFUL') {
      const oldCamera = this.state.camera.data;
      const oldZoomLevel = this.state.zoomLevel;

      const newViewport = clientRectangle(this.wrapper);
      const newCamera = oldCamera.resizedViewport(newViewport);
      const newZoomLevel = zoomLevelAfterResize(
        newCamera,
        oldCamera,
        oldZoomLevel,
      );

      this.setState({
        camera: {
          status: 'SUCCESSFUL',
          data: newCamera,
        },
        zoomLevel: newZoomLevel,
      });
    }
  };

  private onZoomChange = (nextZoomLevel: ZoomLevel) => {
    const { camera } = this.state;
    const { wrapper } = this;
    if (wrapper && camera.status === 'SUCCESSFUL') {
      const { scrollLeft, scrollTop } = wrapper;
      const prevOffset = new Vector2(scrollLeft, scrollTop);
      const prevZoomLevel = this.state.zoomLevel;
      this.setState({ zoomLevel: nextZoomLevel }, () => {
        const { x, y } = camera.data.scaledOffset(
          prevOffset,
          prevZoomLevel.value,
          nextZoomLevel.value,
        );
        wrapper.scrollLeft = x;
        wrapper.scrollTop = y;
      });
    }
  };
}
