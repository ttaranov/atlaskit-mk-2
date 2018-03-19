// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { FieldTextStateless } from '@atlaskit/field-text';
import Modal from '@atlaskit/modal-dialog';
import Tooltip from '@atlaskit/tooltip';
import { colors, gridSize } from '@atlaskit/theme';

const IconExplorerLink = styled.a`
  &,
  &:hover,
  &:active,
  &:focus {
    border-radius: ${gridSize() / 2}px;
    color: inherit;
    cursor: pointer;
    display: block;
    line-height: 0;
    padding: 10px;
  }

  &:hover {
    background: ${colors.N30A};
  }
`;

const IconModalHeader = styled.h3`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
`;

type Props = {
  keywords: string[],
  component: Class<Component<*>>,
  componentName: string,
  package: string,
};

class IconExplorerCell extends Component<Props, { isModalOpen: boolean }> {
  props: Props;
  state = {
    isModalOpen: false,
  };

  input: ?HTMLInputElement;
  importCodeField: ?HTMLElement;

  setInputRef = (ref: ?HTMLInputElement) => {
    this.input = ref;
  };

  copyToClipboard = () => {
    if (!this.state.isModalOpen || !this.input) {
      return;
    }

    try {
      this.input.select();
      const wasCopied = document.execCommand('copy');

      if (!wasCopied) {
        throw new Error();
      }
    } catch (err) {
      console.error('Unable to copy text');
    }
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  render() {
    const { component: Icon, ...props } = this.props;

    const modal = this.state.isModalOpen ? (
      <Modal
        onClose={this.closeModal}
        header={() => (
          <IconModalHeader>
            <Icon label={props.componentName} size="medium" />
            {props.componentName}
          </IconModalHeader>
        )}
        actions={[
          {
            text: 'Copy',
            onClick: this.copyToClipboard,
          },
          {
            text: 'Close',
            onClick: this.closeModal,
          },
        ]}
      >
        {/* eslint-disable jsx-a11y/no-static-element-interactions */}
        <div
          onClick={() => this.input && this.input.select()}
          ref={ref => {
            this.importCodeField = ref;
          }}
          role="presentation"
        >
          <FieldTextStateless
            isLabelHidden
            isReadOnly
            label=""
            onChange={() => {}}
            shouldFitContainer
            value={`import ${props.componentName} from '${props.package}';`}
            innerRef={this.setInputRef}
          />
        </div>
        {/* eslint-enable jsx-a11y/no-static-element-interactions */}
      </Modal>
    ) : null;

    return (
      <div>
        <Tooltip content={props.componentName}>
          <IconExplorerLink onClick={this.openModal}>
            <Icon label={props.componentName} size="medium" />
          </IconExplorerLink>
        </Tooltip>
        {modal}
      </div>
    );
  }
}

export default IconExplorerCell;
