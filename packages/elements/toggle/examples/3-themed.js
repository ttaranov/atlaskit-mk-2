// @flow
import React from 'react';
import Toggle from '@atlaskit/toggle';
import Button from '@atlaskit/button';
import { AtlaskitThemeProvider, gridSize } from '@atlaskit/theme';

console.log('AtlaskitThemeProvider', AtlaskitThemeProvider);

type State = {|
  mode: 'light' | 'dark',
|};

export default class Swapper extends React.Component<any, State> {
  state: State = {
    mode: 'light',
  };

  onClick = () => {
    this.setState({
      mode: this.state.mode === 'light' ? 'dark' : 'light',
    });
  };
  render() {
    return (
      <AtlaskitThemeProvider mode={this.state.mode}>
        <div>
          <Toggle />
          <div style={{ marginTop: gridSize() }}>
            <Button onClick={this.onClick}>
              Toggle theme{' '}
              <span role="img" aria-label="irony">
                😂
              </span>
            </Button>
          </div>
        </div>
      </AtlaskitThemeProvider>
    );
  }
}
