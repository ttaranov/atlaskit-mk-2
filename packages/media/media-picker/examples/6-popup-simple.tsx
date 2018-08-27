import {
  defaultCollectionName,
  defaultMediaPickerAuthProvider,
  userAuthProvider,
  mediaMock,
} from '@atlaskit/media-test-helpers';

import * as React from 'react';
import { Component } from 'react';
import Button from '@atlaskit/button';
import { ContextFactory } from '@atlaskit/media-core';

import { MediaPicker } from '../src';

mediaMock.enable();

const context = ContextFactory.create({
  authProvider: defaultMediaPickerAuthProvider,
  userAuthProvider: userAuthProvider,
});

const popup = MediaPicker('popup', context, {
  container: document.body,
  uploadParams: {
    collection: defaultCollectionName,
  },
});

popup.show();

export type Event = {
  readonly name: string;
  readonly payload: any;
};

export type Props = {};

export type State = {
  readonly events: Event[];
};

export default class Example extends Component<Props, State> {
  state: State = {
    events: [],
  };

  componentDidMount() {
    popup.onAny((event, payload) => {
      const { events } = this.state;
      this.setState({
        events: [...events, { name: event, payload }],
      });
    });
  }

  render() {
    const { events } = this.state;
    return (
      <div>
        <Button id="show" onClick={() => popup.show()}>
          Show
        </Button>
        <div>
          <div>Events:</div>
          <pre id="events">{JSON.stringify(events, null, 2)}</pre>
        </div>
      </div>
    );
  }
}
