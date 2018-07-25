/* tslint:disable variable-name */
import * as React from 'react';
import { Component } from 'react';
import {
  Identifier,
  Card,
  UrlPreviewIdentifier,
  CardAction,
  CardOnClickCallback,
  CardEvent,
  OnSelectChangeFunc,
  OnLoadingChangeFunc,
} from '@atlaskit/media-card';
import { FilmstripView } from './filmstripView';
import { Context } from '@atlaskit/media-core';

export interface AllowedCardProps {
  readonly actions?: Array<CardAction>;
  readonly selectable?: boolean;
  readonly selected?: boolean;
  readonly onClick?: CardOnClickCallback;
  readonly onMouseEnter?: (result: CardEvent) => void;
  readonly onSelectChange?: OnSelectChangeFunc;
  readonly onLoadingChange?: OnLoadingChangeFunc;
}

export interface FilmstripProps {
  identifiers: Identifier[];
  context: Context;
  cardProps?: AllowedCardProps;
}

export interface FilmstripState {
  animate: boolean;
  offset: number;
}

export const isUrlPreviewIdentifier = (
  identifier: Identifier,
): identifier is UrlPreviewIdentifier => {
  const preview = identifier as UrlPreviewIdentifier;
  return preview && preview.url !== undefined;
};

// TODO: this has been duplicated from media-card => let's export it from there instead
const getIdentifierKey = (identifier: Identifier): string => {
  if (isUrlPreviewIdentifier(identifier)) {
    return identifier.url;
  } else {
    return identifier.id;
  }
};

export class Filmstrip extends Component<FilmstripProps, FilmstripState> {
  state: FilmstripState = {
    animate: false,
    offset: 0,
  };

  private handleSize = ({ offset }) => this.setState({ offset });
  private handleScroll = ({ animate, offset }) =>
    this.setState({ animate, offset });

  renderCards() {
    const { identifiers, context, cardProps } = this.props;
    const cards = identifiers.map(identifier => {
      return (
        <Card
          key={getIdentifierKey(identifier)}
          identifier={identifier}
          context={context}
          {...cardProps}
        />
      );
    });

    return cards;
  }

  render() {
    const { animate, offset } = this.state;

    return (
      <FilmstripView
        animate={animate}
        offset={offset}
        onSize={this.handleSize}
        onScroll={this.handleScroll}
      >
        {this.renderCards()}
      </FilmstripView>
    );
  }
}
