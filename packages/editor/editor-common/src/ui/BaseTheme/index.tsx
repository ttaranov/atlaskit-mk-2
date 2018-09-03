import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { fontSize } from '@atlaskit/theme';

export class BaseTheme extends React.Component<{}> {
  render() {
    return (
      <ThemeProvider theme={{ baseFontSize: fontSize() }}>
        <>{this.props.children}</>
      </ThemeProvider>
    );
  }
}
