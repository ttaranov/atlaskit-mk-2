// @flow
import React from 'react';
import styled from 'styled-components';
import { borderRadius, colors, AtlaskitThemeProvider } from '@atlaskit/theme';
import Toggle from '@atlaskit/toggle';
import Badge from '../src';

const Item = styled.div`
  align-items: center;
  border-radius: ${borderRadius}px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  max-width: 300px;
  padding: 0.6em 1em;

  &:hover {
    background-color: ${colors.N20};
  }
`;

type State = {
  theme: 'light' | 'dark',
};

export default class extends React.Component<{}, State> {
  state = { theme: 'light' };
  toggleTheme = () => {
    this.setState(prevState => ({
      theme: prevState.theme === 'light' ? 'dark' : 'light',
    }));
  };
  render() {
    return (
      <div>
        <Toggle onChange={this.toggleTheme} />
        <AtlaskitThemeProvider mode={this.state.theme}>
          <div>
            <Item>
              <p>Default</p>
              <Badge value={5} />
            </Item>
            <Item>
              <p>Primary</p>
              <Badge appearance="primary" value={-5} />
            </Item>
            <Item>
              <p>Primary Inverted</p>
              <Badge appearance="primaryInverted" value={-5} />
            </Item>
          </div>
        </AtlaskitThemeProvider>
      </div>
    );
  }
}
