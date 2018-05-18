// @flow

import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { colors } from '@atlaskit/theme';
import { DropdownMenuStateless, DropdownItemGroup, DropdownItem } from '../src';

const Description = styled.p`
  margin-bottom: 8px;
`;

const OverflowParentHidden = styled.div`
  display: flex;
  position: relative;
  padding: 20px;
  overflow: hidden;
  background-color: ${colors.N20};
`;

const ButtonSpacer = styled.div`
  margin-left: 20px;
`;

type State = {| isMenuFixed: boolean |};
export default class OverflowParentExample extends Component<{}, State> {
  state = {
    isMenuFixed: false,
  };

  toggleMenuPosition = () =>
    this.setState(state => ({ isMenuFixed: !state.isMenuFixed }));

  renderDropdown() {
    const { isMenuFixed } = this.state;

    return (
      <DropdownMenuStateless
        triggerType="button"
        trigger="Choices"
        isOpen
        isMenuFixed={isMenuFixed}
      >
        <DropdownItemGroup>
          <DropdownItem>Sydney</DropdownItem>
          <DropdownItem>Melbourne</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenuStateless>
    );
  }

  render() {
    const { isMenuFixed } = this.state;

    return (
      <Fragment>
        <Description>
          The grey box below is the containing block of the dropdown with an
          overflow.<br />
          {`The list ${
            isMenuFixed ? 'will' : 'will not'
          } be visible outside of it when open.`}
        </Description>
        <OverflowParentHidden>
          {this.renderDropdown()}
          <ButtonSpacer>
            <Button onClick={this.toggleMenuPosition}>
              {`isMenuFixed: ${String(isMenuFixed)}`}
            </Button>
          </ButtonSpacer>
        </OverflowParentHidden>
      </Fragment>
    );
  }
}
