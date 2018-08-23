// @flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import FeedbackCollector, { FeedbackFlag } from '../src/';

type State = { isOpen: boolean, displayFlag: boolean };

const EMBEDDABLE_KEY = '98d7ccb7-00ba-4207-9ba9-b16e919a20af';
const REQUEST_TYPE_ID = '24';
const name = 'Feedback Sender';
const email = 'fsender@atlassian.com';

export default class DisplayFeedback extends Component<void, State> {
  state = { isOpen: false, displayFlag: false };

  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });
  displayFlag = () => this.setState({ displayFlag: true });
  hideFlag = () => this.setState({ displayFlag: false });

  render() {
    const { isOpen, displayFlag } = this.state;
    return (
      <div>
        <Button appearance="primary" onClick={this.open}>
          Display Feedback
        </Button>

        {isOpen && (
          <FeedbackCollector
            onClose={this.close}
            onSubmit={this.displayFlag}
            email={email}
            name={name}
            requestTypeId={REQUEST_TYPE_ID}
            embeddableKey={EMBEDDABLE_KEY}
          />
        )}

        {displayFlag && <FeedbackFlag onDismissed={this.hideFlag} />}
      </div>
    );
  }
}
