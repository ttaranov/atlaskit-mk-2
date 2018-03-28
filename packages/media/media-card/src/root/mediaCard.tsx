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
  subscription?: Subscription;

  state: MediaCardState = {
    status: 'loading',
  };

  componentWillMount(): void {
    this.updateState(this.props);
  }

  componentWillReceiveProps(nextProps: MediaCardProps, nextContext: any): void {
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

  private updateState(props: MediaCardProps): void {
    this.unsubscribe();

    this.setState({ status: 'loading' }, () => {
      this.subscription = this.observable(props).subscribe({
        next: metadata => {
          this.setState({ metadata, error: undefined, status: 'processing' });
        },
        complete: () => {
          this.setState({ error: undefined, status: 'complete' });
        },
        error: error => {
          this.setState({ error, status: 'error' });
        },
      });
    });
  }

  private unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
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
      onClick,
      onMouseEnter,
      onSelectChange,
      appearance,
      dimensions,
      actions,
      selectable,
      selected,
    } = this.props;
    const { metadata, status } = this.state;

    return (
      <CardViewWithDataURI
        dataURIService={dataURIService}
        status={status}
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
      />
    );
  }
}
