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
  FileState,
  FileDetails,
  MediaType,
  LinkDetails,
  UrlPreview,
} from '@atlaskit/media-core';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import { Subscription } from 'rxjs';
import {
  SharedCardProps,
  CardEventProps,
  CardAnalyticsContext,
  CardStatus,
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

const extendMetadata = (
  state: FileState,
  metadata?: FileDetails,
): FileDetails => {
  const { id } = state;
  const currentMediaType = metadata && metadata.mediaType;
  let name: string | undefined,
    size: number | undefined,
    mediaType: MediaType | undefined;

  if (state.status !== 'error') {
    name = state.name;
    size = state.size;
    mediaType =
      currentMediaType && currentMediaType !== 'unknown'
        ? currentMediaType
        : state.mediaType;
  }

  return {
    id,
    name,
    size,
    mediaType,
  };
};

const isPreviewableType = (type: MediaType): boolean => {
  return ['audio', 'video', 'image'].indexOf(type) > -1;
};

const isUrlPreviewIdentifier = (
  identifier: Identifier,
): identifier is UrlPreviewIdentifier => {
  const preview = identifier as UrlPreviewIdentifier;
  return preview && preview.url !== undefined;
};

const getLinkMetadata = (
  identifier: LinkIdentifier | UrlPreviewIdentifier,
  context: Context,
): Promise<LinkDetails | UrlPreview> => {
  return new Promise((resolve, reject) => {
    if (isUrlPreviewIdentifier(identifier)) {
      const observable = context
        .getUrlPreviewProvider(identifier.url)
        .observable();

      observable.subscribe({
        next: resolve,
        error: reject,
      });
    } else {
      const { id, mediaItemType, collectionName } = identifier;
      const observable = context
        .getMediaItemProvider(id, mediaItemType, collectionName)
        .observable();

      observable.subscribe({
        next(item) {
          if (item.type === 'file') {
            reject();
          } else {
            resolve(item.details);
          }
        },
        error: reject,
      });
    }
  });
};

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

  async subscribe(identifier: Identifier) {
    const { context } = this.props;

    if (identifier.mediaItemType !== 'file') {
      try {
        const metadata = await getLinkMetadata(identifier, context);

        this.notifyStateChange({
          status: 'complete',
          metadata: metadata,
        });
      } catch (error) {
        this.notifyStateChange({
          error,
          status: 'error',
        });
      }

      return;
    }

    const { id, collectionName } = identifier;
    this.unsubscribe();
    this.subscription = context.getFile(id, { collectionName }).subscribe({
      next: async state => {
        const {
          dataURI: currentDataURI,
          metadata: currentMetadata,
        } = this.state;
        const metadata = extendMetadata(state, currentMetadata as FileDetails);

        if (!currentDataURI) {
          const dataURI = await getDataURIFromFileState(state);
          this.notifyStateChange({ dataURI });
        }

        switch (state.status) {
          case 'uploading':
            const { progress } = state;
            this.notifyStateChange({
              status: 'uploading',
              progress,
              metadata,
            });
            break;
          case 'processing':
            this.notifyStateChange({
              progress: 1,
              status: 'complete',
              metadata,
            });
            break;
          case 'processed':
            if (metadata.mediaType && isPreviewableType(metadata.mediaType)) {
              const { appearance, dimensions } = this.props;
              const options = {
                appearance,
                dimensions,
                component: this,
              };
              const width = getDataURIDimension('width', options);
              const height = getDataURIDimension('height', options);
              try {
                const blob = await context.mediaStore.getImage(state.id, {
                  collection: collectionName,
                  height,
                  width,
                });
                const dataURI = URL.createObjectURL(blob);
                this.releaseDataURI();
                this.setState({ dataURI });
              } catch (e) {
                // We don't want to set status=error if the preview fails, we still want to display the metadata
              }
            }
            this.notifyStateChange({ status: 'complete', metadata });
            break;
          case 'error':
            this.notifyStateChange({ status: 'error' });
        }
      },
      error: error => {
        this.notifyStateChange({ error, status: 'error' });
      },
    });
  }

  notifyStateChange = (state: Partial<CardState>) => {
    this.setState(state as any, this.onLoadingChangeCallback);
  };

  unsubscribe = () => {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  };

  // This method is called when card fails and user press 'Retry'
  private onRetry = () => {
    const { identifier } = this.props;

    this.subscribe(identifier);
  };

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
    const id = isUrlPreviewIdentifier(identifier)
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
    const { mediaItemType, placeholder, analyticsContext, onRetry } = this;
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
          onRetry={onRetry}
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
