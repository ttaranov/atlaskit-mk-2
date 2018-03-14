import * as React from 'react';
import { Component } from 'react';
import {
  CardAppearance,
  CardDimensions,
  Card,
  CardView,
} from '@atlaskit/media-card';
import {
  Context,
  ContextConfig,
  ContextFactory,
  ImageResizeMode,
} from '@atlaskit/media-core';
import { EventHandlers, MediaType } from '@atlaskit/editor-common';

export interface MediaProvider {
  viewContext?: ContextConfig;
}

export interface MediaCardProps {
  id: string;
  mediaProvider?: MediaProvider;
  eventHandlers?: EventHandlers;
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
  constructor(props) {
    super(props);
    this.state = {
      context: undefined,
    };
  }

  async componentDidMount() {
    const { mediaProvider } = this.props;
    if (!mediaProvider) {
      return;
    }

    const provider = await mediaProvider;
    const viewContext = await provider.viewContext;

    let context;

    if ('serviceHost' in viewContext!) {
      context = ContextFactory.create(viewContext!);
    }

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
