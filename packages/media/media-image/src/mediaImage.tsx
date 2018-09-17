import * as React from 'react';
import { Component, ReactNode } from 'react';
import { Context } from '@atlaskit/media-core';
import { Subscription } from 'rxjs/Subscription';

export type MediaApiConfig = {
  clientId: string;
  token: string;
  baseUrl: string;
};

export interface MediaImageProps {
  id: string;
  context: Context;
  className?: string;
  width?: number;
  height?: number;
  collectionName?: string;
  placeholder?: ReactNode;
}

export interface MediaImageState {
  isLoading: boolean;
  src?: string;
}

export class MediaImage extends Component<MediaImageProps, MediaImageState> {
  subscription?: Subscription;
  state: MediaImageState = {
    isLoading: true,
  };

  componentDidMount() {
    this.subscribe(this.props);
  }

  componentWillReceiveProps(newProps: MediaImageProps) {
    const { id, collectionName } = this.props;

    if (newProps.id !== id || newProps.collectionName !== collectionName) {
      this.subscribe(newProps);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.releaseSrc();
  }

  private releaseSrc = () => {
    const { src } = this.state;
    if (src) {
      URL.revokeObjectURL(src);
    }
  };

  private subscribe(props: MediaImageProps) {
    const { context, width, height, id, collectionName } = props;

    this.unsubscribe();
    this.setState({
      isLoading: true,
    });

    this.subscription = context.getFile(id, { collectionName }).subscribe({
      next: async state => {
        if (state.status === 'processed') {
          this.unsubscribe();

          const blob = await context.getImage(id, {
            collection: collectionName,
            height,
            width,
          });
          const src = URL.createObjectURL(blob);
          this.releaseSrc();

          this.setState({
            isLoading: false,
            src,
          });
        }
      },
    });
  }

  private unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private get style() {
    const { width, height } = this.props;

    return {
      width: `${width}px`,
      height: `${height}px`,
    };
  }

  private get placeholder() {
    return this.props.placeholder || null;
  }

  render() {
    const { style } = this;
    const { isLoading, src } = this.state;
    const { className } = this.props;

    if (isLoading) {
      return this.placeholder;
    }

    return <img src={src} style={style} className={className} />;
  }
}

export default MediaImage;
