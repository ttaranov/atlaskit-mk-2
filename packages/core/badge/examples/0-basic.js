// @flow

import React from 'react';
import styled from 'styled-components';
import { borderRadius, colors } from '@atlaskit/theme';
import Badge, {
  ThemeAdded,
  ThemeImportant,
  ThemePrimary,
  ThemePrimaryInverted,
  ThemeRemoved,
} from '../src';

const Item = styled.div`
  align-items: center;
  background: ${props => (props.inverted ? colors.B400 : 'none')};
  border-radius: ${borderRadius}px;
  color: ${props => (props.inverted ? colors.N0 : 'inherit')};
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  max-width: 300px;
  padding: 0.6em 1em;

  &:hover {
    background-color: ${props => (props.inverted ? colors.B500 : colors.N20)};
  }
`;

export default function Example() {
  return (
    <div>
      <Item>
        <Badge theme={ThemeAdded} max={99}>
          {3000}
        </Badge>
      </Item>
      <Item>
        <p>Default</p>
        <Badge>{5}</Badge>
      </Item>
      <Item>
        <p>Default (∞)</p>
        <Badge max={Infinity}>{Infinity}</Badge>
      </Item>
      <Item>
        <p>Important</p>
        <Badge theme={ThemeImportant}>{25}</Badge>
      </Item>
      <Item>
        <p>Primary</p>
        <Badge theme={ThemePrimary}>{-5}</Badge>
      </Item>
      <Item inverted>
        <p>Primary Inverted</p>
        <Badge theme={ThemePrimaryInverted}>{5}</Badge>
      </Item>
      <Item>
        <p>Removed</p>
        <Badge theme={ThemeRemoved}>{100}</Badge>
      </Item>
    </div>
  );
}
