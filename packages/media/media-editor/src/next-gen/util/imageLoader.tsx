import * as React from 'react';

import { Size } from '../scene';

export interface ImageLoaderProps {
  url: string;
  onLoaded: (imageSize: Size) => void;
  onFailed: (error?: Error) => void;
}

export class ImageLoader extends React.Component<ImageLoaderProps, {}> {
  private imgElement?: HTMLImageElement;

  render() {
    const { url } = this.props;

    return (
      <img
        style={{ visibility: 'hidden' }}
        onLoad={this.onLoad.bind(this)}
        onError={this.onError.bind(this)}
        ref={this.onRef.bind(this)}
        src={url}
      />
    );
  }

  private onRef(element: HTMLImageElement) {
    this.imgElement = element;
  }

  private onLoad() {
    const { imgElement } = this;
    if (!imgElement) {
      this.props.onFailed(new Error('Could not load the image'));
      return;
    }

    const { width, height } = imgElement;
    this.props.onLoaded({ width, height });
  }

  private onError() {
    this.props.onFailed();
  }
}
