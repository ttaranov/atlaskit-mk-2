import * as React from 'react';
import { Component } from 'react';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { Color } from '../../../..';

import { GenericButton } from './genericButton';
import { ColorSample, DropdownIconWrapper } from './styles';

export interface ColorButtonProps {
  readonly color: Color;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

export class ColorButton extends Component<ColorButtonProps> {
  render() {
    const { color, isActive, onClick } = this.props;
    const { red, green, blue } = color;
    const style = { backgroundColor: `rgb(${red}, ${green}, ${blue})` };

    return (
      <GenericButton isActive={isActive} onClick={onClick}>
        <DropdownIconWrapper>
          <ColorSample style={style} />
        </DropdownIconWrapper>
        <ChevronDownIcon label="chevron-icon" />
      </GenericButton>
    );
  }
}
