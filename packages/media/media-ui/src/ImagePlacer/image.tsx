import * as React from 'react';

import { ImageWrapper } from './styled';
import { isImageRemote } from '../../src/util';

type ReactEvent = React.SyntheticEvent<{}>;
const isStr = (value: any): boolean => typeof value === 'string';

export interface ImageProps {
  src?: string;
  orientation: number; //todo:remove
  x: number;
  y: number;
  width: number;
  height: number;
  onLoad: (
    imageElement: HTMLImageElement,
    width: number,
    height: number,
  ) => void;
  onError: (e: ReactEvent) => void;
}

export interface ImageState {}

export class Image extends React.Component<ImageProps, ImageState> {
  constructor(props: ImageProps) {
    super(props);
    if (isStr(props.src)) {
      try {
        isImageRemote(props.src as string);
      } catch (e) {
        props.onError && props.onError(e);
      }
    }
  }

  onLoad = (e: ReactEvent) => {
    const image = e.target as HTMLImageElement;
    const { naturalWidth: width, naturalHeight: height } = image;
    this.props.onLoad(image, width, height);
  };

  onError = (e: ReactEvent) => {
    this.props.onError(e);
  };
  render() {
    const { src, x, y, width, height } = this.props;

    if (src) {
      const crossOrigin = isImageRemote(src) ? 'anonymous' : undefined;
      return (
        <ImageWrapper
          src={src}
          x={x}
          y={y}
          crossOrigin={crossOrigin}
          width={width}
          height={height}
          onLoad={this.onLoad}
          onError={this.onError}
          draggable={false}
        />
      );
    }

    return null;
  }
}
