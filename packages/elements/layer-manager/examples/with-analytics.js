// @flow
import React, { Component } from 'react';
import {
  AnalyticsListener,
  AnalyticsDecorator,
  withAnalytics,
} from '@atlaskit/analytics';
import AKButton from '@atlaskit/button';
import Modal from '@atlaskit/modal-dialog';
import LayerManager from '../src';

type State = {
  isModalOpen: boolean,
};

const Button = withAnalytics(AKButton, {
  onClick: 'click',
});

export default class extends Component<{}, State> {
  state = {
    isModalOpen: false,
  };

  openModal = () => {
    this.setState({
      isModalOpen: true,
    });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  onEvent = (eventName: string, eventData: any) => {
    console.log(eventName, eventData);
  };

  render() {
    return (
      <LayerManager>
        <AnalyticsListener onEvent={this.onEvent}>
          <div style={{ height: '100vh' }}>
            <p>
              <b>
                Open this example up full screen by clicking the monitor icon
                top right as nested modals don&apos;t work correctly at the
                moment.
              </b>
            </p>
            <p>
              Since the Analytics package relies on the context to fire events
              correctly, we&apos;re passing the analytics context down through
              the portal so that it continues to work.
            </p>
            <AnalyticsDecorator data={{ isDecorated: true }}>
              <p>
                <button onClick={this.openModal}>Open modal</button>
                {this.state.isModalOpen && (
                  <Modal
                    actions={[{ text: 'OK', onClick: this.closeModal }]}
                    onClose={this.closeModal}
                    heading="Modal"
                  >
                    <Button analyticsId="insidePortal">
                      Click me to fire an event
                    </Button>
                  </Modal>
                )}
              </p>
            </AnalyticsDecorator>
          </div>
        </AnalyticsListener>
      </LayerManager>
    );
  }
}
