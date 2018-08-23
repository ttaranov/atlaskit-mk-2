// @flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import FeedbackCollector from '../src/';

type State = { isOpen: boolean };

const EMBEDDABLE_KEY = '98d7ccb7-00ba-4207-9ba9-b16e919a20af';
const REQUEST_TYPE_ID = '24';
const name = 'Carla Baba';
const email = 'cbaba@atlassian.com';

export default class DisplayFeedback extends Component<void, State> {
  state = { isOpen: false };

  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });

  render() {
    const { isOpen } = this.state;
    return (
      <div>
        <Button appearance="primary" onClick={this.open}>
          Display Feedback
        </Button>

        {isOpen && (
          <FeedbackCollector
            onClose={this.close}
            email={email}
            name={name}
            requestTypeId={REQUEST_TYPE_ID}
            embeddableKey={EMBEDDABLE_KEY}
          />
        )}
      </div>
    );
  }
}
