import React, { Component } from 'react';
import { akColorN300, akColorB500 } from '@atlaskit/util-shared-styles';
import styled from 'styled-components';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button';

const ColorDiv = styled.div`
  align-items: center;
  background-color: ${props => (props.isColorFlipped ? 'white' : akColorB500)};
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  justify-content: center;
  transition: color 0.2s, background-color 0.2s;
`;

const Paragraph = styled.p`
  flex-basis: 100%;
  text-align: center;
  color: ${props => (props.isColorFlipped ? 'inherit' : 'white')}
`;

export default class ChangingColorWithProps extends Component {
  state = {
    isColorFlipped: true,
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
          Icon colors can be set via the primaryColor and secondaryColor props.
        </Paragraph>
        {
          this.props.icons.map(([Icon, label], key) => (
            <Tooltip content={label} key={key}>
              <Icon primaryColor={this.state.isColorFlipped ? akColorN300 : 'white'} size="xlarge" label={label} />
            </Tooltip>
          ))
        }
        <Paragraph isColorFlipped={this.state.isColorFlipped}>
          <Button appearance="subtle-link" onClick={this.onToggleClick}>Change colour</Button>
        </Paragraph>
      </ColorDiv>
    );
  }
}
