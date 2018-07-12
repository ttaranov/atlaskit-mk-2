import * as React from 'react';
import { Component } from 'react';
import * as deepEqual from 'deep-equal';
import {
  Context,
  MediaItemType,
  MediaItemProvider,
  UrlPreviewProvider,
  ImageResizeMode,
  MediaItemDetails,
} from '@atlaskit/media-core';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import { Subscription } from 'rxjs';
import {
  SharedCardProps,
  CardEventProps,
  CardAnalyticsContext,
  CardStatus,
  OnLoadingChangeState,
} from '../..';
import { CardView } from '../cardView';
import { LazyContent } from '../../utils/lazyContent';
import { getBaseAnalyticsContext } from '../../utils/analyticsUtils';
import { getDataURIDimension } from '../../utils/getDataURIDimension';
import { getDataURIFromFileState } from '../../utils/getDataURIFromFileState';

export type Identifier = UrlPreviewIdentifier | LinkIdentifier | FileIdentifier;
export type Provider = MediaItemProvider | UrlPreviewProvider;

export interface FileIdentifier {
  readonly mediaItemType: 'file';
  readonly id: string;
  readonly occurrenceKey?: string;
  readonly collectionName?: string; // files can exist outside of a collection
}

export interface LinkIdentifier {
  readonly mediaItemType: 'link';
  readonly id: string;
  readonly occurrenceKey?: string;
  readonly collectionName: string; // links always exist within a collection
}

export interface UrlPreviewIdentifier {
  readonly mediaItemType: 'link';
  readonly url: string;
}

export interface CardProps extends SharedCardProps, CardEventProps {
  readonly context: Context;
  readonly identifier: Identifier;
  readonly isLazy?: boolean;
  readonly resizeMode?: ImageResizeMode;

  // only relevant to file card with image appearance
  readonly disableOverlay?: boolean;
}

export interface CardState {
  status: CardStatus;
  metadata?: MediaItemDetails;
  dataURI?: string;
  progress?: number;
  readonly error?: Error;
}

export class Card extends Component<CardProps, CardState> {
  subscription?: Subscription;
  static defaultProps: Partial<CardProps> = {
    appearance: 'auto',
    resizeMode: 'crop',
    isLazy: true,
    disableOverlay: false,
  };

  state: CardState = {
    status: 'loading',
  };

  componentDidMount() {
    const { identifier } = this.props;

    this.subscribe(identifier);
  }

  componentWillReceiveProps(nextProps: CardProps) {
    const {
      context: currentContext,
      identifier: currentIdentifier,
    } = this.props;
    const { context: nextContext, identifier: nextIdenfifier } = nextProps;

    if (
      currentContext !== nextContext ||
      !deepEqual(currentIdentifier, nextIdenfifier)
    ) {
      this.subscribe(nextIdenfifier);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.releaseDataURI();
  }

  releaseDataURI = () => {
    const { dataURI } = this.state;
    if (dataURI) {
      URL.revokeObjectURL(dataURI);
    }
  };

  private onLoadingChangeCallback = () => {
    const { onLoadingChange } = this.props;
    if (onLoadingChange) {
      const { status, error, metadata } = this.state;
      const state = {
        type: status,
        payload: error || metadata,
      };
      onLoadingChange(state);
    }
  };

  subscribe(identifier: Identifier) {
    if (identifier.mediaItemType !== 'file') {
      return;
    }
    const { onLoadingChangeCallback } = this;
    const { context } = this.props;
    const { id, collectionName } = identifier;

    this.unsubscribe();
    this.subscription = context.getFile(id, { collectionName }).subscribe({
      next: async state => {
        const { dataURI: currentDataURI } = this.state;

        if (!currentDataURI) {
          const dataURI = await getDataURIFromFileState(state);

          this.setState({ dataURI }, onLoadingChangeCallback);
        }

        if (state.status === 'uploading') {
          const { progress, id, name, size, mediaType } = state;
          this.setState(
            {
              status: 'uploading',
              progress,
              metadata: {
                id,
                name,
                size,
                mediaType,
              },
            },
            onLoadingChangeCallback,
          );
        }

        if (state.status === 'processing') {
          // TODO: should we set "metadata" here too? It might be possible that the first time you ask for and id is already 'processing'
          this.setState(
            {
              progress: 1,
              status: 'complete',
            },
            onLoadingChangeCallback,
          );
        }

        if (state.status === 'processed') {
          const { id, name, size, mediaType } = state;
          const options = {
            appearance: this.props.appearance,
            dimensions: this.props.dimensions,
            component: this,
          };
          const width = getDataURIDimension('width', options);
          const height = getDataURIDimension('height', options);
          const blob = await context.mediaStore.getImage(state.id, {
            collection: collectionName,
            height,
            width,
          });
          const dataURI = URL.createObjectURL(blob);

          this.setState(
            {
              dataURI,
              status: 'complete',
              metadata: {
                id,
                name,
                size,
                mediaType,
              },
            },
            onLoadingChangeCallback,
          );
        }
      },
      error: error => {
        this.setState(
          {
            error,
            status: 'error',
          },
          onLoadingChangeCallback,
        );
      },
    });
  }

  unsubscribe = () => {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  };

  private isUrlPreviewIdentifier(
    identifier: Identifier,
  ): identifier is UrlPreviewIdentifier {
    const preview = identifier as UrlPreviewIdentifier;
    return preview && preview.url !== undefined;
  }

  get placeholder(): JSX.Element {
    const { appearance, dimensions } = this.props;

    return (
      <CardView
        status="loading"
        appearance={appearance}
        dimensions={dimensions}
        mediaItemType={this.mediaItemType}
      />
    );
  }

  get analyticsContext(): CardAnalyticsContext {
    const { identifier } = this.props;
    const id = this.isUrlPreviewIdentifier(identifier)
      ? identifier.url
      : identifier.id;
    return getBaseAnalyticsContext('Card', id);
  }

  render() {
    const {
      isLazy,
      appearance,
      resizeMode,
      dimensions,
      actions,
      selectable,
      selected,
      onClick,
      onMouseEnter,
      onSelectChange,
      disableOverlay,
    } = this.props;
    const { status, progress, metadata, dataURI } = this.state;
    const { mediaItemType, placeholder, analyticsContext } = this;
    const card = (
      <AnalyticsContext data={analyticsContext}>
        <CardView
          status={status}
          metadata={metadata}
          dataURI={dataURI}
          mediaItemType={mediaItemType}
          appearance={appearance}
          resizeMode={resizeMode}
          dimensions={dimensions}
          actions={actions}
          selectable={selectable}
          selected={selected}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onSelectChange={onSelectChange}
          disableOverlay={disableOverlay}
          progress={progress}
        />
      </AnalyticsContext>
    );

    return isLazy ? (
      <LazyContent placeholder={placeholder}>{card}</LazyContent>
    ) : (
      card
    );
  }

  private get mediaItemType(): MediaItemType {
    const { mediaItemType } = this.props.identifier;

    return mediaItemType;
  }
}
