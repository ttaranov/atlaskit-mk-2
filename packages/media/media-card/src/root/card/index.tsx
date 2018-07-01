import VideoSnapshot from 'video-snapshot';
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
} from '@atlaskit/media-core';
import { MediaStore } from '@atlaskit/media-store';
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
}

// TODO: should this logic live in media-core to allow MediaViewer to benefit from it?
const getDataURIFromFileState = async (
  state: FileState,
): Promise<string | undefined> => {
  if (state.status === 'error' || !state.preview) {
    return undefined;
  }
  const type = state.preview.blob.type;
  const blob = state.preview.blob;

  if (type.indexOf('image/') === 0) {
    return URL.createObjectURL(blob);
  }

  if (type.indexOf('video/') === 0) {
    const snapshoter = new VideoSnapshot(blob);
    const src = await snapshoter.takeSnapshot();

    // TODO: revoke => snapshoter.end()
    return src;
  }
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
    // TODO: revokeObjectUrl
  }

  subscribe(identifier: Identifier) {
    if (identifier.mediaItemType !== 'file') {
      return;
    }
    const { context } = this.props;
    const { id, collectionName } = identifier;

    this.unsubscribe();
    this.subscription = context.getFile(id, { collectionName }).subscribe({
      next: async state => {
        const { dataURI: currentDataURI } = this.state;

        if (!currentDataURI) {
          const dataURI = await getDataURIFromFileState(state);
          // TODO: revoke
          this.setState({ dataURI });
        }
        if (state.status === 'uploading') {
          const { progress, id, name, size, mediaType } = state;
          this.setState({
            status: 'uploading',
            progress,
            metadata: {
              id,
              name,
              size,
              mediaType,
            },
          });
        }

        if (state.status === 'processing') {
          // TODO: should we set "metadata" here too? It might be possible that the first time you ask for and id is already 'processing'
          this.setState({
            progress: 1,
            status: 'complete',
          });
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

          this.setState({
            dataURI,
            status: 'complete',
            metadata: {
              id,
              name,
              size,
              mediaType,
            },
          });
        }
      },
      error: error => {
        this.setState({
          status: 'error',
        });
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
      onLoadingChange,
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
          onLoadingChange={onLoadingChange} // TODO: Implement here
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
