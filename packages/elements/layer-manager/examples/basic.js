// @flow
import React, { Component } from 'react';
import Tooltip from '@atlaskit/tooltip';
import Modal from '@atlaskit/modal-dialog';
import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
} from '@atlaskit/onboarding';

// NOTE: @atlaskit/layer-manager is provided by the website

type Props = {};
type State = {
  modalIsVisible: boolean,
  modalTwoIsVisible: boolean,
  spotlightIsVisible: boolean,
};

const Hr = () => (
  <div
    style={{
      backgroundColor: '#ddd',
      height: 1,
      margin: '8px 0',
    }}
  />
);

export default class Example extends Component<Props, State> {
  state: State = {
    modalIsVisible: false,
    modalTwoIsVisible: false,
    spotlightIsVisible: false,
  };
  toggleModal = () =>
    this.setState(state => ({
      modalIsVisible: !state.modalIsVisible,
    }));
  toggleModalTwo = () => {
    this.setState(state => ({
      modalTwoIsVisible: !state.modalTwoIsVisible,
    }));
  };
  toggleSpotlight = () => {
    this.setState(state => ({
      spotlightIsVisible: !state.spotlightIsVisible,
    }));
  };
  render() {
    const { modalIsVisible, spotlightIsVisible } = this.state;

    return (
      <SpotlightManager style={{ alignItems: 'center', display: 'flex' }}>
        <Tooltip description="Hello World">
          <button>Tooltip</button>
        </Tooltip>
        <Hr />
        <button onClick={this.toggleModal}>Modal</button>
        <Hr />
        <SpotlightTarget name="button">
          <button onClick={this.toggleSpotlight}>Onboarding</button>
        </SpotlightTarget>

        {modalIsVisible && (
          <Modal
            actions={[{ onClick: this.toggleModal, text: 'Close' }]}
            heading="Hello World!"
            onClose={this.toggleModal}
          >
            <p>
              Cupcake ipsum dolor sit amet. Cheesecake fruitcake brownie donut
              dragée cotton candy. Sesame snaps gingerbread brownie caramels
              liquorice pie bonbon cake gummies.
            </p>
          </Modal>
        )}

        {spotlightIsVisible && (
          <Spotlight
            actions={[{ onClick: this.toggleSpotlight, text: 'Close' }]}
            dialogPlacement="bottom left"
            heading="Hello World!"
            key="button"
            target="button"
            targetRadius={4}
          >
            Cupcake ipsum dolor sit amet. Cheesecake fruitcake brownie donut
            dragée cotton candy. Sesame snaps gingerbread brownie caramels
            liquorice pie bonbon cake gummies.
          </Spotlight>
        )}
      </SpotlightManager>
    );
  }
}
