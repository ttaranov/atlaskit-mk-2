import * as React from 'react';
import { PureComponent } from 'react';
import Color from './Color';

import { ColorPaletteWrapper } from './styles';

export interface Props {
  palette: Map<string, string>;
  selectedColor?: string;
  cols?: number;
  onClick: (value: string) => void;
}

export default class ColorPalette extends PureComponent<Props, any> {
  render() {
    const { palette, cols = 7, onClick, selectedColor } = this.props;
    const colors: [string, string][] = [];
    palette.forEach((value, key) => colors.push([key, value]));
    return (
      <ColorPaletteWrapper style={{ maxWidth: cols * 32 }}>
        {colors.map(([color, label]) => (
          <Color
            key={color}
            value={color}
            label={label}
            onClick={onClick}
            isSelected={color === selectedColor}
          />
        ))}
      </ColorPaletteWrapper>
    );
  }
}
