import * as React from 'react';
import { Component } from 'react';

export type MediaApiConfig = {
  clientId: string;
  token: string;
  serviceHost: string;
};

export interface MediaImageProps {
  id: string;
  mediaApiConfig: MediaApiConfig;
  className?: string;
  width?: number;
  height?: number;
  collectionName?: string;
  onError?: (imgElem: HTMLImageElement) => void;
}

export interface MediaImageState {}

export class MediaImage extends Component<MediaImageProps, MediaImageState> {
  private get imgSrc(): string {
    const { id, mediaApiConfig, collectionName } = this.props;
    const { clientId, token, serviceHost } = mediaApiConfig;
    const endpoint = `file/${id}/image`;

    return `${serviceHost}/${endpoint}?collection=${collectionName}&client=${clientId}&token=${token}`;
  }

  private get hasAuth(): boolean {
    const { clientId, token, serviceHost } = this.props.mediaApiConfig;

    return !!clientId && !!token && !!serviceHost;
  }

  private get style() {
    const { width, height } = this.props;

    return {
      width: `${width}px`,
      height: `${height}px`,
    };
  }

  private onError(imgElem) {
    const { onError } = this.props;

    !!onError && onError(imgElem);
  }

  render() {
    const { hasAuth, style, imgSrc, onError } = this;
    if (!hasAuth) {
      return null;
    }

    const { className } = this.props;

    return (
      <img
        src={imgSrc}
        style={style}
        className={className}
        onerror={onError(this)}
      />
    );
  }
}

export default MediaImage;
