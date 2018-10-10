import * as React from 'react';
import { Component, ReactNode } from 'react';
import { Context } from '@atlaskit/media-core';
import { Subscription } from 'rxjs/Subscription';

export interface MediaImageProps {
  readonly id: string;
  readonly context: Context;
  readonly className?: string;
  readonly width?: number;
  readonly height?: number;
  readonly collectionName?: string;
  readonly loadingPlaceholder?: ReactNode;
  readonly errorPlaceholder?: ReactNode;
  readonly mode?: 'fit' | 'full-fit' | 'crop';
  readonly upscale?: boolean;
}

export interface MediaImageState {
  status: 'loading' | 'error' | 'succeeded';
  src?: string;
}

export class MediaImage extends Component<MediaImageProps, MediaImageState> {
  subscription?: Subscription;
  state: MediaImageState = {
    status: 'loading',
  };

  componentDidMount() {
    this.subscribe(this.props);
  }

  componentWillReceiveProps(newProps: MediaImageProps) {
    const { id, collectionName, width, height } = this.props;
    const isWidthBigger =
      newProps.width && width ? newProps.width > width : false;
    const isHeightBigger =
      newProps.height && height ? newProps.height > height : false;
    const isNewDimensionsBigger = isWidthBigger || isHeightBigger;

    if (
      newProps.id !== id ||
      newProps.collectionName !== collectionName ||
      isNewDimensionsBigger
    ) {
      this.subscribe(newProps);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.releaseSrc();
  }

  private setError = () => this.setState({ status: 'error' });

  private releaseSrc = () => {
    const { src } = this.state;
    if (src) {
      URL.revokeObjectURL(src);
    }
  };

  private subscribe(props: MediaImageProps) {
    const { context, width, height, id, collectionName, mode, upscale } = props;

    this.unsubscribe();
    this.setState({
      status: 'loading',
    });

    this.subscription = context.getFile(id, { collectionName }).subscribe({
      next: async state => {
        if (state.status === 'processed') {
          this.unsubscribe();
          const { mediaType } = state;

          if (mediaType === 'image') {
            const blob = await context.getImage(id, {
              collection: collectionName,
              height,
              width,
              mode,
              upscale,
            });
            const src = URL.createObjectURL(blob);
            this.releaseSrc();

            this.setState({
              status: 'succeeded',
              src,
            });
          } else {
            this.setError();
          }
        } else if (state.status === 'error') {
          this.setError();
        }
      },
      error: this.setError,
    });
  }

  private unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  render() {
    const { status, src } = this.state;
    const { errorPlaceholder, loadingPlaceholder, className } = this.props;

    switch (status) {
      case 'error':
        return errorPlaceholder || null;
      case 'loading':
        return loadingPlaceholder || null;
      case 'succeeded':
        return <img src={src} className={className} />;
    }
  }
}

export default MediaImage;
