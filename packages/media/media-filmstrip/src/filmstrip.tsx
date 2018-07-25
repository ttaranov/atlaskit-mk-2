/* tslint:disable variable-name */
import * as React from 'react';
import { Component } from 'react';
import { Identifier, Card, UrlPreviewIdentifier } from '@atlaskit/media-card';
import { FilmstripView } from './filmstripView';
import { Context } from '@atlaskit/media-core';

export interface FilmstripProps {
  identifiers: Identifier[];
  context: Context;
  animate?: boolean;
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
    const { identifiers, context } = this.props;
    const cards = identifiers.map(identifier => {
      return (
        <Card
          key={getIdentifierKey(identifier)}
          identifier={identifier}
          context={context}
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
