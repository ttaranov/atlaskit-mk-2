import * as React from 'react';
import { PureComponent } from 'react';
import Color from './Color';

import { ColorPaletteWrapper } from './styles';

export interface Props {
  palette: Map<string, string>;
  selectedColor?: string;
  cols?: number;
  borderColors: object;
  onClick: (value: string) => void;
}

export default class ColorPalette extends PureComponent<Props, any> {
  render() {
    const {
      palette,
      cols = 7,
      onClick,
      selectedColor,
      borderColors,
    } = this.props;

    const colors: [string, string][] = [];
    palette.forEach((value, key) => colors.push([key, value]));
    return (
      <ColorPaletteWrapper style={{ maxWidth: cols * 32 }}>
        {colors.map(([color, label]) => (
          <Color
            key={color}
            value={color}
            borderColor={borderColors[label.toLowerCase() || 'transparent']}
            label={label}
            onClick={onClick}
            isSelected={color === selectedColor}
          />
        ))}
      </ColorPaletteWrapper>
    );
  }
}
