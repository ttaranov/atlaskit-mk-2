import * as React from 'react';
import { BaselineExtend, ImageWrapper, Img } from '../../styled';
import { ZoomLevel } from '../../domain/zoomLevel';
import { closeOnDirectClick } from '../../utils/closeOnDirectClick';
import { ZoomControls } from '../../zoomControls';
import { Rectangle } from '../../domain/rectangle';
import { Outcome } from '../../domain';
import { computeProjection } from '../../domain/projection';

export type Props = {
  src: string;
  onClose?: () => void;
};

export type State = {
  zoomLevel: ZoomLevel;
  dimensions: Outcome<
    {
      viewport: Rectangle;
      img: Rectangle;
    },
    never
  >;
};

const initialState: State = {
  zoomLevel: new ZoomLevel(),
  dimensions: { status: 'PENDING' },
};

export class InteractiveImg extends React.Component<Props, State> {
  state: State = initialState;
  private wrapper?: HTMLDivElement;

  componentDidMount() {
    this.state = initialState;
  }

  render() {
    const { src, onClose } = this.props;
    const { zoomLevel, dimensions } = this.state;

    // We use style attr instead of SC prop for perf reasons
    let imgStyle = {};
    if (dimensions.status === 'SUCCESSFUL') {
      const { viewport, img } = dimensions.data;
      const { width, height } = computeProjection(
        img,
        viewport,
        zoomLevel.value,
      );
      imgStyle = { width, height };
    }

    return (
      <ImageWrapper
        onClick={closeOnDirectClick(onClose)}
        innerRef={ref => (this.wrapper = ref)}
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
      const img = new Rectangle(naturalWidth, naturalHeight);
      this.setState({
        dimensions: {
          status: 'SUCCESSFUL',
          data: {
            viewport,
            img,
          },
        },
      });
    }
  };

  private onZoomChange = (zoomLevel: ZoomLevel) => {
    this.setState({ zoomLevel }, () => {
      const { dimensions } = this.state;
      if (dimensions.status === 'SUCCESSFUL' && this.wrapper) {
        const { viewport, img } = dimensions.data;
        const { offsetLeft, offsetTop } = computeProjection(
          img,
          viewport,
          zoomLevel.value,
        );
        this.wrapper.scrollLeft = offsetLeft;
        this.wrapper.scrollTop = offsetTop;
      }
    });
  };
}
