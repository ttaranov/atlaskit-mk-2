/**
 * Only used internally ATM
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Component } from 'react';
import {
  CoverHorizontalImageComponent,
  CoverVerticalImageComponent,
  FitImageComponent,
} from './styled';

export interface MediaImageProps {
  dataURI: string;
  crop?: boolean;
}

export interface MediaImageState {
  imgWidth: number;
  imgHeight: number;
  parentWidth: number;
  parentHeight: number;
}

export class MediaImage extends Component<MediaImageProps, MediaImageState> {
  static defaultProps = {
    crop: true,
    width: '100%',
    height: '100%',
    className: '',
  };
  imageRef: React.RefObject<any>; // TODO any!!!!

  constructor(props: MediaImageProps) {
    super(props);
    this.imageRef = React.createRef();

    this.state = {
      imgWidth: 0,
      imgHeight: 0,
      parentWidth: Infinity,
      parentHeight: Infinity,
    };
  }

  // TODO FIL-4060 we need to check whether the dataURI changes in componentWillReceiveProps()
  // and if it does recalculate the image height and width

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

  onImageLoad = () => {
    if (!this.imageRef) {
      return;
    }
    this.setState({
      imgWidth: this.imageRef.current.naturalWidth,
      imgHeight: this.imageRef.current.naturalHeight,
    });
  };

  render() {
    const { crop, dataURI } = this.props;
    const { parentWidth, parentHeight, imgWidth, imgHeight } = this.state;

    const parentRatio = parentWidth / parentHeight;
    const imgRatio = imgWidth / imgHeight;

    const StyledComponent = crop
      ? parentRatio > imgRatio
        ? CoverVerticalImageComponent
        : CoverHorizontalImageComponent
      : FitImageComponent;

    return (
      <StyledComponent
        onLoad={this.onImageLoad}
        innerRef={this.imageRef}
        src={dataURI}
      />
    );
  }
}
