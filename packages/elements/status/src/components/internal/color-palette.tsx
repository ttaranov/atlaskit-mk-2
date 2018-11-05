import * as React from 'react';
import { PureComponent } from 'react';
import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { colors, gridSize } from '@atlaskit/theme';
import Color from './color';
import { Color as ColorType } from '../Status';

// color value, label, background, borderColor
const palette: [ColorType, string, string, string][] = [
  ['neutral', 'Grey', colors.N40, colors.N400],
  ['purple', 'Purple', colors.P50, colors.P400],
  ['blue', 'Blue', colors.B50, colors.B400],
  ['red', 'Red', colors.R50, colors.R400],
  ['yellow', 'Yellow', colors.Y75, colors.Y400],
  ['green', 'Green', colors.G50, colors.G400],
];

const ColorPaletteWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin: ${gridSize()}px ${gridSize()}px 0 ${gridSize()}px;
  /* Firefox bug fix: https://product-fabric.atlassian.net/browse/ED-1789 */
  display: flex;
  flex-wrap: wrap;
`;

interface ColorPaletteProps {
  selectedColor?: ColorType;
  onClick: (value: ColorType) => void;
  cols?: number;
  className?: string;
}

export default class ColorPalette extends PureComponent<
  ColorPaletteProps,
  any
> {
  render() {
    const { cols = 7, onClick, selectedColor, className } = this.props;

    return (
      <ColorPaletteWrapper
        className={className}
        style={{ maxWidth: cols * 32 }}
      >
        {palette.map(([colorValue, label, backgroundColor, borderColor]) => (
          <Color
            key={colorValue}
            value={colorValue}
            backgroundColor={backgroundColor}
            borderColor={borderColor}
            label={label}
            onClick={onClick}
            isSelected={colorValue === selectedColor}
          />
        ))}
      </ColorPaletteWrapper>
    );
  }
}
