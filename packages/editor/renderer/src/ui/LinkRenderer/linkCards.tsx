import * as React from 'react';
import { Component } from 'react';
import {
  CardAppearance,
  CardDimensions,
  Card,
  CardView,
  Identifier,
} from '@atlaskit/media-card';
import { Context, ContextFactory } from '@atlaskit/media-core';
import { MediaGroup } from '../../react/nodes';

export interface Link {
  type: string;
  attrs: {
    href: string;
  };
}

export interface Props {
  links: Link[];
  mediaProvider: Promise<any>;
}

export interface State {
  context?: Context;
}

export const SINGLE_LINK_WIDTH = 350;
export const SINGLE_LINK_HEIGHT = 300;

export default class LinkCards extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
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

  private renderCards() {
    const { links } = this.props;
    const appearance = links.length === 1 ? 'square' : 'horizontal';
    const dimensions =
      links.length === 1
        ? { width: SINGLE_LINK_WIDTH, height: SINGLE_LINK_HEIGHT }
        : undefined;
    return links.map(link => this.renderCard(link, appearance, dimensions));
  }

  private renderCard = (
    link: Link,
    appearance?: CardAppearance,
    dimensions?: CardDimensions,
  ) => {
    const { context } = this.state;
    // const {
    //   eventHandlers,
    //   id,
    //   type,
    //   collection,
    //   cardDimensions,
    //   resizeMode,
    //   appearance,
    // } = this.props;

    const { attrs: { href } } = link;

    if (!context) {
      return (
        <CardView
          key={href}
          status="loading"
          appearance={appearance}
          dimensions={dimensions}
        />
      );
    }

    const identifier: Identifier = {
      mediaItemType: 'link',
      url: href,
    };

    return (
      <Card
        key={href}
        identifier={identifier}
        context={context}
        appearance={appearance}
        dimensions={dimensions}
        // dimensions={cardDimensions}
        // onClick={
        //   eventHandlers && eventHandlers.media && eventHandlers.media.onClick
        // }
        // resizeMode={resizeMode}
        // appearance={appearance}
      />
    );
  };

  render() {
    return <MediaGroup>{this.renderCards()}</MediaGroup>;
  }
}
