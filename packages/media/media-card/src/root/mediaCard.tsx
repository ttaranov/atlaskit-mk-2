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
  readonly disableOverlay?: boolean;
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

  private onLoadingChange(loadingChange: OnLoadingChangeState) {
    const {
      onLoadingChange = () => {
        /* do nothing */
      },
    } = this.props;
    onLoadingChange(loadingChange);
  }

  private updateState(props: MediaCardProps): void {
    this.unsubscribe();
    const onLoadingChangeCallback = () =>
      this.onLoadingChange(this.stateToCardProcessingStatus());
    const { preview } = this.props;
    const status = preview ? 'complete' : 'loading';
    this.setState({ status }, () =>
      this.setState(
        {
          subscription: this.observable(props).subscribe({
            next: metadata => {
              this.setState(
                { metadata, error: undefined, status: 'processing' },
                onLoadingChangeCallback,
              );
            },

            complete: () => {
              this.setState(
                { error: undefined, status: 'complete' },
                onLoadingChangeCallback,
              );
            },

            error: error => {
              this.setState(
                { error, status: 'error' },
                onLoadingChangeCallback,
              );
            },
          }),
        },
        onLoadingChangeCallback,
      ),
    );
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
      dataURIService,
      resizeMode,
      preview,
      onClick,
      onMouseEnter,
      onSelectChange,
      appearance,
      dimensions,
      actions,
      selectable,
      selected,
      disableOverlay,
    } = this.props;
    const { metadata, status } = this.state;

    return (
      <CardViewWithDataURI
        dataURIService={dataURIService}
        status={status}
        preview={preview}
        mediaItemType={mediaItemType}
        metadata={metadata}
        resizeMode={resizeMode}
        onRetry={this.onRetry}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onSelectChange={onSelectChange}
        appearance={appearance}
        dimensions={dimensions}
        actions={actions}
        selectable={selectable}
        selected={selected}
        disableOverlay={disableOverlay}
      />
    );
  }
}
