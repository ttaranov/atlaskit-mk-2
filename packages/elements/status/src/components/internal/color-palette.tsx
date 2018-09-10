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
  akColorY300,
  akColorN500,
  akColorB500,
  akColorP500,
  akColorR500,
  akColorG500,
} from '@atlaskit/util-shared-styles';
import Color from './color';

const palette: [string, string, string, string][] = [
  ['neutral', 'Grey', akColorN40, akColorN500],
  ['purple', 'Purple', akColorP50, akColorP500],
  ['blue', 'Blue', akColorB50, akColorB500],
  ['red', 'Red', akColorR50, akColorR500],
  ['yellow', 'Yellow', akColorY75, akColorY300],
  ['green', 'Green', akColorG50, akColorG500],
];

const ColorPaletteWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  padding: 0 ${akGridSize};
  /* Firefox bug fix: https://product-fabric.atlassian.net/browse/ED-1789 */
  display: flex;
  flex-wrap: wrap;
`;

interface ColorPaletteProps {
  selectedColor?: string;
  onClick: (value: string) => void;
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
