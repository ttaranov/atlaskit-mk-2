import * as React from 'react';
import { Component } from 'react';
import {
  defaultServiceHost,
  mediaPickerAuthProvider,
  createStorybookContext,
} from '@atlaskit/media-test-helpers';
import { ContextFactory } from '../src';

export interface ComponentProps {}
export interface ComponentState {}

const context = createStorybookContext();
// const context = ContextFactory.create({
//   serviceHost: defaultServiceHost,
//   authProvider: mediaPickerAuthProvider('asap'),
// });

class Example extends Component<ComponentProps, ComponentState> {
  fetchCollectionItems = () => {
    context.collection.getItems('recents');
  };

  render() {
    return (
      <div>
        <button onClick={this.fetchCollectionItems}>
          Fetch collection items
        </button>
      </div>
    );
  }
}

export default () => (
  <div>
    <Example />
  </div>
);
