/* tslint:disable variable-name */
import * as React from 'react';
import { Component } from 'react';
import {
  Identifier,
  Card,
  CardAction,
  CardOnClickCallback,
  CardEvent,
  OnSelectChangeFunc,
  OnLoadingChangeFunc,
  isUrlPreviewIdentifier,
} from '@atlaskit/media-card';
import { Context } from '@atlaskit/media-core';
import { FilmstripView } from './filmstripView';

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
