import * as React from 'react';
import { Component } from 'react';
import {
  CardAppearance,
  CardDimensions,
  Card,
  CardView,
  CardOnClickCallback,
  CardStatus,
} from '@atlaskit/media-card';
import { Context, ImageResizeMode } from '@atlaskit/media-core';
import { MediaType } from '@atlaskit/editor-common';

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
  type: MediaType | 'external';
  collection?: string;
  url?: string;
  cardDimensions?: CardDimensions;
  resizeMode?: ImageResizeMode;
  appearance?: CardAppearance;
  occurrenceKey?: string;
  onExternalImageLoaded?: (
    dimensions: { width: number; height: number },
  ) => void;
}

export interface State {
  context?: Context;
  externalStatus: CardStatus;
}

export class MediaCard extends Component<MediaCardProps, State> {
  state: State = {
    externalStatus: 'loading',
  };

  async componentDidMount() {
    this.fetchExternalImage(this.props);

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

  componentWillReceiveProps(nextProps: MediaCardProps) {
    if (nextProps.url !== this.props.url) {
      this.setState({
        externalStatus: 'loading',
      });

      this.fetchExternalImage(nextProps);
    }
  }

  private fetchExternalImage(props: MediaCardProps) {
    const { type, url, onExternalImageLoaded } = props;

    if (type !== 'external') {
      return;
    }

    const img = new Image();
    img.src = url!;
    img.onload = () => {
      this.setState({
        externalStatus: 'complete',
      });
      if (onExternalImageLoaded) {
        onExternalImageLoaded({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      }
    };
    img.onerror = () => {
      this.setState({
        externalStatus: 'error',
      });
    };
  }

  private renderExternal() {
    const { externalStatus } = this.state;
    const { cardDimensions, resizeMode, appearance, url } = this.props;

    return (
      <CardView
        status={externalStatus}
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
      />
    );
  }
}
