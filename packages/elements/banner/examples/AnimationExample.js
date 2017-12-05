// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import WarningBanner from './WarningBanner';

const ButtonWrapper = styled.div`
  padding-bottom: ${p => (p.isOpen ? 8 : 0)}px;
  transition: padding 0.25s ease-in-out;
  will-change: padding;
`;

export default class ToggleBanner extends Component<{}, { isOpen: boolean }> {
  state = { isOpen: false };

  toggleBanner = () => this.setState(state => ({ isOpen: !state.isOpen }));

  render() {
    const { isOpen } = this.state;

    return (
      <div>
        <ButtonWrapper isOpen={isOpen}>
          <Button appearance="primary" onClick={this.toggleBanner}>
            {isOpen ? 'Hide' : 'Show'} banner
          </Button>
        </ButtonWrapper>
        <WarningBanner isOpen={isOpen} />
      </div>
    );
  }
}
