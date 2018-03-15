import * as React from 'react';
import { CardView } from '@atlaskit/media-card';
import { minimalLinkDetailsContainingASmartCard } from '@atlaskit/media-test-helpers';
import { FilmstripView } from '../src/filmstripView';

export interface StoryProps {}

export interface StoryState {
  animate: boolean;
  offset: number;
}

export class Story extends React.Component<StoryProps, StoryState> {
  state: StoryState = {
    animate: false,
    offset: 0,
  };

  handleSizeChange = ({ offset }) => this.setState({ offset });
  handleScrollChange = ({ offset, animate }) =>
    this.setState({ offset, animate });

  render() {
    const { animate, offset } = this.state;
    return (
      <div>
        <h1>With smart-card children</h1>
        <p>
          This story renders smart-card children to assert that they render OK
          inside the filmstrip. There once was a bug in filmstrip that resulted
          in the smart-card's text being invisible. See{' '}
          <a href="https://product-fabric.atlassian.net/browse/MSW-98">
            MSW-98
          </a>.
        </p>
        <FilmstripView
          animate={animate}
          offset={offset}
          onSize={this.handleSizeChange}
          onScroll={this.handleScrollChange}
        >
          <CardView
            status="complete"
            metadata={minimalLinkDetailsContainingASmartCard}
          />
          <CardView
            status="complete"
            metadata={minimalLinkDetailsContainingASmartCard}
          />
        </FilmstripView>
      </div>
    );
  }
}

export default () => <Story />;
