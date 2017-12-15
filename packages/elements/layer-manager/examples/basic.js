// @flow
import React, { Component } from 'react';
import Tooltip from '@atlaskit/tooltip';
import Modal from '@atlaskit/modal-dialog';
import LayerManager from '@atlaskit/layer-manager';
// import { Spotlight, SpotlightManager, SpotlightTarget } from '@atlaskit/onboarding';

const Spotlight = props => <div {...props} />;
const SpotlightManager = props => <div {...props} />;
const SpotlightTarget = props => <div {...props} />;

type Props = {};
type State = {
  modalIsVisible: boolean,
  modalTwoIsVisible: boolean,
  spotlightIsVisible: boolean,
};

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
    const {
      modalIsVisible,
      modalTwoIsVisible,
      spotlightIsVisible,
    } = this.state;

    return (
      <SpotlightManager style={{ alignItems: 'center', display: 'flex' }}>
        <Tooltip description="Hello World">
          <button>Tooltip</button>
        </Tooltip>
        <button onClick={this.toggleModal}>Modal</button>
        <SpotlightTarget name="button">
          <button onClick={this.toggleSpotlight}>Onboarding</button>
        </SpotlightTarget>

        {modalIsVisible && (
          <Modal
            actions={[{ onClick: this.toggleModal, text: 'Close' }]}
            heading="Modal one"
            onClose={this.toggleModal}
          >
            <p>
              Cupcake ipsum dolor sit amet. Cheesecake fruitcake brownie donut
              dragée cotton candy. Sesame snaps gingerbread brownie caramels
              liquorice pie bonbon cake gummies.
            </p>

            <button onClick={this.toggleModalTwo}>Modal</button>

            {modalTwoIsVisible && (
              <Modal
                actions={[{ onClick: this.toggleModalTwo, text: 'Close' }]}
                heading="Modal TWO"
                onClose={this.toggleModalTwo}
              >
                <p>
                  Cupcake ipsum dolor sit amet. Cheesecake fruitcake brownie
                  donut dragée cotton candy. Sesame snaps gingerbread brownie
                  caramels liquorice pie bonbon cake gummies.
                </p>
              </Modal>
            )}
          </Modal>
        )}

        {spotlightIsVisible && (
          <Spotlight
            actions={[{ onClick: this.toggleSpotlight, text: 'Close' }]}
            dialogPlacement="bottom left"
            heading="Spotlight heading"
            key="button"
            target="button"
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
