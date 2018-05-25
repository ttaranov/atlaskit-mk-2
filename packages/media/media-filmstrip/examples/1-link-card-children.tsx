import * as React from 'react';
import { Component } from 'react';

import { Card } from '@atlaskit/media-card';
import {
  createStorybookContext,
  youtubeLinkId,
} from '@atlaskit/media-test-helpers';

import { FilmstripView } from '../src';

export interface StoryState {
  animate: boolean;
  offset: number;
}

export class Story extends Component<{}, StoryState> {
  readonly mediaContext;
  readonly cardDimensions;

  state: StoryState = {
    animate: false,
    offset: 0,
  };

  constructor(props) {
    super(props);

    this.mediaContext = createStorybookContext();
    this.cardDimensions = { width: 363 }; // dimensions used in the renderer
  }

  handleSizeChange = ({ offset }) => this.setState({ offset });
  handleScrollChange = ({ offset, animate }) =>
    this.setState({ offset, animate });

  render() {
    const { animate, offset } = this.state;
    const cards: Array<JSX.Element> = Array.apply(null, { length: 5 }).map(
      (e, k) => (
        <Card
          key={k}
          appearance="horizontal"
          identifier={youtubeLinkId}
          context={this.mediaContext}
          dimensions={this.cardDimensions}
        />
      ),
    );

    return (
      <div style={{ padding: 40 }}>
        <h1 style={{ marginBottom: 20 }}>Filmstrip with just link cards</h1>
        <p>
          As a filmstrip user, I want to be able to navigate between link cards
          in the filmstrip. Previously, a bug was reported in filmstrip which
          prevented navigation within a filmstrip when it contained exclusively
          link items (<a href="https://product-fabric.atlassian.net/browse/MSW-213">
            MSW-213
          </a>)
        </p>

        <FilmstripView
          animate={animate}
          offset={offset}
          onScroll={this.handleScrollChange}
          onSize={this.handleSizeChange}
        >
          {cards}
        </FilmstripView>
      </div>
    );
  }
}

export default () => <Story />;
