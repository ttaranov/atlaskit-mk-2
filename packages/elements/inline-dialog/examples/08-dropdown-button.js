// @flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import InlineDialog from '../src';

const dialogContent = (
  <div style={{ maxWidth: '300px' }}>
    <h5>Use the HipChat app</h5>
    <p>
      Would you rather open links in the HipChat application intead of your
      browser?
    </p>
    <p>
      Don&#39;t have the HipChat app? <a href="https://hipchat.com/">Get it!</a>
    </p>
  </div>
);

const centeredContainerStyles = {
  display: 'flex',
  height: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
};

type State = {
  isOpen: boolean,
};

export default class DropDownButton extends Component<{}, State> {
  state = {
    isOpen: false,
  };

  handleClick = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  handleOnClose = (data: { isOpen: boolean, event: Event }) => {
    this.setState({
      isOpen: data.isOpen,
    });
  };

  render() {
    return (
      <div style={centeredContainerStyles}>
        <InlineDialog
          content={dialogContent}
          position="top right"
          isOpen={this.state.isOpen}
          onClose={this.handleOnClose}
        >
          <Button
            onClick={this.handleClick}
            iconBefore={<SettingsIcon label="settings" />}
            isSelected
          />
        </InlineDialog>
      </div>
    );
  }
}
