import * as React from 'react';
import { Component } from 'react';
import {
  I18NWrapper,
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { MediaViewer } from '../src';
import { imageItem, errorItem } from '../example-helpers';

const context = createStorybookContext();

export interface ExampleState {
  isOpen: boolean;
}

class Example extends Component {
  state: ExampleState = {
    isOpen: false,
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render() {
    const { isOpen } = this.state;

    return (
      <I18NWrapper>
        <div>
          <button onClick={this.toggle}>Toggle MediaViewer</button>
          {isOpen && (
            <MediaViewer
              featureFlags={{ customVideoPlayer: true }}
              context={context}
              selectedItem={errorItem}
              dataSource={{ list: [imageItem, errorItem] }}
              collectionName={defaultCollectionName}
              onClose={this.toggle}
            />
          )}
        </div>
      </I18NWrapper>
    );
  }
}

export default () => <Example />;
