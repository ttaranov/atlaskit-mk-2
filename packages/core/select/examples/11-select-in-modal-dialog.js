// @flow
import React, { Component } from 'react';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button';
import Select from '../src';

type State = {
  isOpen: boolean,
};

export default class SelectInModal extends Component<{}, State> {
  state: State = { isOpen: false };
  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });

  render() {
    const { isOpen } = this.state;
    const actions = [{ text: 'Close', onClick: this.close }];

    return (
      <div>
        <Button onClick={this.open}>Open Modal</Button>

        <ModalTransition>
          {isOpen && (
            <Modal actions={actions} onClose={this.close} heading="Modal Title">
              <Select
                menuPortalTarget={document.body}
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                options={[
                  { label: 'Adelaide', value: 'adelaide' },
                  { label: 'Brisbane', value: 'brisbane' },
                  { label: 'Canberra', value: 'canberra' },
                  { label: 'Darwin', value: 'darwin' },
                  { label: 'Hobart', value: 'hobart' },
                  { label: 'Melbourne', value: 'melbourne' },
                  { label: 'Perth', value: 'perth' },
                  { label: 'Sydney', value: 'sydney' },
                ]}
                placeholder="Choose a City"
              />
            </Modal>
          )}
        </ModalTransition>
      </div>
    );
  }
}
