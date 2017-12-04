// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import { Presence } from '../src/';

const Container = styled.div`
  display: flex;
`;

const PresenceWrapper = styled.div`
  height: 30px;
  width: 30px;
  margin-right: ${gridSize}px;
`;

type State = {|
  width: number,
|};

export default class PresenceWidthExample extends Component<*, State> {
  state: State = {
    width: 60,
  };
  decrement = key => this.setState(state => ({ [key]: state[key] - 1 }));
  increment = key => this.setState(state => ({ [key]: state[key] + 1 }));
  render() {
    const { width } = this.state;

    return (
      <div>
        <h3>Size behavior</h3>
        <p>
          By default presences will stretch to fill their parents. Try resizing
          the wrapping div below to see this in action.
        </p>
        <p>
          Therefore it is recommended to always have a wrapping div around
          presences when consuming them separately to Avatars.
        </p>
        <input
          min="10"
          max="130"
          onChange={e => this.setState({ width: parseInt(e.target.value, 10) })}
          step="10"
          title="Width"
          type="range"
          value={width}
        />
        <div style={{ maxWidth: width, border: '1px dotted blue' }}>
          <Presence presence="busy" />
        </div>
      </div>
    );
  }
}
