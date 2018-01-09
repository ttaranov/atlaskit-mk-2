import * as React from 'react';
import { Component } from 'react';
import { Color } from '@atlaskit/media-editor';

import { GenericButton } from './genericButton';
import { OptionsIcon } from './optionsIcon';
import { ColorSample } from './styles';

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
        <ColorSample style={style} />
        <OptionsIcon isActive={isActive} />
      </GenericButton>
    );
  }
}
