// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import {
  DropdownMenuStateless,
  DropdownItemGroupRadio,
  DropdownItemRadio,
} from '../src';

type State = {
  isDropdownOpen: boolean,
};

const Container = styled.div`
  height: 2000px;
  padding-top: 1000px;
`;

export default class StatelessMenuExample extends Component<{}, State> {
  state = { isDropdownOpen: false };

  render() {
    return (
      <Container>
        <DropdownMenuStateless
          isOpen={this.state.isDropdownOpen}
          onOpenChange={attrs => {
            this.setState({ isDropdownOpen: attrs.isOpen });
          }}
          trigger="Choose"
          triggerType="button"
          isMenuFixed
        >
          <DropdownItemGroupRadio id="cities">
            <DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
            <DropdownItemRadio id="melbourne">Melbourne</DropdownItemRadio>
          </DropdownItemGroupRadio>
        </DropdownMenuStateless>
      </Container>
    );
  }
}
