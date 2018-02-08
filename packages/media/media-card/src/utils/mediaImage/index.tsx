import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Component } from 'react';

import { ImageViewWrapper } from './styled';

export interface MediaImageProps {
  dataURI: string;
  shouldFadeIn?: boolean;
  shouldCrop?: boolean;
}

export interface MediaImageState {
  imgWidth: number;
  imgHeight: number;
  parentWidth: number;
  parentHeight: number;
}

export class MediaImage extends Component<MediaImageProps, MediaImageState> {
  static defaultProps = {
    shouldFadeIn: true,
    shouldCrop: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      imgWidth: 0,
      imgHeight: 0,
      parentWidth: Infinity,
      parentHeight: Infinity,
    };
  }

  private img: HTMLImageElement;

  componentWillMount() {
    const { dataURI } = this.props;
    this.measureImage(dataURI);
  }

  componentDidMount() {
    const parent = ReactDOM.findDOMNode(this).parentElement;
    if (!parent) {
      return;
    }

    const { width, height } = parent.getBoundingClientRect();
    this.setState({
      parentWidth: width,
      parentHeight: height,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { dataURI: newDataURI } = nextProps;
    const { dataURI: oldDataURI } = this.props;

    if (newDataURI !== oldDataURI) {
      this.measureImage(newDataURI);
    }
  }

  componentWillUnmount() {
    const { img } = this;
    img.removeEventListener('load', this.onImageLoad);
  }

  private measureImage = (dataURI: string) => {
    this.img = new Image();
    this.img.src = dataURI;

    // No need to handle error as measuring only affects image cropping
    this.img.addEventListener('load', this.onImageLoad);
  };

  private onImageLoad = () => {
    const { naturalWidth: imgWidth, naturalHeight: imgHeight } = this.img;
    this.setState({ imgWidth, imgHeight });
  };

  render() {
    const { dataURI, shouldCrop, shouldFadeIn } = this.props;
    const style = {
      backgroundSize: this.backgroundSize(),
      backgroundImage: `url(${dataURI})`,
    };
    const isCropped = shouldCrop;

    return (
      <ImageViewWrapper
        shouldFadeIn={shouldFadeIn}
        shouldCrop={isCropped}
        className="media-card"
        style={style}
      />
    );
  }

  private backgroundSize = (): string | undefined => {
    const { imgWidth, imgHeight } = this.state;

    return this.isSmallerThanWrapper()
      ? `${imgWidth}px ${imgHeight}px, auto`
      : undefined;
  };

  private isSmallerThanWrapper = (): boolean => {
    const { imgWidth, parentWidth, imgHeight, parentHeight } = this.state;
    return imgWidth < parentWidth && imgHeight < parentHeight;
  };
}
