// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { Label } from '@atlaskit/field-base';
import FieldRange from '@atlaskit/field-range';
import { Target } from './styled';
import type { Color } from './styled';
import Tooltip from '../src';

const VALID_POSITIONS = ['top', 'right', 'bottom', 'left'];

type Props = { color: Color };
type State = { position: number, topPosition: number, leftPosition: number };

const Header = styled.h3`
  padding: 20px 0 12px;
`;

export default class PositionExample extends Component<Props, State> {
  // store the direction as an index and pull it from the list above,
  // just to simplify the `changeDirection` logic
  state = { position: 0, topPosition: 0, leftPosition: 0 };
  static defaultProps = {
    color: 'blue',
  };

  changeDirection = () => {
    this.setState({
      position: (this.state.position + 1) % VALID_POSITIONS.length,
    });
  };

  onTopPositionChange = (value: number) => {
    this.setState({
      topPosition: value,
    });
  };

  onLeftPositionChange = (value: number) => {
    this.setState({
      leftPosition: value,
    });
  };

  render() {
    const position = VALID_POSITIONS[this.state.position];
    const { topPosition, leftPosition } = this.state;

    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <div
        style={{
          position: 'relative',
          top: topPosition,
          left: leftPosition,
          marginTop: 200,
        }}
      >
        <p style={{ paddingRight: 'calc(100% - 400px)' }}>
          This example showcases the tooltips rendered with different positions.
          Click the tooltip targets to change the position of the tooltip.
        </p>
        <div
          style={{ position: 'fixed', top: 0, left: 420, right: 20, zIndex: 0 }}
        >
          <Label label={`Top: ${topPosition}px`} />
          <FieldRange
            value={topPosition}
            min={-500}
            max={5000}
            step={50}
            onChange={this.onTopPositionChange}
          />
          <Label label={`Left: ${leftPosition}px`} />
          <FieldRange
            value={leftPosition}
            min={-500}
            max={5000}
            step={50}
            onChange={this.onLeftPositionChange}
          />
          <p>
            Change the top & left positions of the content to see how the
            tooltips behave when they are close to the edge of the viewport.
            They should flip to the other side of the position you set and shift
            along the other side of the axis to stay in the viewport.
          </p>
        </div>
        <div onClick={this.changeDirection}>
          <Header>Standard tooltip positioning</Header>
          <Tooltip content={position} position={position}>
            <Target color={this.props.color}>Target</Target>
          </Tooltip>
          <p>Position: {position}</p>
        </div>
        <div onClick={this.changeDirection}>
          <Header>Tooltip with position mouse</Header>
          <Tooltip
            content={`mouse ${position}`}
            position="mouse"
            mousePosition={position}
          >
            <Target color={this.props.color}>Mouse</Target>
          </Tooltip>
          <p>Position: mouse</p>
          <p>mousePosition: {position}</p>
        </div>
      </div>
    );
  }
}
