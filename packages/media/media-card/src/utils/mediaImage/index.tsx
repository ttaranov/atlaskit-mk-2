/**
 * Only used internally ATM
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Component } from 'react';

import { ImageViewWrapper, transparentFallbackBackground } from './styled';
import { CardDimensions } from '../../index';

export interface MediaImageProps {
  dataURI: string;
  fadeIn?: boolean;
  crop?: boolean;
  transparentFallback?: boolean;
  dimensions?: CardDimensions;
  width?: string;
  height?: string;
  className?: string;
  onError?: (this: HTMLElement, ev: ErrorEvent) => any;
}

export interface MediaImageState {
  imgWidth: number;
  imgHeight: number;
  parentWidth: number;
  parentHeight: number;
}

export class MediaImage extends Component<MediaImageProps, MediaImageState> {
  static defaultProps = {
    fadeIn: true,
    crop: true,
    transparentFallback: false,
    width: '100%',
    height: '100%',
  };

  constructor(props) {
    super(props);

    this.state = {
      imgWidth: 0,
      imgHeight: 0,
      parentWidth: Infinity,
      parentHeight: Infinity,
    };
    // TODO Test that this will work at all
    this.init();
  }

  private img;

  // TODO FIL-4060 we need to check whether the dataURI changes in componentWillReceiveProps()
  // and if it does recalculate the image height and width

  private init() {
    this.img = new Image();

    this.img.src = this.props.dataURI;
    this.img.onload = this.onImageLoad(this);
    if (this.props.onError) {
      this.img.onerror = this.props.onError;
    }

    const { dimensions } = this.props;
    if (
      dimensions &&
      typeof dimensions.height === 'number' &&
      typeof dimensions.width === 'number'
    ) {
      this.setState({
        parentWidth: dimensions.width,
        parentHeight: dimensions.height,
      });
    }
  }

  componentDidMount() {
    const parent = ReactDOM.findDOMNode(this).parentElement;
    if (!parent) {
      return;
    }

    if (
      this.state.parentHeight === Infinity ||
      this.state.parentWidth === Infinity
    ) {
      const { width, height } = parent.getBoundingClientRect();

      this.setState({
        parentWidth: width,
        parentHeight: height,
      });
    }
  }

  componentWillUnmount() {
    this.img.onload = null;
  }

  onImageLoad(component) {
    return function() {
      component.setState({
        imgWidth: this.width,
        imgHeight: this.height,
      });
    };
  }

  render() {
    const {
      transparentFallback,
      crop,
      dataURI,
      fadeIn,
      className,
    } = this.props;
    const { implicitNoCrop, backgroundSize } = this;
    const transparentBg = transparentFallback
      ? `, ${transparentFallbackBackground}`
      : '';
    const style = {
      backgroundSize,
      backgroundImage: `url(${dataURI})${transparentBg}`,
    };
    const isCropped = crop && !implicitNoCrop;
    const classNames = `media-card ${className}`;

    return (
      <ImageViewWrapper
        fadeIn={fadeIn}
        isCropped={isCropped}
        className={classNames}
        style={style}
      />
    );
  }

  private get isSmallerThanWrapper() {
    const { imgWidth, parentWidth, imgHeight, parentHeight } = this.state;

    return imgWidth < parentWidth && imgHeight < parentHeight;
  }

  // If users specifies a custom dimensions, we take that as a no-crop and prioritize it over the 'crop' property
  private get implicitNoCrop() {
    return this.props.width !== '100%' || this.props.height !== '100%';
  }

  private get backgroundSize() {
    const { width, height } = this.props;
    const { imgWidth, imgHeight } = this.state;

    return this.implicitNoCrop
      ? `${width} ${height}, auto`
      : this.isSmallerThanWrapper ? `${imgWidth}px ${imgHeight}px, auto` : null;
  }
}
