import * as React from 'react';
import { Component } from 'react';
import { Observable, Subscription } from 'rxjs';
import {
  MediaItemType,
  MediaItem,
  FileItem,
  FileDetails,
  LinkDetails,
  UrlPreview,
  DataUriService,
  ImageResizeMode,
} from '@atlaskit/media-core';

import { SharedCardProps, CardEventProps, CardStatus } from '..';
import { Provider } from './card';
import { CardView } from './cardView';
import { withDataURI } from './withDataURI';

const CardViewWithDataURI = withDataURI(CardView); // tslint:disable-line:variable-name

export interface MediaCardProps extends SharedCardProps, CardEventProps {
  readonly provider: Provider;
  readonly mediaItemType?: MediaItemType;
  readonly dataURIService?: DataUriService;
  readonly resizeMode?: ImageResizeMode;
}

export interface MediaCardState {
  readonly status: CardStatus;

  // can NOT use MediaItemDetails because get the following error: https://github.com/Microsoft/TypeScript/issues/9944
  readonly metadata?: FileDetails | LinkDetails | UrlPreview;
  readonly error?: Error;
}

export class MediaCard extends Component<MediaCardProps, MediaCardState> {
  state: MediaCardState = {
    status: 'loading',
  };

  private subscription?: Subscription;

  private isMediaItem(
    mediaItem: MediaItem | UrlPreview,
  ): mediaItem is FileItem {
    return mediaItem && (mediaItem as MediaItem).details !== undefined;
  }

  private observable(): Observable<FileDetails | LinkDetails | UrlPreview> {
    const { provider } = this.props;
    return provider.observable().map((result: MediaItem | UrlPreview) => {
      if (this.isMediaItem(result)) {
        return result.details;
      } else {
        return result as UrlPreview;
      }
    });
  }

  private callStatusChangeCallback() {
    const { onLoadingChange } = this.props;
    if (onLoadingChange) {
      const { status, error, metadata } = this.state;
      onLoadingChange({
        type: status,
        payload: error || metadata,
      });
    }
  }

  private subscribe(): void {
    this.unsubscribe();

    // left this here for backwards compatibility, but since the state is already loading from the start, maybe we shouldn't do it in componentDidMount
    this.callStatusChangeCallback();

    this.subscription = this.observable().subscribe({
      next: metadata => {
        this.setState(
          { metadata, error: undefined, status: 'processing' },
          () => this.callStatusChangeCallback(),
        );
      },

      complete: () => {
        this.setState({ error: undefined, status: 'complete' }, () =>
          this.callStatusChangeCallback(),
        );
      },

      error: error => {
        this.setState({ error, status: 'error' }, () =>
          this.callStatusChangeCallback(),
        );
      },
    });
  }

  private unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // This method is called when card fails and user press 'Retry'
  private handleRetry = () => {
    this.subscribe();
  };

  componentDidMount(): void {
    this.subscribe();
  }

  componentWillReceiveProps(nextProps: MediaCardProps): void {
    if (nextProps.provider !== this.props.provider) {
      this.setState({ status: 'loading' });
    }
  }

  componentDidUpdate(prevProps: MediaCardProps) {
    if (prevProps.provider !== this.props.provider) {
      this.subscribe();
    }
  }

  componentWillUnmount(): void {
    this.unsubscribe();
  }

  render() {
    const {
      mediaItemType,
      provider,
      dataURIService,
      onLoadingChange,
      resizeMode,
      ...otherProps
    } = this.props;
    const { metadata, status } = this.state;
    return (
      <CardViewWithDataURI
        {...otherProps}
        resizeMode={resizeMode}
        dataURIService={dataURIService}
        status={status}
        metadata={metadata}
        mediaItemType={mediaItemType}
        onRetry={this.handleRetry}
      />
    );
  }
}
