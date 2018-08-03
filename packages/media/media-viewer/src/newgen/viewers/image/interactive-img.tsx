import * as React from 'react';
import { BaselineExtend, ImageWrapper, Img } from '../../styled';
import { ZoomLevel } from '../../domain/zoomLevel';
import { closeOnDirectClick } from '../../utils/closeOnDirectClick';
import { ZoomControls } from '../../zoomControls';
import { Outcome } from '../../domain';
import { Rectangle, Camera, Vector2 } from '../../domain/camera';

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
      const { clientWidth, clientHeight } = this.wrapper;
      const { naturalWidth, naturalHeight } = ev.currentTarget;
      const viewport = new Rectangle(clientWidth, clientHeight);
      const originalImg = new Rectangle(naturalWidth, naturalHeight);
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
