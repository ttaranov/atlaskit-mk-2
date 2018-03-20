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

import {
  SharedCardProps,
  CardEventProps,
  OnLoadingChangeState,
  CardStatus,
} from '..';
import { Provider } from './card';
import { CardView } from './cardView';
import { withDataURI } from './withDataURI';

const CardViewWithDataURI = withDataURI(CardView); // tslint:disable-line:variable-name

export interface MediaCardProps extends SharedCardProps, CardEventProps {
  readonly provider: Provider;
  readonly mediaItemType?: MediaItemType;
  readonly dataURIService?: DataUriService;
  readonly resizeMode?: ImageResizeMode;
  readonly preview?: string;
}

export interface MediaCardState {
  readonly subscription?: Subscription;
  readonly status: CardStatus;

  // can NOT use MediaItemDetails because get the following error: https://github.com/Microsoft/TypeScript/issues/9944
  readonly metadata?: FileDetails | LinkDetails | UrlPreview;
  readonly error?: Error;
}

export class MediaCard extends Component<MediaCardProps, MediaCardState> {
  state: MediaCardState = {
    status: this.props.preview ? 'complete' : 'loading',
  };

  componentDidMount(): void {
    this.updateState(this.props);
  }

  componentWillReceiveProps(nextProps: MediaCardProps): void {
    if (this.shouldUpdateState(nextProps)) {
      this.updateState(nextProps);
    }
  }

  componentWillUnmount(): void {
    this.unsubscribe();
  }

  private shouldUpdateState(nextProps: MediaCardProps): boolean {
    return nextProps.provider !== this.props.provider;
  }

  private isMediaItem(
    mediaItem: MediaItem | UrlPreview,
  ): mediaItem is FileItem {
    return mediaItem && (mediaItem as MediaItem).details !== undefined;
  }

  observable = (
    props: MediaCardProps,
  ): Observable<FileDetails | LinkDetails | UrlPreview> => {
    const { provider } = props;
    return provider.observable().map((result: MediaItem | UrlPreview) => {
      if (this.isMediaItem(result)) {
        return result.details;
      } else {
        return result as UrlPreview;
      }
    });
  };

  private stateToCardProcessingStatus(): OnLoadingChangeState {
    const { status, error, metadata } = this.state;
    return {
      type: status,
      payload: error || metadata,
    };
  }

  private updateState(props: MediaCardProps): void {
    const {
      onLoadingChange = () => {
        /* do nothing */
      },
      preview,
    } = this.props;
    this.unsubscribe();
    const status = preview ? 'complete' : 'loading';

    this.setPartialState({ status }, () =>
      this.setPartialState(
        {
          subscription: this.observable(props).subscribe({
            next: metadata => {
              this.setPartialState(
                { metadata, error: undefined, status: 'processing' },
                () => onLoadingChange(this.stateToCardProcessingStatus()),
              );
            },

            complete: () => {
              this.setPartialState(
                { error: undefined, status: 'complete' },
                () => onLoadingChange(this.stateToCardProcessingStatus()),
              );
            },

            error: error => {
              this.setPartialState({ error, status: 'error' }, () =>
                onLoadingChange(this.stateToCardProcessingStatus()),
              );
            },
          }),
        },
        () => onLoadingChange(this.stateToCardProcessingStatus()),
      ),
    );
  }

  private setPartialState(
    partialState: Partial<MediaCardState>,
    callback?: () => any,
  ) {
    this.setState((previousState, props) => {
      return { ...previousState, ...partialState };
    }, callback);
  }

  private unsubscribe(): void {
    if (this.state && this.state.subscription) {
      this.state.subscription.unsubscribe();
    }
  }

  // This method is called when card fails and user press 'Retry'
  private onRetry = () => {
    this.updateState(this.props);
  };

  render() {
    const {
      mediaItemType,
      provider,
      dataURIService,
      onLoadingChange,
      resizeMode,
      preview,
      ...otherProps
    } = this.props;
    const { metadata, status } = this.state;

    return (
      <CardViewWithDataURI
        {...otherProps}
        resizeMode={resizeMode}
        dataURIService={dataURIService}
        status={status}
        preview={preview}
        metadata={metadata}
        mediaItemType={mediaItemType}
        onRetry={this.onRetry}
      />
    );
  }
}
