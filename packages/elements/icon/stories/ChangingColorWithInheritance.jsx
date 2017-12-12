import React, { Component } from 'react';
import { akColorN300, akColorB500 } from '@atlaskit/util-shared-styles';
import styled from 'styled-components';
import Button from '@atlaskit/button';

const ColorDiv = styled.div`
  align-items: center;
  color: ${props => (props.isColorFlipped ? akColorN300 : 'white')};
  background-color: ${props => (props.isColorFlipped ? 'white' : akColorB500)};
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  justify-content: center;
  /* transition: color 0.2s, background-color 0.2s; */
`;

const Paragraph = styled.p`
  flex-basis: 100%;
  text-align: center;
  color: ${props => (props.isColorFlipped ? 'inherit' : 'white')}
`;

export default class ChangingColorWithInheritance extends Component {
  state = {
    isColorFlipped: false,
  }

  onToggleClick = () => {
    this.flipColor();
  }

  flipColor = () => {
    this.setState({ isColorFlipped: !this.state.isColorFlipped });
  }

  render() {
    return (
      <ColorDiv isColorFlipped={this.state.isColorFlipped}>
        <Paragraph isColorFlipped={this.state.isColorFlipped}>
          Icons inherit color from their parent by default.
        </Paragraph>
        {this.props.children}
        <Paragraph isColorFlipped={this.state.isColorFlipped}>
          <Button appearance="subtle-link" onClick={this.onToggleClick}>Change colour</Button>
        </Paragraph>
      </ColorDiv>
    );
  }
}
