// @flow
import React from 'react';
import Modal from '@atlaskit/modal-dialog';
import LayerManager from '../src';

type State = {
  isOuterModalOpen: boolean,
  isInnerModalOpen: boolean,
  isInnerInnerModalOpen: boolean,
};

export default class App extends React.Component<{}, State> {
  state = {
    isOuterModalOpen: false,
    isInnerModalOpen: false,
    isInnerInnerModalOpen: false,
  };

  openOuterModal = () => {
    this.setState({
      isOuterModalOpen: true,
    });
  };

  onOuterClose = () => {
    this.setState({
      isOuterModalOpen: false,
    });
  };

  openInnerModal = () => {
    this.setState({
      isInnerModalOpen: true,
    });
  };

  onInnerClose = () => {
    this.setState({
      isInnerModalOpen: false,
    });
  };

  openInnerInnerModal = () => {
    this.setState({
      isInnerInnerModalOpen: true,
    });
  };

  onInnerInnerClose = () => {
    this.setState({
      isInnerInnerModalOpen: false,
    });
  };

  render() {
    const {
      isOuterModalOpen,
      isInnerModalOpen,
      isInnerInnerModalOpen,
    } = this.state;
    return (
      <LayerManager>
        <div style={{ height: '100vh' }}>
          <p>
            It is not recommended to nest modals however layer manager should
            still handle them correctly.
          </p>
          <button onClick={this.openOuterModal}>Open outer modal</button>
          {isOuterModalOpen && (
            <Modal onClose={this.onOuterClose}>
              <button onClick={this.openInnerModal}>Open inner modal</button>
              {isInnerModalOpen && (
                <Modal onClose={this.onInnerClose}>
                  Inner Modal{' '}
                  <button onClick={this.openInnerInnerModal}>
                    Open inner inner modal
                  </button>
                  {isInnerInnerModalOpen && (
                    <Modal onClose={this.onInnerInnerClose}>
                      Inner Inner Modal
                    </Modal>
                  )}
                </Modal>
              )}
            </Modal>
          )}
        </div>
      </LayerManager>
    );
  }
}
