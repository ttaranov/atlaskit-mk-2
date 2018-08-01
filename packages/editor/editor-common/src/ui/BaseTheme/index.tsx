import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { fontSize } from '@atlaskit/theme';
import { akEditorSizes } from '../../styles';
import { WidthConsumer } from '../WidthProvider';

export function getSizes(width: number = 0) {
  if (width >= 1060 && width < 1320) {
    return { baseFont: fontSize() + 2, size: akEditorSizes.M }; // 16px
  } else if (width >= 1320) {
    return { baseFont: fontSize() + 4, size: akEditorSizes.L }; // 18px
  }
  return { baseFont: fontSize(), size: akEditorSizes.S }; // 14px
}

export class BaseTheme extends React.Component<{ width?: number }> {
  render() {
    return (
      <WidthConsumer>
        {width => (
          <ThemeProvider theme={getSizes(width)}>
            <>{this.props.children}</>
          </ThemeProvider>
        )}
      </WidthConsumer>
    );
  }
}
