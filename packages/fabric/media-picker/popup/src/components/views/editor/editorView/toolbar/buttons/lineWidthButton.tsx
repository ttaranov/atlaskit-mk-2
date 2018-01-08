import * as React from 'react';
import { Component } from 'react';

import { GenericButton } from './genericButton';
import { OptionsIcon } from './optionsIcon';
import { LineWidthIcon } from './styles';

// The icon is inlined because we need to change its color
const svg = require('!raw-loader!./icons/lineWidth.svg');

export interface LineWidthButtonProps {
  readonly isActive: boolean;
  readonly onClick: () => void;
}

export class LineWidthButton extends Component<LineWidthButtonProps> {
  render() {
    const { isActive, onClick } = this.props;

    return (
      <GenericButton isActive={isActive} onClick={onClick}>
        <LineWidthIcon src={svg} />
        <OptionsIcon isActive={isActive} />
      </GenericButton>
    );
  }
}
