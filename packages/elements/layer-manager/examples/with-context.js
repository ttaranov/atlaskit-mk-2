// @flow
import React, { Component, type Node } from 'react';
import PropTypes from 'prop-types';
import Modal from '@atlaskit/modal-dialog';
import { withContextFromProps, withContextAcrossPortal } from '../src';

type Props = {
  children: Node,
};
type State = {
  isModalWithContextOpen: boolean,
  isModalWithoutContextOpen: boolean,
};

const ContextTypes = {
  organisation: PropTypes.string,
  package: PropTypes.string,
};

const ContextProvider = withContextFromProps(ContextTypes);

const ContentUsingContext = (props: any, context) => (
  <span>
    {context.organisation}/{context.package}
  </span>
);
ContentUsingContext.contextTypes = ContextTypes;

const ModalWithContext = withContextAcrossPortal(Modal, ContextTypes);

export default class extends Component<{}, State> {
  static contextTypes = ContextTypes;

  state = {
    isModalWithContextOpen: false,
    isModalWithoutContextOpen: false,
  };

  openModal = (withContext: boolean = false) => {
    const isModalOpen = withContext
      ? 'isModalWithContextOpen'
      : 'isModalWithoutContextOpen';
    this.setState({
      [isModalOpen]: true,
    });
  };

  closeModal = (withContext: boolean = false) => {
    const isModalOpen = withContext
      ? 'isModalWithContextOpen'
      : 'isModalWithoutContextOpen';
    this.setState({
      [isModalOpen]: false,
    });
  };

  render() {
    return (
      <ContextProvider organisation="@atlaskit" package="layer-manager">
        <p>
          <b>
            Open this example up full screen by clicking the monitor icon top
            right. A bug exists whereby nested modals don&apos;t work correctly.
          </b>
        </p>
        <p>
          Now that Tooltip, Modal, and Spotlight are rendered in a new sub-tree,
          using portals, they will not receive context (until React 16).
        </p>
        <p>
          To circumvent this we&apos;ve created an interim solution in the
          &ldquo;withContextAcrossPortal&rdquo; higher order component. Wrapping
          a portal boundary component with this higher order component will
          propagate the context specified across the portal.
        </p>
        <p>
          <button onClick={() => this.openModal(true)}>
            Open modal with context HOC
          </button>
          {this.state.isModalWithContextOpen && (
            <ModalWithContext
              actions={[{ text: 'OK', onClick: () => this.closeModal(true) }]}
              onClose={() => this.closeModal(true)}
              heading="Modal"
            >
              <ContentUsingContext />
            </ModalWithContext>
          )}
        </p>
        <p>
          <button onClick={() => this.openModal(false)}>
            Open modal without context HOC
          </button>
          {this.state.isModalWithoutContextOpen && (
            <Modal
              actions={[{ text: 'OK', onClick: () => this.closeModal(false) }]}
              onClose={() => this.closeModal(false)}
              heading="Modal"
            >
              <ContentUsingContext />
            </Modal>
          )}
        </p>
      </ContextProvider>
    );
  }
}
