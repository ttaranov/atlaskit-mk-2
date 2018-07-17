// @flow
import React, { Component } from 'react';
import LayerManager from '@atlaskit/layer-manager';

import { Modal, SpotlightManager } from '../src';
import { Code } from './styled';
import collaborationImage from './assets/collaboration.svg';

type State = {
  active: boolean,
};
class Example extends Component<{}, State> {
  state: State = { active: false };
  start = () => this.setState({ active: true });
  finish = () => this.setState({ active: false });
  render() {
    const { active } = this.state;

    return (
      <div>
        <p>
          <button onClick={this.start}>Launch Modal</button>
        </p>
        <p>
          The main way the user benefits modal differs from the typical{' '}
          <Code>@atlaskit/modal-dialog</Code> is how it scrolls the exterior
          wrapper rather than the dialog body.
        </p>

        {active && (
          <Modal
            actions={[
              { onClick: this.finish, text: 'Switch to the new JIRA' },
              { onClick: this.finish, text: 'Remind me later' },
            ]}
            heading="Experience your new JIRA"
            image={collaborationImage}
            key="welcome"
          >
            <p>
              Switch context, jump between project, and get back to work quickly
              with our new look and feel.
            </p>
            <p>Take it for a spin and let us know what you think.</p>
          </Modal>
        )}
      </div>
    );
  }
}

export default () => (
  <LayerManager>
    <SpotlightManager>
      <Example />
    </SpotlightManager>
  </LayerManager>
);
