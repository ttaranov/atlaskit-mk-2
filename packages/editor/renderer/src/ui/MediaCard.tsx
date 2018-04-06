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
import { MediaType } from '@atlaskit/editor-common';

export interface MediaProvider {
  viewContext?: Context;
}

export interface MediaCardProps {
  id: string;
  mediaProvider?: MediaProvider;
  eventHandlers?: {
    media?: {
      onClick?: CardOnClickCallback;
    };
  };
  type: MediaType;
  collection: string;
  cardDimensions?: CardDimensions;
  resizeMode?: ImageResizeMode;
  appearance?: CardAppearance;
  occurrenceKey?: string;
}

export interface State {
  context?: Context;
}

export class MediaCard extends Component<MediaCardProps, State> {
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
