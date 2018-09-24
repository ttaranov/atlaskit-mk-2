import * as React from 'react';
import { PureComponent } from 'react';
import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import {
  akGridSize,
  akColorB50,
  akColorP50,
  akColorR50,
  akColorG50,
  akColorN40,
  akColorY75,
  akColorY400,
  akColorN400,
  akColorB400,
  akColorP400,
  akColorR400,
  akColorG400,
} from '@atlaskit/util-shared-styles';
import Color from './color';
import { Color as ColorType } from '../Status';

// color value, label, background, borderColor
const palette: [ColorType, string, string, string][] = [
  ['neutral', 'Grey', akColorN40, akColorN400],
  ['purple', 'Purple', akColorP50, akColorP400],
  ['blue', 'Blue', akColorB50, akColorB400],
  ['red', 'Red', akColorR50, akColorR400],
  ['yellow', 'Yellow', akColorY75, akColorY400],
  ['green', 'Green', akColorG50, akColorG400],
];

const ColorPaletteWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin: ${akGridSize} ${akGridSize} 0 ${akGridSize};
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
