// @flow
import React from 'react';
import Modal from '@atlaskit/modal-dialog';
import LayerManager from '../src';

type State = {
  isOuterModalOpen: boolean,
  isInnerModalOpen: boolean,
};

export default class App extends React.Component<{}, State> {
  state = {
    isOuterModalOpen: false,
    isInnerModalOpen: false,
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

  render() {
    const { isOuterModalOpen, isInnerModalOpen } = this.state;
    return (
      <LayerManager>
        <div style={{ height: '100vh' }}>
          Test&nbsp;
          <button onClick={this.openOuterModal}>Open outer modal</button>
          {isOuterModalOpen && (
            <Modal onClose={this.onOuterClose}>
              <button onClick={this.openInnerModal}>Open inner modal</button>
              {isInnerModalOpen && (
                <Modal onClose={this.onInnerClose}>
                  Inner Modal{' '}
                  <button onClick={this.onInnerClose}>Close modal</button>
                </Modal>
              )}
            </Modal>
          )}
        </div>
      </LayerManager>
    );
  }
}
