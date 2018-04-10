// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { BigTarget } from './styled';
import type { Color } from './styled';
import Tooltip from '../src';

const VALID_POSITIONS = ['top', 'right', 'bottom', 'left'];

const targetHeight = 100;
const targetWidth = 200;

const VIEWPORT_POSITIONS = [
  { top: 0, left: 0 },
  { top: 0, left: `calc(50% - ${targetWidth / 2}px)` },
  { top: 0, right: 0 },
  { top: `calc(50% - ${targetHeight / 2}px)`, right: 0 },
  { bottom: 0, right: 0 },
  { bottom: 0, left: `calc(50% - ${targetWidth / 2}px)` },
  { bottom: 0, left: 0 },
  { top: `calc(50% - ${targetHeight / 2}px)`, left: 0 },
];

type Props = { color: Color };
type State = {
  position: number,
  positionType: 'standard' | 'mouse',
  viewportPosition: number,
};

const ContainerDiv = styled.div`
  height: calc(100vh - 32px);
  width: calc(100vw - 32px);
  position: relative;
`;

const CenterDiv = styled.div`
  top: calc(50% - 100px);
  left: calc(50% - 250px);
  position: absolute;
  width: 500px;
  height: 200px;
  z-index: 1;
  text-align: center;
`;

const ButtonDiv = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export default class PositionExample extends Component<Props, State> {
  // store the direction as an index and pull it from the list above,
  // just to simplify the `changeDirection` logic
  state = { position: 0, positionType: 'standard', viewportPosition: 0 };
  static defaultProps = {
    color: 'blue',
  };

  changeDirection = () => {
    this.setState({
      position: (this.state.position + 1) % VALID_POSITIONS.length,
    });
  };

  changePositionType = () => {
    this.setState({
      positionType:
        this.state.positionType === 'standard' ? 'mouse' : 'standard',
    });
  };

  changeViewportPosition = () => {
    this.setState({
      viewportPosition:
        (this.state.viewportPosition + 1) % VIEWPORT_POSITIONS.length,
    });
  };

  render() {
    const position = VALID_POSITIONS[this.state.position];
    const viewportStyle = VIEWPORT_POSITIONS[this.state.viewportPosition];
    const { positionType } = this.state;

    const tooltipPosition = positionType === 'standard' ? position : 'mouse';
    const mousePosition = positionType === 'mouse' ? position : undefined;

    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <ContainerDiv>
        <CenterDiv>
          <ButtonDiv>
            This example showcases the tooltips rendered with different
            positions.
            <br />
            Click the tooltip targets to change the position of the tooltip.
          </ButtonDiv>
          <ButtonDiv>
            <Button onClick={this.changePositionType}>
              Toggle position mouse
            </Button>
          </ButtonDiv>
          <ButtonDiv>
            <Button onClick={this.changeViewportPosition}>
              Change viewport position
            </Button>
          </ButtonDiv>
        </CenterDiv>
        <div
          onClick={this.changeDirection}
          style={{ position: 'absolute', ...viewportStyle }}
        >
          <Tooltip
            content={`The position of the tooltip is ${position}. Click to change this.`}
            position={tooltipPosition}
            mousePosition={mousePosition}
          >
            <BigTarget color={this.props.color}>
              <span>Target</span>
              <span>Position: {tooltipPosition}</span>
              <span>
                {positionType === 'mouse' &&
                  `mousePosition: ${String(mousePosition)}`}
              </span>
            </BigTarget>
          </Tooltip>
        </div>
      </ContainerDiv>
    );
  }
}
