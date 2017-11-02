// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import Tooltip from '../src';
import { Target } from './styled';

function capitalize(str: String) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const color = {
  relative: 'green',
  absolute: 'yellow',
  fixed: 'red',
};

const Parent = styled.div`
  background-color: ${colors.N20};
  border-radius: 5px;
  height: 60px;
  padding: 8px;
  position: ${p => p.pos};
  width: 280px;
`;

type PosTypes = {
  children: any,
  pos: 'relative' | 'absolute' | 'fixed',
  rest: Array<any>,
};

const Position = ({ children, pos, ...rest }: PosTypes) => (
  <Parent pos={pos} {...rest}>
    <Tooltip content={`Position "${pos}"`}>
      <Target color={color[pos]}>{capitalize(pos)}</Target>
    </Tooltip>
    <p>Tooltip container position is <code>{pos}</code>.</p>
    {children}
  </Parent>
);

export default class PositionExample extends Component {
  panel: HTMLElement
  state = { pinned: false, top: 0 }
  pin = () => {
    const { top } = this.panel.getBoundingClientRect();
    this.setState({ pinned: true, top });
  }
  unpin = () => this.setState({ pinned: false })
  ref = (ref: HTMLElement) => { this.panel = ref; }
  render() {
    const { pinned, top } = this.state;
    return (
      <div style={{ height: 246, position: 'relative' }}>
        <Position pos="relative" />
        <Position pos="absolute" style={{ top: 84 }} />
        <Position innerRef={this.ref} pos={pinned ? 'fixed' : 'relative'} style={{ top: pinned ? top : 92 }}>
          <button onClick={pinned ? this.unpin : this.pin} style={{ position: 'absolute', right: 8, top: 8 }}>
            {pinned ? 'Unpin' : 'Pin'}
          </button>
        </Position>
      </div>
    );
  }
}
