import * as React from 'react';
import { Component } from 'react';
import {
  CardAppearance,
  CardDimensions,
  Card,
  CardView,
  CardOnClickCallback,
} from '@atlaskit/media-card';
import { Context, ImageResizeMode } from '@atlaskit/media-core';
import {
  MediaType,
  withImageLoader,
  ImageStatus,
  // @ts-ignore
  ImageLoaderProps,
  // @ts-ignore
  ImageLoaderState,
} from '@atlaskit/editor-common';

export interface MediaProvider {
  viewContext?: Context;
}

export interface MediaCardProps {
  id?: string;
  mediaProvider?: MediaProvider;
  eventHandlers?: {
    media?: {
      onClick?: CardOnClickCallback;
    };
  };
  type: MediaType;
  collection?: string;
  url?: string;
  cardDimensions?: CardDimensions;
  resizeMode?: ImageResizeMode;
  appearance?: CardAppearance;
  occurrenceKey?: string;
  imageStatus?: ImageStatus;
  disableOverlay?: boolean;
}

export interface State {
  context?: Context;
  // externalStatus: CardStatus;
}

export class MediaCardInternal extends Component<MediaCardProps, State> {
  state: State = {};

  async componentDidMount() {
    const { mediaProvider } = this.props;

    if (!mediaProvider) {
      return;
    }

    const provider = await mediaProvider;
    const context = await provider.viewContext;

    this.setState({
      context,
    });
  }

  private renderExternal() {
    const {
      cardDimensions,
      resizeMode,
      appearance,
      url,
      imageStatus,
      disableOverlay,
    } = this.props;

    return (
      <CardView
        status={imageStatus || 'loading'}
        dataURI={url}
        dimensions={cardDimensions}
        metadata={
          {
            mediaType: 'image',
            name: url,
          } as any
        }
        appearance={appearance}
        resizeMode={resizeMode}
        disableOverlay={disableOverlay}
      />
    );
  }

  render() {
    const { context } = this.state;
    const {
      eventHandlers,
      id,
      type,
      collection,
      cardDimensions,
      resizeMode,
      appearance,
      disableOverlay,
    } = this.props;

    if (type === 'external') {
      return this.renderExternal();
    }

    if (!context) {
      return (
        <CardView
          status="loading"
          mediaItemType={type}
          dimensions={cardDimensions}
        />
      );
    }

    let identifier: any = {
      id,
      mediaItemType: type,
      collectionName: collection,
    };

    return (
      <Card
        identifier={identifier}
        context={context}
        dimensions={cardDimensions}
        onClick={
          eventHandlers && eventHandlers.media && eventHandlers.media.onClick
        }
        resizeMode={resizeMode}
        appearance={appearance}
        disableOverlay={disableOverlay}
      />
    );
  }
}

export const MediaCard = withImageLoader<MediaCardProps>(MediaCardInternal);
